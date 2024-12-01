import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";
require('dotenv').config();

const ses = new SESClient({ region: process.env.AWS_REGION || "sa-east-1" });

function createSendEmailCommand(toAddress: string, fromAddress: string, message: string) {
    return new SendEmailCommand({
        Destination: {
            ToAddresses: [toAddress],
        },
        Source: fromAddress,
        Message: {
            Subject: {
                Charset: 'UTF-8',
                Data: "Your one-time password",
            },
            Body: {
                Text: {
                    Charset: 'UTF-8',
                    Data: message,
                },
            },
        },
    });
}

export async function sendEmailToken(email: string, token: string) {
    console.log("email: ", email, token);

    const message = `Your one-time password: ${token}`;
    const command = createSendEmailCommand(email, "whatsthetape@gmail.com", message);

    try {
        return await ses.send(command);
    } catch (e) {
        console.error("Error sending email", e);
        return e;
    }
}
