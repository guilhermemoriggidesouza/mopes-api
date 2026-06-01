import AWS, { S3 } from 'aws-sdk';
import configEnv from '../config';

const isLocal = process.env.NODE_ENV === 'development';

export default new S3({
  accessKeyId: configEnv.aws.userKey,
  secretAccessKey: configEnv.aws.userSecret,
  region: configEnv.aws.region,

  ...(isLocal && {
    endpoint: 'http://localhost:9000',
    s3ForcePathStyle: true,
    sslEnabled: false,
  }),
});