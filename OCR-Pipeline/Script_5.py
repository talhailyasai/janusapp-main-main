from Script_4 import *
import matplotlib.pyplot as plt

# print(plt.style.available)

def cleanup_files(bucket_name, object_name, local_file="output.txt"):
    try:
        s3_client = boto3.client('s3')        
        s3_client.delete_object(
            Bucket=bucket_name,
            Key=object_name
        )
        print(f"Deleted {object_name} from S3 bucket {bucket_name}")
        
        if os.path.exists(local_file):
            os.remove(local_file)
            print(f"Deleted local file: {local_file}")
            
    except Exception as e:
        print(f"Error during cleanup: {str(e)}")

def visualize_data(df, summary_df):
    """Create comprehensive visualizations from the dataframes"""
    # Drop 'Table Count' column from summary_df
    summary_df = summary_df.drop(['Table_Count', 'Cost_enteries', 'Min_Cost', 'Max_Cost'], axis=1)
    summary_df = summary_df.set_index('Year')
    try:
        # Set style for better looking graphs
        plt.style.use('seaborn-v0_8')
        summary_df.plot(kind='bar', xlabel= 'Year', ylabel= 'Costs', title= 'Yearly Costs Summary', stacked=False)
        plt.show()

        
    except Exception as e:
        print(f"Error creating visualizations: {str(e)}")

if __name__ == "__main__":

    pages = load_ocr_data("output.txt") 
    blocks_by_id = block_lookup(pages)
    lines = get_lines(pages, blocks_by_id)
    tables = get_tables(pages, blocks_by_id)
    df, summary_df = statistical_analysis(tables, lines)
    print("Summary DataFrame:\n", summary_df)

    # Generate visualizations
    visualize_data(df, summary_df)

# Cleanup
# cleanup_files(bucket_name, object_name)
