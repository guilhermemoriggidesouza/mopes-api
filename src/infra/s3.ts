import AWS from 'aws-sdk';
import config from '../config';

AWS.config.update({
  region: 'us-west-2',
});

export default new AWS.S3({
  accessKeyId: config.aws.userKey,
  secretAccessKey: config.aws.userSecret,
  region: config.aws.region,
});
