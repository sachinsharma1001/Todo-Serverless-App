import 'source-map-support/register';
import * as AWS from 'aws-sdk';
const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS);

export class TodosAws {

    constructor(
        private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
        private readonly bucketName = process.env.IMAGES_S3_BUCKET
    ) {}

    async uploadGeneratedUrl(todoId: string): Promise<string> {
        const uploadUrl = this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: todoId,
            Expires: 300
        });

        return uploadUrl;
    }

    async attachmentUrl(todoId: string): Promise<string> {
        const attachmentUrl = `https://${this.bucketName}.s3.amazonaws.com/${todoId}`;
        return attachmentUrl;
    }
}