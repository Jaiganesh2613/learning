const AWS = require('aws-sdk');

// Set AWS region
AWS.config.update({ region: 'us-east-1' });

const athena = new AWS.Athena();

const params = {
    QueryString: `SELECT * FROM "iceberg_db"."iceberg_table" where age < 1 ;`,
    ResultConfiguration: {
        OutputLocation: 's3://parquet-result-bucket/query-results/',
    },
};

async function runQuery() {
    try {
        // Start Athena query execution
        const data = await athena.startQueryExecution(params).promise();
        const queryExecutionId = data.QueryExecutionId;
        console.log('Query started, Execution ID:', queryExecutionId);

        // Wait for query to finish
        let queryStatus;
        do {
            queryStatus = await athena.getQueryExecution({ QueryExecutionId: queryExecutionId }).promise();
            console.log('Query Status:', queryStatus.QueryExecution.Status.State);
            await new Promise((resolve) => setTimeout(resolve, 2000));
        } while (queryStatus.QueryExecution.Status.State === 'RUNNING');

        // Check if query succeeded
        if (queryStatus.QueryExecution.Status.State !== 'SUCCEEDED') {
            throw new Error(
                `Query failed: ${queryStatus.QueryExecution.Status.StateChangeReason || 'Unknown reason'}`
            );
        }

        // Fetch query results
        const results = await athena.getQueryResults({ QueryExecutionId: queryExecutionId }).promise();
        const rows = results.ResultSet.Rows;

        // Get column names (headers) from the first row
        const headers = rows[0].Data.map(col => col.VarCharValue);

        // Convert rows to JSON objects
        const structuredData = rows.slice(1).map(row => {
            const rowData = row.Data.map(col => col.VarCharValue || null);
            return headers.reduce((obj, header, index) => {
                obj[header] = rowData[index];
                return obj;
            }, {});
        });

        // Display full structured data
        // console.log('Structured Data:', JSON.stringify(structuredData, null, 2));

        // Format & print all rows cleanly
        structuredData.forEach((row, i) => {
            console.log(`\nRow ${i + 1}:`);
            Object.entries(row).forEach(([key, value]) => {
                console.log(`  ${key}: ${value}`);
            });
        });

    } catch (err) {
        console.error('Error running query:', err.message);
    }
}

runQuery();
