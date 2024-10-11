'use strict';

export default class UploadFileFromUrlTokens {

  s3Endpoint: string;
  s3Bucket: string;
  region: string;
  objectKey: string;

  constructor(
    s3Endpoint: string,
    s3Bucket: string,
    region: string,
    objectKey: string,
  ) {
    this.s3Endpoint = s3Endpoint;
    this.s3Bucket = s3Bucket;
    this.region = region;
    this.objectKey = objectKey;
  }

}
