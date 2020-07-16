# Release Notes from Azure DevOps to DRS using CSV files 

Display Release Notes CSV file as a searchable, filterable, HTML table.


## Steps

#### 1. Download CSV File form Azure DevOps Release Notes Query:

``` URL 
https://prdr.visualstudio.com/PR/_queries/query/369f2e22-402e-406d-86be-507022abdd4e/
```

#### 2. Add the CSV file to the `input/` folder

#### 3. Trigger `format_CSV.py` to generate the `LatestReleaseNotes.csv` file

``` Python
<script>
 import csv

input_file = '../input/Release Notes.csv'
output_file = '../data/LatestReleaseNotes.csv'
cols_to_remove = [0, 1, 2, 3] # Column indexes to be removed (starts at 0)

cols_to_remove = sorted(cols_to_remove, reverse=True) # Reverse so we remove from the end first
row_count = 0 # Current amount of rows processed

with open(input_file, "r") as source:
    reader = csv.reader(source)
    with open(output_file, "w", newline='') as result:
        writer = csv.writer(result)
        for row in reader:
            row_count += 1
            print('\r{0}'.format(row_count), end='') # Print rows processed
            for col_index in cols_to_remove:
                del row[col_index]
            writer.writerow(row)
</script>