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


let iConnectController = {
    buyer: async (req, res) => {
        console.log("************************* ICONNECT CONTROLLER *************************");
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
            responseObject = integrator.singleValueReplacer("informed", "$propertyName", propertyName, "message");
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

module.exports = iConnectController;