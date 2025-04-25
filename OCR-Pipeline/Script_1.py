import boto3
import os 
from dotenv import load_dotenv

load_dotenv()
# Load environment variables from .env file
access_key = os.getenv('AWS_ACCESS_KEY')
secret_key = os.getenv('AWS_SECRET_KEY')
bucket_name = os.getenv('AWS_BUCKET_NAME')
region = os.getenv('AWS_REGION')


def upload_file(filename, bucket_name, object_name=None):
    s3_client = boto3.client(
        service_name='s3',
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        region_name=region
    )

    response = s3_client.upload_file(filename, bucket_name, object_name)
    print(f"Upload response: {response}")

file_path = r"C:\Users\PC\Documents\Projects\Textract_OCR\R&D\sample_split-7-46.pdf"
object_name = os.path.basename(file_path)


if __name__ == "__main__":
    upload_file(file_path, bucket_name, object_name)