import AWS, { S3 } from 'aws-sdk';
import configEnv from '../config';

export default new S3({
  accessKeyId: configEnv.aws.userKey,
  secretAccessKey: configEnv.aws.userSecret,
  region: configEnv.aws.region,
});
