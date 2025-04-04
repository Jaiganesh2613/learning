from pyspark.sql import SparkSession

# Initialize Spark session
spark = SparkSession.builder \
    .appName("CSV to Iceberg") \
    .config("spark.sql.catalog.iceberg", "org.apache.iceberg.spark.SparkCatalog") \
    .config("spark.sql.catalog.iceberg.type", "hadoop") \
    .config("spark.sql.catalog.iceberg.warehouse", "s3://aws-iceberg-bucket/") \
    .getOrCreate()

# Read CSV file from S3
csv_df = spark.read \
    .option("header", "true") \
    .option("inferSchema", "true") \
    .csv("s3://aws-iceberg-csv-bucket/demo.csv")

# Write to Iceberg table
csv_df.write \
    .format("iceberg") \
    .mode("append") \
    .save("iceberg.db.table")

print("✅ Data successfully loaded into Iceberg table!")
