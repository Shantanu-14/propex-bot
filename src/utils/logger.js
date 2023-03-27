const { GoogleSpreadsheet } = require("google-spreadsheet");
// const creds = require("../../logger-320014-4cb5e5e3ec27.json");
const creds = require("../../terracez-bot-a86304d8bfb8.json");
const doc = new GoogleSpreadsheet(
  "1rqbenZhsTGv1rgjAxN_2578vuyjpIgaOioI8lT7LM7E"
); //sheet1
function currentTimestamp() {
  let dt = new Date();
  let currentOffSet = 330;
  let timeZoneOffSet = dt.getTimezoneOffset();
  dt = new Date(dt.getTime() + (currentOffSet + timeZoneOffSet) * 60000);
  //console.log(dt);
  return dt;
}

async function solutionLogs(conversationData, body) {
  await doc.useServiceAccountAuth({
    client_email: creds.client_email,
    private_key: creds.private_key,
  });
  let logger = {
    Email: conversationData.email,
    "Viewed Data": body,
    "Mail Status": conversationData.mailStatus,
    Timestamp: currentTimestamp(),
  };
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[1];
  sheet.addRow(logger);
}

async function conversationsLogs(userId, userMessage, intentName, responseObj) {
  await doc.useServiceAccountAuth({
    client_email: creds.client_email,
    private_key: creds.private_key,
  });

  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[2];

  let rowToLog = {
    "User Id": userId,
    "User Message": userMessage,
    "Intent Name": intentName,
    Timestamp: currentTimestamp(),
    "Response Object": JSON.stringify(responseObj),
  };
  console.log(":::::::::::::::::::::::::::::::::::::::::::::");
  console.dir(rowToLog, { depth: null, colors: true });
  // console.dir(JSON.stringify(responseObj), { depth: null, colors: true });
  console.log(":::::::::::::::::::::::::::::::::::::::::::::");

  if (userMessage !== "init") sheet.addRow(rowToLog);
}

async function loaderLogs(userMessage, responseObject) {
  await doc.useServiceAccountAuth({
    client_email: creds.client_email,
    private_key: creds.private_key,
  });

  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[3];
  //console.log(sheet, userMessage);
  const rowToLogInit = {
    "User Message": userMessage,
    Timestamp: currentTimestamp(),
    "Response Object": JSON.stringify(responseObject),
  };
  if (userMessage === "init") {
    sheet.addRow(rowToLogInit);
  }
}

async function analyticsLogs() {
  await doc.useServiceAccountAuth({
    client_email: creds.client_email,
    private_key: creds.private_key,
  });

  await doc.loadInfo();

  let leadsCount = doc.sheetsByIndex[0];
  let mailedCount = doc.sheetsByIndex[1];
  let numberOfConversations = doc.sheetsByIndex[2];
  let loaderCount = doc.sheetsByIndex[3];
  let result = {
    TimeStamp: currentTimestamp(),
    "Lead Count": (await leadsCount.getRows()).length,
    "Mailed Count": (await mailedCount.getRows()).length,
    Conversations: (await numberOfConversations.getRows()).length,
    "Number of Hits": (await loaderCount.getRows()).length,
  };
  return result;
}

async function leadGenaratedLogs(conversationData) {
  // console.log("CONVERSATION=====>", conversationData);
  try {
    await serviceLeadsLogs(conversationData);
    await doc.useServiceAccountAuth({
      client_email: creds.client_email,
      private_key: creds.private_key,
    });
    console.log("Await 1");
    let logger = {
      Name: conversationData.name,
      Email: conversationData.email,
      Timestamp: currentTimestamp(),
      "Phone number": conversationData.phoneNumber,
      "Lead type": "Bot Automation",
      "Company Name": conversationData.companyName || "Not Provided"
      //"Description/Message": conversationData.description || "Not Provided",
    };

    let sheet = doc.sheetsByIndex[0];

    if(conversationData.resume){
      logger["Resume Link"]=conversationData.resume;
      sheet = doc.sheetsByIndex[3];
      console.log("LOGGING TO CANDIDATE")
    }
    await doc.loadInfo();
    console.log("Await 2");

    sheet
      .addRow(logger)
      .then(() => {
        console.log("Added to the Sheet successfully!");
      })
      .catch((err) => {
        console.log("ERROR B");
      });
  } catch (error) {
    console.log("Inside Lead Generated Logs ERROR");
    //console.log({ error });
  }
}

async function serviceLeadsLogs(conversationData) {
  try {
    await doc.useServiceAccountAuth({
      client_email: creds.client_email,
      private_key: creds.private_key,
    });

    console.log("Await 1 in SERVICE");

    /*
    CONVERSATION DATA USER DETAILS==>  {"requestedServices":{"agent.upgradingDynamics":{"askDynamicsVersion":"badc","askYear":"2010","askNoOfUsers":200}},"email":"ak@gmail.com","name":"Ankur","phoneNumber":"8337904981"}
    */
    let key = "";
    let serviceName = {};
    let logKey 
    if(conversationData.requestedServices){
      key = Object.keys(conversationData.requestedServices)[0]
      serviceName =conversationData.requestedServices[key] 
      logKey = key.split(".").slice(1).join(" ");
    }
    
    // console.log("KEY", key);
    // console.log("SERVICE NAME", serviceName);

    let logger = {
      Name: conversationData.name,
      Email: conversationData.email,
      Timestamp: currentTimestamp(), 
      "Company Name" : conversationData.companyName || "Not Provided",
      "Phone number": conversationData.phoneNumber,
      "Lead type": "Bot Automation",
      "Service Requested": logKey?.toString() || "Not Provided",
      "Industry": serviceName?.askIndustry || "__",
      "Operating Location": serviceName?.askLocation || "__",
      "Challenges": serviceName?.askChallenges || "__",
      "Employees": serviceName?.askEmployeeNum|| "__",
      "Modules": serviceName?.askModules || "__",
      "Current Dynamics Version": serviceName?.askDynamicsVersion || "__",
      "Year of Implementation": serviceName?.askYear || "__",
      "No. of Users": serviceName?.askNoOfUsers || "__",
      "Deployment": serviceName?.askDeployment || "__",
      "Customization": serviceName?.askCustomization || "__",
      "No. of Companies/entities" : serviceName?.askEntitiesNum || "__",
      "Different VAT for all entities" : serviceName?.askWhetherDiffVAT || "__",
      "Average Invoices" : serviceName?.askInvoicesAR || "__",
      "Current ERP" : serviceName?.askCurrentERP || "__",
    }

    await doc.loadInfo();
    console.log("Await 2 in SERVICE");
    const sheet = doc.sheetsByIndex[2];
    sheet
      .addRow(logger)
      .then(() => {
        console.log("Added to the Service Sheet successfully!");
      })
      .catch((err) => {
        console.log("ERROR A");
        console.log(err)
      });

  } catch (error) {
    console.log("Inside Service Generated Logs ERROR");
    //console.log({ error });
  }
}

module.exports = {
  solutionLogs,
  conversationsLogs,
  loaderLogs,
  analyticsLogs,
  leadGenaratedLogs,
  serviceLeadsLogs
};
