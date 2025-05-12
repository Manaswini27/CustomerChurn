from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import joblib
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
import google.generativeai as genai
from train_model import train_and_save_model  # Import the function we created

# Load environment variables
load_dotenv()

# Configure Gemini AI
genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
model = genai.GenerativeModel('gemini-pro')

app = Flask(__name__)
CORS(app)

# MongoDB connection
mongo_uri = os.getenv('MONGODB_URI')
try:
    client = MongoClient(mongo_uri)
    db = client['homebiz_insight']
    customers = db['customers']
    print("Connected to MongoDB successfully!")  # Add this line
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    #  Handle the error appropriately, e.g., exit the application or set a flag
    db = None  # Or some other default value
    customers = None

# Define file paths
DATA_FILE = 'api/data/dataset.csv'
MODEL_FILE = 'api/model.joblib'

# Global variables for the model and scaler
churn_model = None
scaler = None


def load_model_and_scaler():
    """
    Loads the pre-trained model and scaler.  This function is called when the
    Flask application starts.  It handles the case where the model file
    might not exist yet (i.e., if it needs to be trained first).
    """
    global churn_model, scaler  # Use the global variables
    try:
        scaler = joblib.load('api/scaler.joblib')
        churn_model = joblib.load(MODEL_FILE)
        print("Model and scaler loaded successfully.")
    except FileNotFoundError:
        print("Model or scaler not found.  Training the model...")
        scaler = train_and_save_model(DATA_FILE, MODEL_FILE)  # Train the model
        if scaler is not None:
            try:
                joblib.dump(scaler, 'api/scaler.joblib')
                churn_model = joblib.load(MODEL_FILE)
                print("Model trained and loaded successfully.")
            except Exception as e:
                print(f"Error: Failed to load model after training: {e}")
                churn_model = None
                scaler = None
        else:
            print("Error: Model training failed.  Predictions will be unavailable.")
            churn_model = None
            scaler = None
    except Exception as e:
        print(f"Error loading model: {e}")
        churn_model = None
        scaler = None


# Function to predict churn
def predict_churn(customer_data, model, scaler):
    """
    Predicts churn risk for a customer.

    Args:
        customer_data (dict):  Customer data.
        model:  The trained model.
        scaler: The scaler
    Returns:
        str: 'high' or 'low', or 'N/A' on error.
    """
    if model is None or scaler is None:
        return 'N/A'
    try:
        features = np.array([
            customer_data['tenure'],
            customer_data['avgOrderValue'],
            customer_data['totalSpent']
        ]).reshape(1, -1)
        scaled_features = scaler.transform(features)
        prediction = model.predict(scaled_features)[0]
        return 'high' if prediction == 1 else 'low'
    except Exception as e:
        print(f"Error in predict_churn: {e}")
        return 'N/A'


@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data['message']

        # Get customer context if available
        customer_context = ""
        if 'customerId' in data:
            customer = customers.find_one({'id': data['customerId']})
            if customer:
                customer_context = f"""
                    Customer Details:
                    - Name: {customer['name']}
                    - Email: {customer['email']}
                    - Tenure: {customer['tenure']} days
                    - Average Order Value: ${customer['avgOrderValue']}
                    - Total Spent: ${customer['totalSpent']}
                    - Loyalty Tier: {customer['loyaltyTier']}
                    - Churn Risk: {customer['churnRisk']}
                    """

        # Prepare prompt with business context
        prompt = f"""
        You are a business analytics AI assistant. Use this customer data to provide insights:
        {customer_context}

        User Question: {user_message}
        """

        # Generate response using Gemini
        response = model.generate_content(prompt)

        return jsonify({
            'response': response.text
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/customers', methods=['GET'])
def get_customers():
    try:
        customer_list = list(customers.find({}, {'_id': False}))
        return jsonify(customer_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/customers', methods=['POST'])
def add_customer():
    try:
        customer_data = request.json
        print("Received customer data:", customer_data)  # Debugging line

        # Check if the required keys are present
        required_keys = ['tenure', 'avgOrderValue', 'totalSpent']
        if not all(key in customer_data for key in required_keys):
            error_message = f"Missing required keys in customer data.  Expected: {required_keys}, Got: {list(customer_data.keys())}"
            print(error_message)  # Log the error
            return jsonify({'error': error_message}), 400  # Return a 400 Bad Request error

        # Extract the features needed for churn prediction
        features_for_prediction = {
            'tenure': customer_data['tenure'],
            'avgOrderValue': customer_data['avgOrderValue'],
            'totalSpent': customer_data['totalSpent'],
        }
        # Predict churn risk for new customer
        churn_risk = predict_churn(features_for_prediction, churn_model, scaler)

        # Add prediction to customer data
        customer_data['churnRisk'] = churn_risk

        # Save to MongoDB
        result = customers.insert_one(customer_data)
        return jsonify({
            'message': 'Customer added successfully',
            'id': str(result.inserted_id),
            'churnRisk': customer_data['churnRisk']
        })
    except Exception as e:
        print(f"Error adding customer: {e}")  # Log any exceptions
        return jsonify({'error': str(e)}), 500


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json

        # Extract features
        features = np.array([
            data['tenure'],
            data['avgOrderValue'],
            data['totalSpent']
        ]).reshape(1, -1)

        # Scale features
        scaled_features = scaler.transform(features)

        # Make prediction
        churn_risk = 'N/A'
        probability = 'N/A'
        if churn_model is not None:
            prediction = churn_model.predict(scaled_features)[0]
            churn_risk = 'high' if prediction == 1 else 'low'
            probability = float(churn_model.predict_proba(scaled_features)[0][1])

        # Update customer in MongoDB
        if 'customerId' in data:
            customers.update_one(
                {'id': data['customerId']},
                {'$set': {'churnRisk': churn_risk}}
            )

        return jsonify({
            'churnRisk': churn_risk,
            'probability': probability
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/orders', methods=['GET'])
def get_orders():
    try:
        orders = list(db['orders'].find({}, {'_id': False}))
        return jsonify(orders)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/import-dataset', methods=['POST'])
def import_dataset():
    try:
        # Read dataset
        df = pd.read_csv('api/data/dataset.csv')

        # Convert to MongoDB documents
        records = df.to_dict('records')

        # Insert into MongoDB
        customers.insert_many(records)

        return jsonify({
            'message': f'Successfully imported {len(records)} records'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    load_model_and_scaler()  # Load the model and scaler when the app starts.
    app.run(debug=True, port=5000)
