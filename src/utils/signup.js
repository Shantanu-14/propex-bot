const { apis } = require('./apis');
const axios = require('axios');
const CryptoJS = require("crypto-js");
const { isAuthenticatedUser } = require('./verifier');
const integrator = require("is-integration-provider");
const { verifyPhoneNumber } = require('./verifier');

const registerNewUser = async (conversationData, userMessage, isProduction) => {
    try{
        const responseObject = integrator.conditionCreater("askName");
        return {
            responseObject : responseObject,
            conversationData : conversationData
        }
    }catch(err){
        console.log(err);
    }
}

exports.module = { registerNewUser }