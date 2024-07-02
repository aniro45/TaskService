import { AwsCloud } from "./Services/cloudService.js";
import EmailServiceProvider from "./Services/emailServiceProvider.js";

export default class Initializer {
    constructor() {
        this.getEmaiLServices();
        this.initializeCloudService();
    }

    getEmaiLServices() {
        new EmailServiceProvider().createEmailServiceInstance();
    }

    initializeCloudService() {
        new AwsCloud().createS3Instance();
    }
}
