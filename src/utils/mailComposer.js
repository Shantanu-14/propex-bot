function mailComposer(userDetails, email, solutionName) {
	//console.log(userDetails,email)
	let name = "";
	if (userDetails.name !== undefined) name = userDetails.name;
	else {
		name = email.split("@")[0];
		name = name.charAt(0).toUpperCase() + name.slice(1);
	}
	return {
		email,
		subject: `Case Study on ${solutionName}`,
		body: `Hi ${name},<br><br>
              Please find the requested document attached.<br><br>
              Best Regards,<br>
              Online 24*7`
	};
}
function currentTimestamp() {
	let dt = new Date();
	let currentOffSet = 330;
	let timeZoneOffSet = dt.getTimezoneOffset();
	dt = new Date(dt.getTime() + (currentOffSet + timeZoneOffSet) * 60000);
	//console.log(dt);
	return dt;
  }
// function mailComposerForLink(userDetails, email, solutionName) {
// 	let name = "";
// 	if (userDetails.name !== undefined) name = userDetails.name;
// 	else {
// 		name = email.split("@")[0];
// 		name = name.charAt(0).toUpperCase() + name.slice(1);
// 	}
// 	return {
// 		email,
// 		subject: `Case Study Link of ${solutionName}`,
// 		body: `Hi ${name},<br><br>
//               Please find the requested link attached.<br>
//               ${userDetails.urlToBeEmailed}<br><br>
//               Best Regards,<br>
//               Online 24*7`,
// 	};
// }

function mailComposerForLink(userDetails, email, solutionName) {
	let name = "";
	if (userDetails.name !== undefined) name = userDetails.name;
	else {
		if(email) name = email.split("@")[0];
		name = name.charAt(0).toUpperCase() + name.slice(1);
	}
	return {
		email,
		subject: `Please find the more details for the requested info:`,
		body: `Hi,<br><br>
              Please find the requested link attached.<br>
              ${userDetails.urlToBeEmailed}<br><br>
              Best Regards,<br>
              Online 24*7`,
		// body: `Hi ${name},<br><br>
        //       Please find the requested link attached.<br>
        //       ${userDetails.urlToBeEmailed}<br><br>
        //       Best Regards,<br>
        //       Online 24*7`,
	};
}

function mailComposeForSalesTeam(userDetails) {
	let name = "";
	if (userDetails.name !== undefined) name = userDetails.name;
	else {
		name = userDetails.email.split("@")[0];
		name = name.charAt(0).toUpperCase() + name.slice(1);
	}
	console.log("composing mail for sales team")
	let emailBody = ""
	let key = "";
    let serviceName = {};
    let logKey 
    if(userDetails.requestedServices){
      key = Object.keys(userDetails.requestedServices)[0]
      serviceName =userDetails.requestedServices[key] 
      logKey = key.split(".").slice(1).join(" ");
    }
    
    console.log("KEY", key);
    console.log("SERVICE NAME", serviceName);

    let logger = {
      Name: userDetails.name,
      Email: userDetails.email,
      Timestamp: currentTimestamp(), 
      "Company Name" : userDetails.companyName || "NA",
      "Phone number": userDetails.phoneNumber,
      "Lead type": "Bot Automation",
      "Service Requested": logKey?.toString() || "NA",
      "Industry": serviceName?.askIndustry || "NA",
      "Operating Location": serviceName?.askLocation || "NA",
      "Challenges": serviceName?.askChallenges || "NA",
      "Employees": serviceName?.askEmployeeNum || "NA",
      "Modules": serviceName?.askModules || "NA",
      "Current Dynamics Version": serviceName?.askDynamicsVersion || "NA",
      "Year of Implementation": serviceName?.askYear || "NA",
      "No. of Users": serviceName?.askNoOfUsers || "NA",
      "Deployment": serviceName?.askDeployment || "NA",
      "Customization": serviceName?.askCustomization || "NA",
      "No. of Companies/entities" : serviceName?.askEntitiesNum || "NA",
      "Different VAT for all entities" : serviceName?.askWhetherDiffVAT || "NA",
      "Average Invoices" : serviceName?.askInvoicesAR || "NA",
      "Current ERP" : serviceName?.askCurrentERP || "NA",
    }
	//console.log("logger", logger)
	for( let key in logger){
		if(logger[key] !== "NA"){
			emailBody += `<b>${key}</b>: ${logger[key]}<br>`
		}
	}
	//console.log("emailBody", emailBody)
	return {
		email: "dp@terracez.com",
		subject:`Terracez - Sales Lead`,
		body: `Hi Team,<br><br>
              Got a new lead now. Find the details below:<br><br>
              ${emailBody}<br>
              Thanks,<br>
              Terracez Bot`,
	};
}

function mailComposerForIndustries(userDetails, email, industries, url) {
	let name = "";
	let subject = "Read about Kanerika";
	if (userDetails.name !== undefined) name = userDetails.name;
	else {
		name = email.split("@")[0];
		name = name.charAt(0).toUpperCase() + name.slice(1);
	}
	if (industries === "Healthcare and Pharma") subject = "The Impact of Digital Transformation in Healthcare";
	else subject = `Impact of Digital Transformation in ${industries}`;
	return {
		email,
		subject,
		body: `Hi ${name},<br><br>
              Greetings. Please find the requested link below:<br>
              ${url}<br><br>
              With regards,<br>
              Online 24*7`,
	};
}

function mailComposerForTechExcellence(userDetails, email, techExcellence, url) {
	let name = "";
	let subject = "";
	if (userDetails.name !== undefined) name = userDetails.name;
	else {
		name = email.split("@")[0];
		name = name.charAt(0).toUpperCase() + name.slice(1);
	}
	if (techExcellence === "KOMPASS") subject = `Read More on KOMPASS`;
	else subject = `Read More on ${techExcellence}`;
	return {
		email,
		subject,
		body: `Hi ${name},<br><br>
              Greetings. Please find the requested link below:<br>
              ${url}<br><br>
              With regards,<br>
              Online 24*7`,
	};
}

function mailComposerForGeneral(userDetails, email, filler, url) {
	let name = "";
	let subject = "";
	if (userDetails.name !== undefined) name = userDetails.name;
	else {
		name = email.split("@")[0];
		name = name.charAt(0).toUpperCase() + name.slice(1);
	}
	return {
		email,
		subject: `Read More on ${filler}`,
		body: `Hi ${name},<br><br>
              Greetings. Please find the requested link below:<br>
              ${url}<br><br>
              With regards,<br>
              Online 24*7`,
	};
}

function mailComposerForCandidateManagement(userDetails){
	const {name, email, phoneNumber, resume} = userDetails;

	return {
		email  : "dp@terracez.com",
		subject: `I have applied for a job at Terracez!`,
		body: `Hi Dharmendra,<br><br>
					 Someone just applied for a job at Terracez. Please find the details below:<br>
					 <b>Name:</b> ${name}<br>
					 <b>Email:</b> ${email}<br>
					 <b>Phone Number:</b> ${phoneNumber}<br>
					 <b>Resume Link:</b> ${resume}<br><br>
					 Thanks,<br>
					 Terracez Bot`,
	};
}

function mailComposerForLeadManagement(userDetails){
	const {name, email, phoneNumber, resume, companyName} = userDetails;
	return {
		email  : "dp@terracez.com",
		subject: `I got a Lead for you!`,
		body: `Hi Dharmendra,<br><br>
						I captured a lead for you from the Terracez website:<br>
					 <b>Name:</b> ${name}<br>
					 <b>Email:</b> ${email}<br>
					 <b>Phone Number:</b> ${phoneNumber}<br>
					 <b>Company:</b> ${companyName}<br><br>
					 Thanks,<br>
					 Terracez Bot`,
	};
	
}

module.exports = { mailComposer, mailComposeForSalesTeam, mailComposerForLink, mailComposerForGeneral, mailComposerForTechExcellence, mailComposerForIndustries, mailComposerForCandidateManagement, mailComposerForLeadManagement };
