const AWS = require('aws-sdk');

// Set AWS region
AWS.config.update({ region: 'us-east-1' });

const athena = new AWS.Athena();

const params = {
    // QueryString: `INSERT INTO "iceberg_db"."json_iceberg_table"
    //               VALUES (7, 'The Matrix', 'Sci-Fi', 1999, 8.7);`,
    QueryString: `UPDATE "iceberg_db"."json_iceberg_table"
                  SET rating = 8.7
                  WHERE movie_id = 7;`,
    // QueryString: `DELETE FROM "iceberg_db"."json_iceberg_table" WHERE movie_id = 7;`,
    ResultConfiguration: {
        OutputLocation: 's3://parquet-result-bucket/query-results/',
    },
};

async function runInsertQuery() {
    try {
        // Start Athena query execution
        const data = await athena.startQueryExecution(params).promise();
        const queryExecutionId = data.QueryExecutionId;
        console.log('Insert query started, Execution ID:', queryExecutionId);

        let queryStatus;
        do {
            queryStatus = await athena.getQueryExecution({ QueryExecutionId: queryExecutionId }).promise();
            console.log('Query Status:', queryStatus.QueryExecution.Status.State);
            await new Promise((resolve) => setTimeout(resolve, 2000));
        } while (queryStatus.QueryExecution.Status.State === 'RUNNING');

        if (queryStatus.QueryExecution.Status.State !== 'SUCCEEDED') {
            throw new Error(
                `Query failed: ${queryStatus.QueryExecution.Status.StateChangeReason || 'Unknown reason'}`
            );
        }

        console.log('Insert successful!');

    } catch (err) {
        console.error('Error running insert query:', err.message);
    }
}

runInsertQuery();
