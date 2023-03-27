const integrator = require("is-integration-provider");
const {
  isAuthenticatedUser
} = require("../utils/verifier");
const { apis } = require('../utils/apis');
const axios = require("axios");
const JSONTransport = require("nodemailer/lib/json-transport");
const { nextConditionToAsk } = require('../helpers/slotDetails');
const { generateOTP, getCustomerDetailsByMobil, authenticateUser, verifiyOtp } = require('../utils/login');

const nextConditionProvider = async (flowType) => {
    const isProduction = true;
    let filterMaster = await axios.post(apis(isProduction).APIs.filterMaster, {
        "FlowType": 3
      }, { headers: apis(isProduction).smartSearchHeaders })
      console.log(filterMaster.data.Data, "filterMaster.data")
}

module.exports = { nextConditionProvider };