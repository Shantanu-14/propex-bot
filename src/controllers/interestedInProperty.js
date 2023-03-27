const integrator = require("is-integration-provider");
const {
    verifyValidEmail,
    checkValidPhoneNumber,
    validateBusinessEmail,
    isAuthenticatedUser
} = require("../utils/verifier");
const { slotFiller } = require("../utils/slotFiller");
const { leadGenaratedLogs, serviceLeadsLogs } = require("../utils/logger");
const { slotData } = require("../utils/supporter");
const { mailComposeForSalesTeam, mailComposerForCandidateManagement, mailComposerForLeadManagement } = require("../utils/mailComposer");
const { sendMail } = require("../utils/mailer");
const axios = require("axios");
const JSONTransport = require("nodemailer/lib/json-transport");
const { nextConditionToAsk } = require('../helpers/slotDetails');
const {authenticateUser} = require("../utils/login");


let interestedInPropertyController = {
    buyer: async (req, res) => {
        console.log("************************* INTERESTED IN PROPERTY CONTROLLER *************************");
        let { conversationData } = req.body;
        if (!conversationData.requiredInformation) {
            conversationData.requiredInformation = [];
        }
        let requiredInformation = conversationData.requiredInformation;
        let responseObject;
        let result;
        let responseCondition = '';
        let slotValues = conversationData.slotValues;
        let userMessage = conversationData.userMessage;
        let valuesWithoutParsing = conversationData.slotValues;
        let propertyName = valuesWithoutParsing.propertyName.listValue.values[0].stringValue;
        propertyName = propertyName.split("|")[0];
        conversationData.propertyName = propertyName;
        try {


            conversationData.previousIntentName = "agent.specific.iConnect";

            if (slotValues["user"]?.listValue?.values?.length > 0) {
                conversationData.userType = slotValues["user"].listValue.values[0].stringValue
            }

            // CHECK USER AUTHENTICATION
            let authenticatedUser = conversationData.authenticatedUser;
            if (!conversationData.authenticatedUser) {
                conversationData.authenticatedUser = false; //change this
            }
            if (!authenticatedUser) {
                const data = await authenticateUser(conversationData);
                responseObject = data.responseObject;
                conversationData = data.conversationData;
                if (responseObject !== null) {
                    const result = integrator.responseCreater(responseObject, conversationData);
                    return res.status(result.statusCode).json(result);
                }
            }

            propertyName = conversationData.propertyName.split(" ").join("_");
            let paramList = `propertyName=${propertyName}&`;
            conversationData.requiredInformation.forEach((element) => {
                let condition = element.condition.slice(3);
                if (element.answer.includes(" ")) {
                    answer = element.answer.split(" ").join("_");
                } else {
                    answer = element.answer;
                }
                paramList += `${condition}=${answer}&`;
            })
            paramList = paramList.slice(0, -1);
            console.log("paramList", paramList);
            console.log("requred information", requiredInformation);
            responseObject = integrator.singleValueReplacer("informed", "$dynamicMessage", getMessage(requiredInformation, propertyName), "message");
            result = integrator.responseCreater(responseObject, conversationData);
            return res.status(result.statusCode).json(result)

        } catch (error) {
            console.log(error);
            responseObject = integrator.conditionCreater("Default response");
            result = integrator.responseCreater(responseObject, conversationData);
            return res.status(result.statusCode).json(result);
        }

    }
}

module.exports = interestedInPropertyController;

const getMessage = (requiredInformation, propertyName) => {

    let locality = requiredInformation.find((info) => info.condition === "askLocality");
    let city = requiredInformation.find((info) => info.condition === "askCity");
    let price = requiredInformation.find((info) => info.condition === "askBiddingPrice");
    let message = `We have notified the seller in ${city.answer} with your interest in ${locality.answer} between 500000 INR to ${price.answer}. `;
    return message;
}