'use strict';

import Homey from 'homey';
import {
  S3Client, PutObjectCommand, ObjectCannedACL, S3ClientConfig, PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import axios from 'axios';
import { Readable } from 'stream';
import * as stream from 'stream';
import mime from 'mime-types';

export default class S3BucketDriver extends Homey.Driver {

  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
    this.log('S3 Bucker Driver Driver has been initialized');
  }

  // Function to download a file from a URL and return it as a Buffer
  async downloadFileAsBuffer(url: string): Promise<Buffer> {
    try {
      const response = await axios({
        method: 'get',
        url,
        responseType: 'arraybuffer', // This returns the response as a Buffer
      });

      console.log(`File downloaded from ${url}`);
      return Buffer.from(response.data);
    } catch (error) {
      console.error('Error downloading the file: ', error);
      throw error;
    }
  }

  async uploadToS3(
    s3Endpoint: string,
    region: string,
    accessKeyId: string,
    secretAccessKey: string,
    bucketName: string,
    objectKey: string,
    isPublic: boolean,
    data: Buffer | NodeJS.ReadableStream,
  ): Promise<void> {
    /** Start Home Directory Hack * */
    console.log(data);
    process.env.HOME = '/tmp';
    /** End Home Directory Hack * */
    const s3ClientConfig: S3ClientConfig = {
      endpoint: s3Endpoint,
      region, // Replace with your S3 bucket's region
      credentials: {
        accessKeyId, // Replace with your Access Key ID
        secretAccessKey, // Replace with your Secret Access Key
      },
    };
    const s3 = new S3Client(s3ClientConfig);
    let body : Readable | Buffer;
    if (data instanceof Buffer) {
      body = data;
    } else {
      body = stream.Readable.from(data);
    }

    // const mimeType = await this.extractMimeType(body);
    try {
      const uploadParams = {
        Bucket: bucketName, // Replace with your bucket name
        Key: objectKey, // The key (name) to save the file as in S3
        ContentType: this.extractMimeType(objectKey), // Set the MIME type
        Body: body, // Use the buffer as the body,
        ACL: isPublic ? ObjectCannedACL.public_read : ObjectCannedACL.private, // Set ACL based on isPublic boolean
      };
      const uploadCommand: PutObjectCommand = new PutObjectCommand(uploadParams as PutObjectCommandInput);
      await s3.send(uploadCommand);
      console.log(`File uploaded successfully to ${bucketName}/${objectKey}`);
      return Promise.resolve();
    } catch (error) {
      console.error('Error uploading to S3: ', error);
      return Promise.reject(error);
    }
  }

  private extractMimeType(fileName: string): string {
    // Use file extension to detect MIME type if a file name is provided
    return mime.lookup(fileName) || 'application/octet-stream';
  }

}

module.exports = S3BucketDriver;
