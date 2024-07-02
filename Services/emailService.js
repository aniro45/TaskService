import nodemailer from "nodemailer";
import { emailServicesHostNames } from "./../constants.js";

export default class EmailService {
    // Set up nodemailer transporter
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: emailServicesHostNames.MAILTRAP,
            port: 2525,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    sendEmail(emailTemplate, operationTitle, successMessage, res) {
        this.transporter.sendMail(emailTemplate, function (error, info) {
            if (error) {
                console.log(error);
                res.status(500).json("Email could not be sent");
            } else {
                console.log("Email sent: " + info.response);
                res.status(200).json({
                    message: successMessage,
                    operationTitle,
                    emailFeedback: info.response,
                });
            }
        });
    }

    generateCollaboratorAddedTemplate(options) {
        const { toName, toTaskTitle, from, to, cc } = options;
        return {
            from,
            to,
            cc,
            subject: "You have been added as a collaborator",
            text: `Hi ${toName},\n\nYou have been added as a collaborator to the task: ${toTaskTitle}.\n\nBest,\nYour Team`,
        };
    }

    generateCollaboratorRemovedTemplate(options) {
        const { toName, toTaskTitle, from, to, cc } = options;
        return {
            from,
            to,
            cc,
            subject: "You have been removed as a collaborator",
            text: `Hi ${toName},\n\nYou have been removed as a collaborator to the task: ${toTaskTitle}.\n\nBest,\nYour Team`,
        };
    }
}
