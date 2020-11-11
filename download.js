const AWS = require("aws-sdk");
const fs = require('fs');

/**
 * Define required command line arguments utilizing Yargs tools
 */
const argv = require('yargs/yargs')(process.argv.slice(2))
    .usage('Usage: $0 <command> [options]')
    .example('node $0 --s awsBucket --ak <insert key> --secretak <insert key> --r us-west-2 --dir ./tmp/')
    .option('s3Bucket', {
      alias: 's',
      describe: 'Source bucket path',
      demandOption: true
    })
    .option('accessKey', {
      alias: 'ak',
      describe: 'Access key',
      demandOption: true
    })
    .option('secretAccessKey', {
      alias: 'secretak',
      describe: 'Secret access key',
      demandOption: true
    })
    .option('region', {
      alias: 'r',
      describe: 'Region',
      default: 'us-west-2'
    })
    .option('downloadDirectory', {
      alias: 'dir',
      describe: 'Directory path to store files downloaded from S3',
      demandOption: true
    })
    .help('h')
    .alias('h', 'help')
    .argv;

const { s3Bucket, accessKey, secretAccessKey, region, downloadDirectory } = argv;

/** 
 * Retrieve objects within bucket identified from command line.
 */
async function retrieveFilesFromBucket(bucket) {
  const s3 = new AWS.S3({
    region: region,
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey
  });

  // Retrieve file keys
  const response = await s3.listObjectsV2({
    Bucket: bucket
  }).promise();

  const sourceFileKeys = response.Contents.map(file => file.Key);

  // Use file keys to download files.
  sourceFileKeys.forEach(key => {
    s3.getObject({
        Bucket: bucket,
        Key: key
      },
      (error, data) => {
        if (error) {
          console.log(`Error retrieving ${key} from S3 bucket:`, error);
          return;
        }

        fs.writeFile(downloadDirectory + key, data.Body, error => {
          if (error) { 
            console.log(`Error downloading ${key} to ${downloadDirectory}:` + error);
          } else {
            console.log(`${key} has been saved`);
        }});
      }
    );
  });

  return sourceFileKeys;
};

retrieveFilesFromBucket(s3Bucket);