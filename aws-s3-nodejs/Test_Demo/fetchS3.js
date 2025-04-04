const AWS = require('aws-sdk');
const fs = require('fs');

AWS.config.update({ region: 'us-east-1' });

// Create S3 service object
const s3 = new AWS.S3();

const bucketName = 'nodejs-bucket-01';
const objectKey = 'All-Time Favorite Female Anime Characters (According To Fans).jpg';

const params = {
    Bucket: bucketName,
    Key: objectKey,
};

s3.getObject(params, (err, data) => {
    if (err) {
        console.error('Error fetching file:', err);
    } else {
        console.log('File downloaded successfully!');

        fs.writeFileSync(objectKey, data.Body);
        console.log(`File saved as: ${objectKey}`);
    }
});
