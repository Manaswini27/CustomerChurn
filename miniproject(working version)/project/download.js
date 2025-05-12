const fs = require('fs');
const https = require('https');
const path = require('path');

// Add your GitHub raw URLs here
const files = [
  { 
    path: 'api/model/model.joblib',
    url: 'YOUR_MODEL_URL'
  },
  { 
    path: 'api/data/dataset.csv',
    url: 'YOUR_DATASET_URL'
  }
];

async function downloadFiles() {
  for (const file of files) {
    const dir = path.dirname(file.path);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    await new Promise((resolve, reject) => {
      https.get(file.url, (response) => {
        const fileStream = fs.createWriteStream(file.path);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
      }).on('error', reject);
    });
  }
}

downloadFiles().catch(console.error);