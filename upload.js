const { Storage } = require('@google-cloud/storage');
const fs = require('fs');

/**
 * Define required command line arguments utilizing Yargs tools
 */
const argv = require('yargs/yargs')(process.argv.slice(2))
    .usage('Usage: $0 <command> [options]')
    .example('node $0 --b gcpBucket --dir ./tmp/ --k ./tg-storage-service-account.json')
    .option('gcpBucket', {
      alias: 'b',
      describe: 'Destination bucket path',
      demandOption: true
    })
    .option('downloadDirectory', {
      alias: 'dir',
      describe: 'Directory path where files will be uploaded from to GCP',
      demandOption: true
    })
    .option('serviceAccountKeyPath', {
      alias: 'k',
      describe: 'Directory path to Google service account key',
      demandOption: true
    })
    .help('h')
    .alias('h', 'help')
    .argv;

const { gcpBucket, downloadDirectory, serviceAccountKeyPath } = argv;

// Create a GCP Storage client
const storage = new Storage({
  keyFilename: serviceAccountKeyPath
});

// Upload files from directory
function uploadFiles(bucket) {
  fs.readdir(downloadDirectory, function(error, files) {
    if (error) {
      console.log('Read directory error:', error);
      return;
    }
    
    const destinationBucket = storage.bucket(bucket);

    files.forEach(file => {
      // Uploads a local file to the bucket
      destinationBucket.upload(
        downloadDirectory + file,
        {
          gzip: true,
          metadata: {
            cacheControl: 'no-cache',
          },
        },
        (error, responseFile, apiResponse) => {
          if (error) {
            console.log(`Error uploading ${file} to Storage:`, error);
          } else {
            console.log(`Successfully uploaded ${file} to Storage.`);
          }
        });
    });
  });
};

uploadFiles(gcpBucket);