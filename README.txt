S3 Bucket

The Homey S3 Bucket app allows you to upload files to an Amazon S3 or any compatible cloud storage service like Wasabi directly from your Homey system. The uploaded files can be used in Homey flows, automations, or shared externally by adjusting their access level based on the flow setup. This app simplifies interactions with S3-compatible services, making cloud storage easy and flexible for home automation tasks.

App Configuration
To use the S3 Bucket app, follow these steps:

	1.	Set up an S3-Compatible Bucket:
	•	Create an S3 bucket on your chosen provider (e.g., AWS, Wasabi, etc.). For AWS, follow this guide: Create an S3 Bucket on AWS. For Wasabi, refer to the Wasabi Bucket Creation Guide.
	2.	Obtain Access Credentials:
	•	Retrieve your access key and secret key from your cloud storage provider. For AWS, you can generate these keys from the IAM dashboard. Similarly, for Wasabi or other S3-compatible services, follow their respective guides.
	3.	Find and Configure Your S3 Endpoint:
	•	You’ll need to provide the specific S3 endpoint URL for the service you are using. This varies depending on your provider.
	•	For AWS: Endpoints are typically in the format https://s3.<region>.amazonaws.com. For example, if your bucket is hosted in the us-east-1 region, the endpoint would be https://s3.us-east-1.amazonaws.com.
	•	For Wasabi: Endpoints are in the format https://s3.<region>.wasabisys.com. For example, for the us-east-1 region, the endpoint would be https://s3.us-east-1.wasabisys.com.
	•	You can find the endpoint information in your cloud provider’s documentation or by checking the bucket’s details in the provider’s console.
	4.	Configure Bucket Policy (Optional):
	•	If you want your files to be publicly accessible, configure the bucket’s policy accordingly. For AWS, see Bucket Policy Examples, or follow the instructions for your provider.

Device Configuration
Once your bucket and credentials are ready, configure the app in Homey:

	1.	Add a New Device in Homey:
	•	Open the Homey app and add a new device.
	•	Select “S3 Bucket” from the device list.
	2.	Fill in the following settings:
	•	Access Key ID: Your S3 provider’s access key.
	•	Secret Access Key: Your S3 provider’s secret key.
	•	S3 Bucket Name: The name of the bucket where files will be uploaded.
	•	Region: The AWS region (or the region for your S3-compatible provider) where your bucket is hosted (e.g., us-east-1 for AWS, or a similar region for Wasabi).
	•	S3 Endpoint: The endpoint URL for your specific S3 provider and region. (See the instructions above for finding this URL.)

Use in Flows
Once configured, you can use the Homey S3 Bucket app in your Homey flows to automatically upload files to your S3-compatible bucket. Whether files should be public or private can be controlled within the flow setup, making it easy to adjust for each use case.

For example:

	•	Upload sensor data, logs, or media (e.g., images or videos) to your cloud storage.
	•	Use the public URL of the uploaded files in notifications, emails, or external apps.

Example Flow
Set up a flow where an image or log file is uploaded to S3 after a trigger event:

When motion is detected → Upload image to S3 → (optional) Send public link via notification

The app automatically determines whether to upload files as public or private based on your flow’s needs.

Example Use Case
Here’s an example where a motion sensor triggers the camera, and the captured image is uploaded to your S3-compatible storage:

When motion is detected → Upload image to Wasabi S3 bucket → Use the uploaded file in your automations
