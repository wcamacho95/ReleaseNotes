import re
import os
import csv

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
output_file = '{}/input/release_list.csv'.format(BASE_DIR)

# Declare the function to return all file paths of the particular directory
def retrieve_file_paths(dirName):
 
    # setup file paths variable
    filePaths = []

    # Read all directory, subdirectories and file lists
    for root, directories, files in os.walk(dirName):
        for filename in files:
            # Create the full filepath by using os module.
            filePaths.append(filename)
         
    # return all paths
    return filePaths


if __name__ == "__main__":
    files = retrieve_file_paths('{}/data'.format(BASE_DIR))
    with open(output_file, "w") as result:
        writer = csv.writer(result)
        for filename in files:
            date_format = re.findall(r'\d{8}', filename)
            if len(date_format) > 0:
                writer.writerow([date_format[-1], filename])
