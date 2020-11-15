# AWS to GCP Overview 
Node.js scripts to move a single AWS S3 bucket to a single Google Compute Cloud bucket. The ```download.js``` script handles downloading files from AWS S3 while ```upload.js``` script handles the upload to GCP Storage. The benefit of separating these tasks is reducing the costs of if one fails, especially since AWS S3 and GCP Storage incurs costs for data retrievals and requests. For example, if uploading fails, then you would not need to redownload files from S3 and vice versa. 

## Usage
To download files from AWS S3:

Run 
``` bash 
node download.js --s3Bucket tg-test-01 --accessKey <insert-key> --secretAccessKey <insert-key> --downloadDirectory ./tmp/
```

To upload files to GCP Storage:

Run 
``` bash 
node upload.js --gcpBucket tg-test-01 --downloadDirectory ./tmp/ --serviceAccountKeyPath <insert-dir-path>
```

Use the command ```--help``` for bash command details.

## Current Limitations
- Assumes destination and source are established buckets.
- Files are saved to disk, thus it is limited to ones device and may not support very large data transfers.

## Further Considerations
- Ability to create buckets if one does not exist.
- Bookkeeping error status codes and determining if uploads can be immediately retried.

## Questions
**Carly La**
https://www.linkedin.com/in/carlyla/
