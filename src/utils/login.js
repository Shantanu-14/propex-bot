const { apis } = require('./apis');
const axios = require('axios');
const CryptoJS = require("crypto-js");
const { isAuthenticatedUser } = require('./verifier');
const integrator = require("is-integration-provider");
const { verifyPhoneNumber } = require('./verifier');
const { registerNewUser } = require('./signup');

const key = "polyOtp";

const generateOTP = async (mobileNumber, isProduction) => {
    console.log(mobileNumber, "number", "inside generateOTP");
    const url = apis(isProduction).APIs.generateOTP;
    const requestBody = {
        'Mobile': mobileNumber,
        "IsEncBuild": true
    }
    try {
        const res = await axios.post(url, requestBody, { headers: apis(isProduction).coliveHeaders });
        console.log(res.data, "inside generateOTP");
        return res.data;
    }
    catch (err) {
        console.log(err);
        return err;
    }
}

const getCustomerDetailsByOTP = async (mobileNumber, id, isProduction) => {
    const url = apis(isProduction).APIs.getCustomerLoginDetailsByOTP;
    const requestBody = {
        "Mobile": mobileNumber,
        "OTPReferenceId": id,
        "OTPTypeId": 3,
        "IsEncBuild": true
    }
    try {
        const res = await axios.post(url, requestBody, { headers: apis(isProduction).coliveHeaders });
        return res.data;
    }
    catch (err) {
        console.log(err);
        return err;
    }
}

const validateNumber = async (id, isProduction) => {
    const url = apis(isProduction).APIs.otpVerification;
    const requestBody = {
        "Id": id,
        "Mobile_Number_Validated": true
    }
    try {
        const res = await axios.post(url, requestBody, { headers: apis(isProduction).coliveHeaders });
        return res.data;
    }
    catch (err) {
        console.log(err);
        return err;
    }
}

const verifiyOtp = async (conversationData, otp) => {
    const decrypted = CryptoJS.AES.decrypt(conversationData.otp, key)
    const decryptedOtp = decrypted.toString(CryptoJS.enc.Utf8);
    if (decryptedOtp === otp) {
        return true;
    }
    return false;
}

const authenticateUser = async (conversationData, number) => {
    console.log("slotValues", JSON.stringify(conversationData.slotValues));
    if (!conversationData.phoneNumber) {
        let slotValues = conversationData.slotValues;
        if (slotValues.phoneNumber?.listValue?.values?.length > 0) {
            conversationData.phoneNumber = slotValues.phoneNumber.listValue.values[0].stringValue;
        } else {
            if (parseInt(number)) {
                conversationData.phoneNumber = parseInt(number);
            }
        }
        conversationData.userDetails = {};
        conversationData.userDetails.phoneNumber = conversationData.phoneNumber;
    }
    if (!conversationData.askedConditionsForAuth) {
        conversationData.askedConditionsForAuth = [];
    }
    if (!isAuthenticatedUser(false)) {
        console.log(conversationData.userMessage, "userMessage");
        if (conversationData.askedConditionsForAuth.includes("otp")) {
            const verification = await verifiyOtp(conversationData, conversationData.userMessage);
            if (verification) {
                const validate = await validateNumber(conversationData.otpId, true);
                conversationData.otpRefNo = validate.Data.OtpRefNo;
                const user = await getCustomerDetailsByOTP(conversationData.phoneNumberForOtp, conversationData.otpRefNo, true);
                console.log(user, "user -----------------");
                conversationData.customerDetails = user.Data.CustomerDetails[0];
                conversationData.authenticatedUser = true;
                delete (conversationData.otp);
                return {
                    responseObject: null,
                    conversationData: conversationData
                }
            } else {
                responseObject = integrator.conditionCreater("incorrectOtp");
                return {
                    responseObject: responseObject,
                    conversationData: conversationData
                }
            }
        }
        if (!conversationData.askedConditionsForAuth.includes("noAuth")) {
            responseObject = integrator.conditionCreater("noAuth");
            conversationData.askedConditionsForAuth = ["noAuth"]
            return {
                responseObject: responseObject,
                conversationData: conversationData
            }
        } else if (!conversationData.askedConditionsForAuth.includes("otp")) {
            if (verifyPhoneNumber(conversationData.phoneNumber)) {
                const otp = await generateOTP(conversationData.phoneNumber, true);
                if (otp?.Status === "success") {
                    if (otp.Data.IsRegisteredCustomer) { //change this
                        const encrypted = CryptoJS.AES.encrypt(otp.Data.OTP, key).toString();
                        conversationData.otp = encrypted;
                        conversationData.otpId = otp.Data.Id;
                        conversationData.phoneNumberForOtp = conversationData.phoneNumber;
                        conversationData.askedConditionsForAuth.push("otp");
                        responseObject = integrator.conditionCreater("otp");//change this
                        return {
                            responseObject: responseObject,
                            conversationData: conversationData
                        }
                    } else {
                        responseObject = integrator.conditionCreater("noRegister");
                        return {
                            responseObject: responseObject,
                            conversationData: conversationData
                        }
                    }
                } else {
                    responseObject = integrator.conditionCreater("Default response");
                    return {
                        responseObject: responseObject,
                        conversationData: conversationData
                    }
                }
            } else {
                conversationData.slotValues = {}
                delete conversationData.phoneNumber;
                responseObject = integrator.conditionCreater("invalidNumber");
                return {
                    responseObject: responseObject,
                    conversationData: conversationData
                }
            }
        }
    } else {
        conversationData.authenticatedUser = true;
        return {
            responseObject: null,
            conversationData: conversationData
        }
    }
}

module.exports = { generateOTP, getCustomerDetailsByOTP, verifiyOtp, authenticateUser };