const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({ region: 'us-east-1' }); // Change region as needed

// Initialize S3
const s3 = new AWS.S3();

// S3 bucket and key (file path)
const bucketName = 'mydemojsonfile';
const fileName = 'demo.json';

const getJsonFromS3 = async () => {
    try {
        const params = {
            Bucket: bucketName,
            Key: fileName
        };

        const data = await s3.getObject(params).promise();
        const jsonData = JSON.parse(data.Body.toString('utf-8'));

        console.log('JSON Data:', jsonData);
    } catch (err) {
        console.error('Error fetching JSON from S3:', err);
    }
};

getJsonFromS3();
