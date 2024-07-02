export function getFileName(fileName) {
    if (fileName) {
        return Date.now() + "-" + fileName;
    }
}

export function generateS3ObjectURL(bucketName, objectKey) {
    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${objectKey}`;
}
