'use strict';

import Homey from 'homey';
import { S3Client, PutObjectCommand, ObjectCannedACL, S3ClientConfig } from '@aws-sdk/client-s3';
import axios from 'axios';

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

  async uploadBufferToS3(
    s3Endpoint: string,
    region: string,
    accessKeyId: string,
    secretAccessKey: string,
    bucketName: string,
    objectKey: string,
    isPublic: boolean,
    fileBuffer: Buffer,
  ): Promise<void> {
    /** Start Home Directory Hack * */
    process.env.HOME = '/tmp';
    /** End Home Directory Hack * */
    const s3ClientConfig : S3ClientConfig = {
      endpoint: s3Endpoint,
      region: region, // Replace with your S3 bucket's region
      credentials: {
        accessKeyId, // Replace with your Access Key ID
        secretAccessKey, // Replace with your Secret Access Key
      },
    };
    const s3 = new S3Client(s3ClientConfig);

    try {
      const uploadParams = {
        Bucket: bucketName, // Replace with your bucket name
        Key: objectKey, // The key (name) to save the file as in S3
        Body: fileBuffer, // Use the buffer as the body
        ACL: isPublic ? ObjectCannedACL.public_read : ObjectCannedACL.private, // Set ACL based on isPublic boolean
      };
      const uploadCommand = new PutObjectCommand(uploadParams);
      await s3.send(uploadCommand);
      console.log(`File uploaded successfully to ${bucketName}/${objectKey}`);
    } catch (error) {
      console.error('Error uploading to S3: ', error);
      throw error;
    }
  }

}

module.exports = S3BucketDriver;
