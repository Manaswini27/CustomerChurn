import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression  # You can change this to other models
import joblib  # For saving and loading models
import os

def train_and_save_model(data_file, model_file):
    """
    Trains a machine learning model on the given data and saves it.

    Args:
        data_file (str): Path to the CSV data file.
        model_file (str): Path to save the trained model.
    """
    try:
        # 1. Load the data
        df = pd.read_csv(data_file)
    except FileNotFoundError:
        print(f"Error: Data file not found at {data_file}.")
        return None  # Important: Return None on error
    except Exception as e:
        print(f"Error loading data: {e}")
        return None # Important: Return None on error

    # 2. Data Preprocessing
    # Assuming your dataset.csv has these columns: 'tenure', 'avgOrderValue', 'totalSpent'
    features = ['tenure', 'avgOrderValue', 'totalSpent']
    target = 'IsActive'  # You'll need to create this target variable.  I'll show how.

    #  Create a target variable 'IsActive'.  For demonstration,
    #  I'll create a simple rule:  'IsActive' is 1 if totalSpent is above the median
    median_total_spent = df['totalSpent'].median()
    df[target] = (df['totalSpent'] > median_total_spent).astype(int) # Create the 'IsActive' column

    if not all(col in df.columns for col in features + [target]):
        print(f"Error:  Data file is missing required columns.  Expected {features} and {target}")
        return None  # Return None if expected columns are missing.

    X = df[features]
    y = df[target]

    # 3. Feature Scaling
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # 4. Split the data
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

    # 5. Choose and train a model
    model = LogisticRegression()  # You can change this line to use a different model
    model.fit(X_train, y_train)

    # 6. Save the trained model
    try:
        joblib.dump(model, model_file)
        print(f"Successfully saved model to {model_file}")
        return scaler # Return the scaler
    except Exception as e:
        print(f"Error saving model: {e}")
        return None  # Return None on error

def predict_activity(customer_data, model, scaler):
    """
    Predicts customer activity (e.g., "High" or "Low") using a pre-trained model.

    Args:
        customer_data (dict): A dictionary containing customer data with keys
            matching the feature names used during training
            (e.g., {'tenure': 12, 'avgOrderValue': 25.0, 'totalSpent': 300}).
        model: A pre-trained machine learning model (loaded from a file).
        scaler:  The scaler used to scale the training data.

    Returns:
        str:  "High" or "Low" activity, or "N/A" if prediction fails.
    """
    if model is None or scaler is None:
        return "N/A"

    try:
        #  Ensure the order of features matches the model's training
        features = np.array([
            customer_data['tenure'],
            customer_data['avgOrderValue'],
            customer_data['totalSpent']
        ]).reshape(1, -1)  # Reshape for single sample

        # Scale the features using the same scaler that was used for training
        scaled_features = scaler.transform(features)
        prediction = model.predict(scaled_features)[0]
        return "High" if prediction == 1 else "Low"  # Adapt to your model's output

    except Exception as e:
        print(f"Error during prediction: {e}")
        return "N/A"  # Handle errors robustly

if __name__ == "__main__":
    # 1. Define file paths
    data_file = 'api/data/dataset.csv'  # Path to your dataset
    model_file = 'api/model.joblib'  # Path to save the trained model

    # 2. Train and save the model
    scaler = train_and_save_model(data_file, model_file) # Get the scaler

    if scaler is not None: # Only proceed if model training was successful
        # 3. Load the trained model
        try:
            trained_model = joblib.load(model_file)
            print(f"Loaded model from {model_file}")
        except Exception as e:
            print(f"Error loading model: {e}")
            trained_model = None  # Set to None to prevent errors in prediction

        # 4. Example prediction
        if trained_model is not None:
            new_customer_data = {
                'tenure': 100,
                'avgOrderValue': 30,
                'totalSpent': 3000
            }
            prediction = predict_activity(new_customer_data, trained_model, scaler)
            print(f"Prediction for new customer: {prediction}")
    else:
        print("Model training failed.  Cannot perform prediction.")
