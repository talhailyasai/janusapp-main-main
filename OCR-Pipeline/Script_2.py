import time
import json
from Script_1 import *

def start_ocr(bucket_name=bucket_name, object_name=None, client=None):
    if object_name is None:
        raise ValueError("Target name must be provided.")
    if client is None:
        client = boto3.client(
            service_name='textract',
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            region_name=region
        )
    response = client.start_document_analysis(
        DocumentLocation={
            'S3Object': {
                'Bucket': bucket_name,
                'Name': object_name
            }
        },
        FeatureTypes=['TABLES', 'FORMS']
    )

    return response['JobId']

def check_job_progress(JobID,client=None, poll_interval=5):
    time.sleep(poll_interval)
    if client is None:
        client = boto3.client(
            service_name='textract',
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            region_name=region
        )
    response = client.get_document_analysis(JobId=JobID)
    status = response['JobStatus']
    print("Job status: {}".format(status))
    if status == 'SUCCEEDED':
        print("Job completed successfully.")
        return status
    elif status == 'FAILED':
        raise Exception(f"Job {JobID} failed.")
    while status == 'IN_PROGRESS':
        time.sleep(poll_interval)
        response = client.get_document_analysis(JobId=JobID)
        status = response['JobStatus']
        print(f"Job status: {status}")
    return status

def get_job_results(JobID, client=None):
    if client is None:
        client = boto3.client(
            service_name='textract',
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            region_name=region
        )
    pages = []
    next_token = None
    response = client.get_document_analysis(JobId=JobID)
    pages.append(response)
    next_token = response.get('NextToken')
    while next_token:
        response = client.get_document_analysis(JobId=JobID, NextToken=next_token)
        pages.append(response)
        next_token = response.get('NextToken')
    return pages

def unique_page_numbers(results, client=None):
    if client is None:
        client = boto3.client(
            service_name='textract',
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            region_name=region
        )
    # results = get_job_results(jobID, client)
    unique_pages = set()

    for result in results:
        for block in result.get("Blocks", []):
            page_num = block.get("Page")
            block_id = block.get("Id")
            if page_num:
                unique_pages.add(page_num)
                print(f"Block ID: {block_id}, Page Number: {page_num}")
            else:
                print(f"Block ID: {block_id}, Page Number: Not available")
    return sorted(unique_pages)
            

def save_results(results, output_file="output.txt"):
    with open(output_file, 'w') as f:
        for result in results:
            for block in result.get("Blocks", []):
                f.write(json.dumps(block) + "\n")
    print(f"Results saved to {output_file}")


def run_document_ocr(bucket_name=bucket_name, object_name=object_name, client=None, poll_interval=5):
    if client is None:
        client = boto3.client(
            service_name='textract',
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            region_name=region
        )
    jobId = start_ocr(bucket_name, object_name, client)
    print("Started job with id: {}".format(jobId))
    status = check_job_progress(jobId, client, poll_interval)
    if status != 'SUCCEEDED':
        raise Exception(f"Job {jobId} failed.")
    results = get_job_results(jobId, client)
    # number_of_pages = unique_page_numbers(results, client)
    # print(f"Number of pages: {number_of_pages}")

    # for result in results:
    #     for block in result.get("Blocks", []):
    #         print(json.dumps(block, indent=4))
    #         # break 
    save_results(results, output_file="output.txt")
# print(object_name)

if __name__ == "__main__":
    run_document_ocr(bucket_name=bucket_name, object_name=object_name, client=None, poll_interval=5)
