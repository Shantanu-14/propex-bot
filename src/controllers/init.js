const integrator = require("is-integration-provider");
const {
  isAuthenticatedUser
} = require("../utils/verifier");
const { apis } = require('../utils/apis');
const axios = require("axios");
const JSONTransport = require("nodemailer/lib/json-transport");
const { nextConditionToAsk } = require('../helpers/slotDetails');
const { generateOTP, getCustomerDetailsByMobil, authenticateUser, verifiyOtp } = require('../utils/login');

const key = "polyOtp";


const userDenial = (userMsg) => {
  const noSynonyms = [
    "No",
    "no",
    "nahi",
    "naah",
    "NO",
    "not",
    "Not",
    "NOT",
  ];
  const words = userMsg.split(" ");
  let isNo = false;
  words.forEach((word) => {
    if (noSynonyms.includes(word)) {
      isNo = true;
    }
  });
  return isNo;
};


let initController = {
  init: async (req, res) => {
    let { conversationData } = req.body;
    const isProduction = true;
    const locationApiResult = await axios.post(apis(isProduction).APIs.locationAPI, {}, { headers: apis(isProduction).coliveHeaders })
    const locationList = []
    if (!conversationData.requiredInformation) {
      conversationData.requiredInformation = [];
    }
    let requiredInformation = conversationData.requiredInformation;
    let responseObject;
    let result;
    let responseCondition = '';
    let slotValues = conversationData.slotValues;
    let userMessage = conversationData.userMessage;

    console.log(JSON.stringify(slotValues), "slotValues")

    // CHECK USER AUTHENTICATION
    let authenticatedUser = conversationData.authenticatedUser;
    if (!conversationData.authenticatedUser) {
      conversationData.authenticatedUser = false; //change this
    }
    if (!authenticatedUser) {
      const data = await authenticateUser(conversationData, userMessage);
      responseObject = data.responseObject;
      conversationData = data.conversationData;
      // console.log(conversationData, "response conversationData");
      if (responseObject !== null) {
        const result = integrator.responseCreater(responseObject, conversationData);
        return res.status(result.statusCode).json(result);
      }
    }
    conversationData.userType = "Buyer";

    // CHECK USER DENIAL
    if (userDenial(userMessage)) {
      if (freeTextConditions.includes(conversationData.conditionAsked)) {
        conversationData.isFreeText = true;
      }
      let responseObject = integrator.conditionCreater("userDenied");
      let result = integrator.responseCreater(responseObject, conversationData);
      return res.status(result.statusCode).json(result);
    }

    if (conversationData.userType === 'Buyer') {
      // const responseObject = integrator.conditionCreater("askBiddingPrice");
      // const replaceMentValueArray = integrator.replaceMentValuesArrayConstructor(["$userName", "$userType"], ["test user", "Buyer"], "message");
      console.log(conversationData, "conversationData")
      const responseObject = integrator.singleValueReplacer("askBiddingPrice", "$userName", conversationData.customerDetails.CustomerName, "message");
      const result = integrator.responseCreater(responseObject, conversationData);
      return res.status(result.statusCode).json(result);
    }

    if(conversationData.userType === 'Seller') {
      const responseObject = integrator.conditionCreater("redirectToIConnect");
      const result = integrator.responseCreater(responseObject, conversationData);
      return res.status(result.statusCode).json(result);
    }
  }
}

const isConditionAnswered = (condition, requiredInformation) => {
  for (let i = 0; i < requiredInformation.length; i++) {
    if (requiredInformation[i].condition === condition) {
      return true;
    }
  }
  return false;
}







module.exports = initController;