const AWS = require('aws-sdk');
const fs = require('fs');

AWS.config.update({ region: 'us-east-1' });

const s3 = new AWS.S3();

const bucketName = 'nodejs-bucket-01';
const filePath = 'C:/Users/JaiGaneshRajasekaran/aws-s3-nodejs/Itachi uciha aesthetic.jpeg';
const fileKey = 'Itachi-uchiha-aesthetic.jpeg';

const fileData = fs.readFileSync(filePath);

const params = {
    Bucket: bucketName,
    Key: fileKey,
    Body: fileData,
    ContentType: 'image/jpeg'
};

// Upload file to S3
s3.upload(params, (err, data) => {
    if (err) {
        console.error('Error uploading file:', err);
    } else {
        console.log('File uploaded successfully!', data.Location);
    }
});
