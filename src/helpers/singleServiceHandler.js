const integrator = require("is-integration-provider");
const {
  decesionHandler,
  userAccepted,
  userDenial,
} = require("../utils/decesionHandler");
const { serviceLeadsLogs } = require("../utils/logger");
const { mailComposeForSalesTeam } = require("../utils/mailComposer");
const { sendMail } = require("../utils/mailer");

const isFreeText = (condition, freeTextConditions) => {
  if (freeTextConditions.includes(condition)) {
    return true;
  }
  return false;
};

const singleServiceHandler = async (
  conversation,
  allConditions,
  freeTextConditions,
  intent
) => {
  let conversationData = conversation;
  const { userMessage } = conversationData;
  const { conditionAsked } = conversationData;
  const { previousIntentName } = conversationData;
  console.log(JSON.stringify(conversationData));
  if (conditionAsked !== "askCustomization" && conditionAsked !== "askWhetherDiffVAT") {
    if (userAccepted(userMessage) || userDenial(userMessage)) {
      let result = decesionHandler(conversationData);
      return result;
    }
  }
  
  if(!conversationData.askedConditions) {
    conversationData.askedConditions = {}
    conversationData.askedConditions[conversationData.previousIntentName] = []
  }
  if(!conversationData.askedConditions[intent]) conversationData.askedConditions[intent] = [];
  const allAnswered = conversationData.askedConditions[intent].filter(item=>item!=="askCompanyName" && item!=="askName" )
  if (!conversationData.leadInserted) allConditions.push("askName");
  else allConditions.push("otherHelp");
  if (!conversationData.userDetails) conversationData.userDetails = {};
  if(!conversationData.userDetails.isServiceRequested) conversationData.userDetails.isServiceRequested = false;
  if (!conversationData.userDetails.requestedServices)
    conversationData.userDetails.requestedServices = {};
    console.log("All conditions", allConditions);
    console.log("All answered", allAnswered);
  try {
    if (conversationData.slotValues) {
      const { slotValues } = conversationData;
      for (let slot in slotValues) {
        if (slotValues[slot].listValue?.values[0]) {
          let value = slotValues[slot].listValue.values[0].stringValue;
          conversationData = storeData(
            conversationData,
            previousIntentName,
            value
          );
        }
      }
    }
    if (conversationData.askedConditions[intent].length == 0) {
      conversationData.isFreeText = true;
      conversationData.intentFromAPI = intent;
      conversationData.previousIntentName = intent;
      let result = integrator.responseCreater(
        integrator.conditionCreater(allConditions[0]),
        conversationData
      );
      conversationData.askedConditions[intent].push(allConditions[0]);
      return result;
    } else if (
      allAnswered.length == allConditions.length
    ) {
      console.log("Equal!!!!!")
      conversationData.askedConditions[intent] = [];
      if (!conversationData.leadInserted) {
        let responseObject = integrator.conditionCreater("askName");
        let result = integrator.responseCreater(
          responseObject,
          conversationData
        );
        return result;
      } else if(conversationData.askedConditions[intent]) {
        console.log(
          "-----------> details Noted for this intent"
        );
        console.log("detailsNoted");
        let responseObject = integrator.conditionCreater("detailsNoted");
        let result = integrator.responseCreater(
          responseObject,
          conversationData
        );
        console.log("CONV DATA", JSON.stringify(conversationData));
        return result;
      }
    } else {
      if (isFreeText(conversationData.conditionAsked, freeTextConditions)) {
        if (!conversationData.userDetails.requestedServices[intent])
          conversationData.userDetails.requestedServices[intent] = {};
        conversationData.userDetails.requestedServices[intent][
          conversationData.conditionAsked
        ] = userMessage;
      }

      let toBeAsked = allConditions.filter((condition) => {
        return !conversationData.askedConditions[intent].includes(condition);
      });
      if (toBeAsked.length > 0) {
        if(toBeAsked.length==1){
          conversationData.userDetails.isServiceRequested = true;
        }
        let index = allConditions.indexOf(toBeAsked[0]);
        if (index > allConditions.length - 1) {
          conversationData.isFreeText = false;
        } else {
          conversationData.isFreeText = true;
          conversationData.intentFromAPI = intent;
          conversationData.previousIntentName = intent;
        }
        let result = integrator.responseCreater(
          integrator.conditionCreater(toBeAsked[0]),
          conversationData
        );
        conversationData.askedConditions[intent].push(toBeAsked[0]);
        if(toBeAsked[0]==="otherHelp"){
          let mailBody = mailComposeForSalesTeam(conversationData.userDetails);
          serviceLeadsLogs(conversationData.userDetails);
          await sendMail(mailData.email, mailData.subject, mailData.body, [], conversationData);
        }
        return result;
      }
    }
  } catch (error) {
    console.log("ERROR", error);
    let result = integrator.responseCreater(
      integrator.conditionCreater("Default response"),
      conversationData
    );
    return result;
  }
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

module.exports = singleServiceHandler;
