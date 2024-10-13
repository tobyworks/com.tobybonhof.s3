'use strict';

import Homey, { FlowCardAction, Image } from 'homey';
import S3BucketDriver from './driver';
import UploadTokens from './dto/UploadTokens';
import { pipeline, Readable } from 'stream';

export default class S3BucketDevice extends Homey.Device {

  s3Endpoint: string = '';
  s3Bucket: string = '';
  accessKeyId: string = '';
  accessKeySecret: string = '';
  region: string = '';

  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    this.log('S3BucketDevice has been initialized');
    const uploadFileAction = this.homey.flow.getActionCard('uploadFileFromUrl');
    uploadFileAction.registerRunListener(async (args, state): Promise<UploadTokens> => {
      this.updateSettings(this.getSettings());
      const {
        sourceUrl,
        objectKey,
        isPublic,
      } = args;
      const driver = await this.driver as S3BucketDriver;
      return this.onUploadFileFromUrl(driver, sourceUrl, objectKey, isPublic);
    });
    const uploadImageAction: FlowCardAction = this.homey.flow.getActionCard('uploadImage');
    uploadImageAction.registerRunListener(async (args, state): Promise<UploadTokens> => {
      this.updateSettings(this.getSettings());
      const {
        objectKey,
        isPublic,
      } = args;
      const driver = await this.driver as S3BucketDriver;
      const image = args.droptoken as Image;
      console.log(image);
      const stream = await image.getStream();
      return this.onUpload(driver, stream, objectKey, isPublic);
    });
  }

  async onUploadFileFromUrl(driver: S3BucketDriver, sourceUrl: string, objectKey: string, isPublic: boolean): Promise<UploadTokens> {
    const buffer = await driver.downloadFileAsBuffer(
      sourceUrl,
    );
    return this.onUpload(driver, buffer, objectKey, isPublic);
  }

  async onUpload(driver: S3BucketDriver, data: Buffer | NodeJS.ReadableStream, objectKey: string, isPublic: boolean): Promise<UploadTokens> {
    await driver.uploadToS3(
      this.s3Endpoint,
      this.region,
      this.accessKeyId,
      this.accessKeySecret,
      this.s3Bucket,
      objectKey,
      isPublic,
      data,
    );
    const tokens = new UploadTokens(
      this.s3Endpoint,
      this.s3Bucket,
      this.region,
      objectKey,
    );
    return tokens;
  }

  /**
   * onSettings is called when the user updates the device's settings.
   * @param {object} event the onSettings event data
   * @param {object} event.oldSettings The old settings object
   * @param {object} event.newSettings The new settings object
   * @param {string[]} event.changedKeys An array of keys changed since the previous version
   * @returns {Promise<string|void>} return a custom message that will be displayed
   */
  async onSettings({
    oldSettings,
    newSettings,
    changedKeys,
  }: {
    oldSettings: { [key: string]: boolean | string | number | undefined | null };
    newSettings: { [key: string]: boolean | string | number | undefined | null };
    changedKeys: string[];
  }): Promise<string | void> {
    this.updateSettings(newSettings);
  }

  updateSettings(settings: { [key: string]: boolean | string | number | undefined | null }): void {
    this.s3Endpoint = settings.s3Endpoint as string;
    this.s3Bucket = settings.s3Bucket as string;
    this.accessKeyId = settings.accessKeyId as string;
    this.accessKeySecret = settings.accessKeySecret as string;
    this.region = settings.region as string;
  }

}

module.exports = S3BucketDevice;
