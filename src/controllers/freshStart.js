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


let freshStartController = {
    restart: async (req, res) => {
        console.log("************************* FRESH START CONTROLLER *************************");
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
        try {
            if (!conversationData.authenticatedUser) {
                conversationData.authenticatedUser = false; //change this
            }
            let authenticatedUser = conversationData.authenticatedUser;

            conversationData.previousIntentName = "agent.specific.freshStart";

            if (slotValues["user"]?.listValue?.values?.length > 0) {
                conversationData.userType = slotValues["user"].listValue.values[0].stringValue
            }

            if (!authenticatedUser) {
                // if (!isAuthenticatedUser(conversationData.authToken)) { //change this
                if (!isAuthenticatedUser(true)) {
                    responseObject = integrator.conditionCreater("askLogin");
                    result = integrator.responseCreater(responseObject, conversationData);
                    return res.status(result.statusCode).json(result);
                } else {
                    conversationData.authenticatedUser = true;
                }
            }
            conversationData.requiredInformation = [];
            responseObject = integrator.conditionCreater("freshStart");
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

module.exports = freshStartController;