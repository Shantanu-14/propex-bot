const integrator = require("is-integration-provider");
const { leadGenaratedLogs, serviceLeadsLogs } = require("../utils/logger");
const dateValidator = require("../helpers/dateValidator");
const numberController = {
  number: (req, res) => {
    let { conversationData } = req.body;
    // console.log(conversationData)
    console.log("Inside number Intent");
    let previousIntentName = "";
    if (!conversationData) {
      conversationData = {};
      previousIntentName = "";
    } else {
      previousIntentName = conversationData.previousIntentName;
    }
    if (!conversationData.previousIntentName) previousIntentName = "none";
    const number = conversationData.slotValues["number"].numberValue;
    //handling negative number input by user
    const finalNumber = number.toString().replace(/ /g,'')
    if(finalNumber[0] === '-' && isDigit(finalNumber[1])) {
      let responseObject = integrator.conditionCreater("negativeNumber");
      let result = integrator.responseCreater(responseObject, conversationData);
      return res.status(result.statusCode).json(result);
    } 
    console.log("Number ---- ", number);
    if (previousIntentName === "agent.contactUs") {
      //contact Us
      console.log("Inside Phone number");
      if (!phoneNumberValidator(number)) {
        console.log("Invalid phone number");
        let responseObject = integrator.conditionCreater("invalidPhoneNumber");
        let result = integrator.responseCreater(
          responseObject,
          conversationData
        );
        return res.status(result.statusCode).json(result);
      }
      // conversationData.slotValues["number"].stringValue = number;
      conversationData.userDetails.phoneNumber = number.toString();
      let slots = ["name", "phoneNumber", "email"];
      const allData = conversationData.userDetails;
      let toAskConditions = slots.filter((slot) => !allData[slot]);
      let responseObject = {};
      if (toAskConditions.length > 0) {
        let toAsk = toAskConditions[0];
        if (`ask${toAsk[0].toUpperCase() + toAsk.slice(1)}` === "askEmail") {
          let replaceMentArray = [];
          if (conversationData.userDetails.phoneNumber) {
            const phoneReceivedMsg = `I have noted your phone number as ${conversationData.userDetails.phoneNumber}.`;
            replaceMentArray = integrator.replaceMentValuesArrayConstructor(
              ["$userName", "$phoneConfirm"],
              [conversationData.userDetails.name, phoneReceivedMsg],
              ["message", "message"]
            );
          } else {
            replaceMentArray = integrator.replaceMentValuesArrayConstructor(
              ["$userName", "$phoneConfirm"],
              [conversationData.userDetails.name, " "],
              ["message", "message"]
            );
          }
          responseObject = integrator.mutipleValueReplacer(
            "askEmail",
            replaceMentArray
          );
        } else {
          responseObject = integrator.conditionCreater(
            `ask${toAsk[0].toUpperCase() + toAsk.slice(1)}`
          );
        }
      } else if (!conversationData.userDetails.companyName) {
        console.log("ASKED CONDITIONS", conversationData.askedConditions)
        conversationData.askedConditions[conversationData.previousIntentName].push("askCompanyName");
        conversationData.isFreeText = true;
        conversationData.previousIntentName = "agent.contactUs";
        conversationData.intentFromAPI = "agent.contactUs";
        responseObject = integrator.singleValueReplacer(
          "askCompanyName",
          "$userName",
          conversationData.userDetails.name,
          "message"
        );
      } else {
        console.log("I AM HERE");
        conversationData.leadInserted = true;
        conversationData.userDetails.isCandidate
          ? leadGenaratedLogs(conversationData.userDetails)
          : serviceLeadsLogs(conversationData.userDetails);
        responseObject = integrator.singleValueReplacer(
          "finalMessage",
          "$userName",
          conversationData.userDetails.name,
          "message"
        );
      }
      let result = integrator.responseCreater(responseObject, conversationData);
      return res.status(result.statusCode).json(result);
    } else if (previousIntentName === "agent.upgradingDynamics") {
      console.log("Inside upgrading dynamics");
      const { conditionAsked } = conversationData;
      let responseObject = {};
      let result = {};
      conversationData.previousIntentName = "agent.upgradingDynamics";
      conversationData.intentFromAPI = "agent.upgradingDynamics";
      if (conditionAsked === "askYear" || conditionAsked === "invalidDate") {
        if (!dateValidator(conversationData.userMessage)) {
          responseObject = integrator.conditionCreater("invalidDate");
          result = integrator.responseCreater(responseObject, conversationData);
          return res.status(result.statusCode).json(result);
        }
        conversationData = storeData(
          conversationData,
          "agent.upgradingDynamics",
          conversationData.userMessage
        );
        responseObject = integrator.conditionCreater("askNoOfUsers");
        conversationData.askedConditions[conversationData.previousIntentName].push("askNoOfUsers");
        result = integrator.responseCreater(responseObject, conversationData);
        return res.status(result.statusCode).json(result);
      } else if (conditionAsked === "askNoOfUsers") {
        console.log("askCustomization ");
        conversationData.isFreeText = true;
        conversationData.askedConditions[conversationData.previousIntentName].push("askCustomization");
        conversationData = storeData(
          conversationData,
          "agent.upgradingDynamics",
          number
        );
        responseObject = integrator.conditionCreater("askCustomization");
        result = integrator.responseCreater(responseObject, conversationData);
        return res.status(result.statusCode).json(result);
      }
    } else if (previousIntentName === "agent.implementingDynamics") {
      console.log("Inside implementing Dynamics");
      conversationData.previousIntentName = "agent.implementingDynamics";
      conversationData.intentFromAPI = "agent.implementingDynamics";
      conversationData.askedConditions[conversationData.previousIntentName].push("askLocation");
      conversationData.conditionAsked = "askLocation";
      conversationData = storeData(
        conversationData,
        "agent.implementingDynamics",
        number
      );
      let responseObject = integrator.conditionCreater("askLocation");
      let result = integrator.responseCreater(responseObject, conversationData);
      return res.status(result.statusCode).json(result);
    } else if (
      previousIntentName === "agent.offshoreOnshore" ||
      previousIntentName === "agent.freeAudit"
    ) {
      const intent = previousIntentName;
      console.log("Inside offshoreOnshore");
      conversationData.previousIntentName = intent;
      conversationData.intentFromAPI = intent;
      conversationData.isFreeText = true;
      conversationData.askedConditions[conversationData.previousIntentName].push("askCustomization");
      conversationData = storeData(conversationData, intent, number);
      let responseObject = integrator.conditionCreater("askCustomization");
      let result = integrator.responseCreater(responseObject, conversationData);
      return res.status(result.statusCode).json(result);
    } else if (previousIntentName === "agent.products.automation") {
      const intent = previousIntentName;
      if(!conversationData.askedConditions) {
        conversationData.askedConditions = {}
        conversationData.askedConditions[conversationData.previousIntentName] = []
      }
      console.log("Number", number);
      if (number > 1) {
        console.log("Inside diff vat");
        conversationData.isFreeText = true;
        conversationData.previousIntentName = "agent.products.automation";
        conversationData.intentFromAPI = "agent.products.automation";
        console.log("ASKED CONDITIONS",conversationData.askedConditions[intent])
        conversationData.askedConditions[intent].push("askWhetherDiffVAT");
        conversationData = storeData(
          conversationData,
          "agent.products.automation",
          number
        );
        let responseObject = integrator.conditionCreater("askWhetherDiffVAT");
        let result = integrator.responseCreater(
          responseObject,
          conversationData
        );
        return res.status(result.statusCode).json(result);
      } else {
        console.log("Inside invoices ar");
        conversationData.isFreeText = true;
        conversationData.previousIntentName = "agent.products.automation";
        conversationData.intentFromAPI = "agent.products.automation";
        conversationData.askedConditions[conversationData.previousIntentName].push("askWhetherDiffVAT");
        conversationData.askedConditions[conversationData.previousIntentName].push("askInvoicesAR");
        conversationData = storeData(
          conversationData,
          "agent.products.automation",
          1
        );
        let responseObject = integrator.conditionCreater("askInvoicesAR");
        let result = integrator.responseCreater(
          responseObject,
          conversationData
        );
        return res.status(result.statusCode).json(result);
      }
    } else {
      if (previousIntentName === "none") {
        console.log("No previous intent");
        if (phoneNumberValidator(number)) {
          if (!conversationData.userDetails) conversationData.userDetails = {};
          conversationData.userDetails.phoneNumber = number.toString();
          console.log("asking name in contact");
          let responseObject = integrator.conditionCreater("askName");
          let result = integrator.responseCreater(
            responseObject,
            conversationData
          );
          return res.status(result.statusCode).json(result);
        } else {
          console.log("complete default");
          let responseObject = integrator.conditionCreater("Default response");
          let result = integrator.responseCreater(responseObject);
          return res.status(result.statusCode).json(result);
        }
      }
    }
  },
};

const storeData = (conversationData, intent, message) => {
  if (!conversationData.userDetails.requestedServices)
    conversationData.userDetails.requestedServices = {};
  if (!conversationData.userDetails.requestedServices[intent])
    conversationData.userDetails.requestedServices[intent] = {};
  conversationData.userDetails.requestedServices[intent][
    conversationData.conditionAsked
  ] = message.toString();
  return conversationData;
};

const phoneNumberValidator = (number) => {
  const phoneNumber = number.toString().replace(/[^\d]/g, "");
  if (phoneNumber.length >= 8 && phoneNumber.length <= 15) {
    return true;
  }
  return false;
};
module.exports = numberController;

//checks if the character is a digit
const isDigit = (char) => {
  return /\d/.test(char);
}
