const nodemailer = require("nodemailer");
const credentials = require("../config/config");
const { google } = require("googleapis");
const { solutionLogs } = require("./logger");
const OAuth2 = google.auth.OAuth2;

async function sendMail(emailId, subject, body, attachment, conversationData) {
	try {
		const senderEmail = "shantanu.b@polynomial.ai"
		const senderPassword = "Shantanu@123"
		//console.log(emailId, subject, body, attachment, conversationData);
		// const myOAuth2Client = new OAuth2(credentials.mailCreds.clientId, credentials.mailCreds.clientSecret, credentials.mailCreds.refreshToken);
		// myOAuth2Client.setCredentials({ refresh_token: credentials.mailCreds.refreshToken });
		// const myAccessToken = await myOAuth2Client.getAccessToken();
		const transport = nodemailer.createTransport({
			// host: "smtp.gmail.com",
			// port: 465,
			// secure: true,
			service : "gmail",
			auth: {
				// type: "OAuth2",
				// user: credentials.mailCreds.email,
				// clientId: credentials.mailCreds.clientId,
				// clientSecret: credentials.mailCreds.clientSecret,
				// refreshToken: credentials.mailCreds.refreshToken,
				//accessToken: myAccessToken
				user : senderEmail,
				pass : senderPassword
			},
		});
		const mailOptions = {
			from:`Terracez Bot <${senderEmail}>` , // sender address
			to: 'dp@terracez.com', // list of receivers
			subject: subject, // Subject line
			html: body, // plain text body
			attachments: attachment,
		};
		conversationData.email = emailId;
		let result = await mail(transport, mailOptions, conversationData,subject)
			.then((res) => {
				return res;
			})
			.catch((err) => {
				return err;
			});
			console.log("SUCCESSFUL MAILING!!")
		return result;
	} catch (err) {
		console.log(err);
		return { status: "failed", info: err };
	}
}

async function mail(transport, mailOptions, conversationData,subject) {
	return new Promise((resolve, reject) => {
		transport.sendMail(mailOptions, (err, info) => {
			if (err) {
				console.log(err);
				conversationData.mailStatus = "not sent";
				console.log(err);
				reject({ status: "failed", info: err });
			} else {
				console.log(info);
				conversationData.mailStatus = "sent";
				// if(subject !== "Online 24*7") solutionLogs(conversationData,subject);
				resolve({
					status: "success",
					info: info,
				});
			}
		});
	});
}

module.exports = {
	sendMail
};
