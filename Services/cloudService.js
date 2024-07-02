import AWS from "aws-sdk";

export class AwsCloud {
    static s3 = null;
    constructor() {
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });
    }

    createS3Instance() {
        if (!AwsCloud.s3) {
            AwsCloud.s3 = new AWS.S3();
        }
    }
}
