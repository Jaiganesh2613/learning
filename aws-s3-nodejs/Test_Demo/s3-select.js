const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

const s3 = new AWS.S3();

const params = {
    Bucket: 'nodejs-bucket-01',
    Key: 'demo.csv',
    ExpressionType: 'SQL',
    Expression: "SELECT s.Name, s.Age FROM S3Object s WHERE s.Country = 'USA'",
    InputSerialization: {
        CSV: {
            FileHeaderInfo: 'USE', // use headers from CSV
        }
    },
    OutputSerialization: {
        CSV: {},
    }
};

s3.selectObjectContent(params, (err, data) => {
    if (err) {
        console.error('Error querying CSV:', err);
        return;
    }

    data.Payload.on('data', (event) => {
        if (event.Records) {
            console.log('Query Result:', event.Records.Payload.toString());
        }
    });

    data.Payload.on('end', () => {
        console.log('Query completed.');
    });
});
