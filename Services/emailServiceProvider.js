import EmailService from "./emailService.js";

export default class EmailServiceProvider {
    static emailServiceInstance = null;
    createEmailServiceInstance() {
        if (!EmailServiceProvider.emailServiceInstance) {
            EmailServiceProvider.emailServiceInstance = new EmailService();
        }
    }

    destroyEmailServiceInstance() {
        emailServiceInstance = null;
    }
}
