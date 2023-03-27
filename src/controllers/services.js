const integrator = require("is-integration-provider");
const singleServiceHandler = require("../helpers/singleServiceHandler")


let serviceController = {
  services: async (req, res) => {
    console.log("Inside Service Controller!");
    const { conversationData } = req.body;
    const { userMessage } = conversationData;
    let replaceValue = "Something went wrong";
    let defaultFlag = 1;

    servicesList.forEach((element) => {
      if (element.serviceName.toLowerCase() === userMessage.toLowerCase()) {
        replaceValue = element.serviceData;
        defaultFlag = 0;
      }
    });
    try {
      let responseObject = [];
      console.log("Inside Try");
      if (defaultFlag == 0) {
        responseObject = integrator.singleValueReplacer(
          "giveServiceDetails",
          "$serviceDetails",
          replaceValue,
          "message"
        );
      } else {
        responseObject = integrator.conditionCreater("Default response");
      }
      const result = integrator.responseCreater(
        responseObject,
        conversationData
      );
      res.status(result.statusCode).json(result);
    } catch (err) {
      console.log(err);
      console.log("Inside Catch");
      const responseObject = integrator.conditionCreater("Default response");
      const result = integrator.responseCreater(
        responseObject,
        conversationData
      );
      res.status(result.statusCode).json(result);
    }
  },

  // IMPLEMENTING DYNAMICS CONTROLLER
  implementDynamics: async (req, res) => {
    let { conversationData } = req.body;
    const intent = "agent.implementingDynamics";
    // console.log(JSON.stringify(conversationData));
    const allConditions = [
      "askIndustry",
      "askEmployeeNum",
      "askLocation",
      "askChallenges",
    ];
    const freeTextConditions = ["askIndustry", "askChallenges"];

    const result = singleServiceHandler(conversationData, allConditions, freeTextConditions, intent);
    return res.status(result.statusCode).json(result);
   
  },

  upgradeDynamics: async (req, res) => {
    let { conversationData } = req.body;
    const intent = "agent.upgradingDynamics";
    console.log("upgrading Dynamics")
    // console.log(JSON.stringify(conversationData));
    const allConditions = [
      "askDynamicsVersion",
      "askModules",
      "askYear",
      "askNoOfUsers",
      "askCustomization"
    ];
    const freeTextConditions = ["askDynamicsVersion","askModules","askCustomization"];

    const result = singleServiceHandler(conversationData, allConditions, freeTextConditions, intent);
    return res.status(result.statusCode).json(result);
  },

  onShoreOffShore: async (req, res) => {

    let { conversationData } = req.body;
    console.log("INSIDE SHORES");
    const intent = "agent.offshoreOnshore";
    // console.log(JSON.stringify(conversationData));
    const allConditions = [
      "askDeployment",
      "askIndustry",
      "askModules",
      "askNoOfUsers",
      "askCustomization",
    ];
    const freeTextConditions = ["askDeployment", "askIndustry", "askModules", "askCustomization", "userDenied", "userAccepted"];

    const result = singleServiceHandler(conversationData, allConditions, freeTextConditions, intent);
    return res.status(result.statusCode).json(result);
  },

  auditDynamics: async (req, res) => {
    let { conversationData } = req.body;

    const intent = "agent.freeAudit";
    // console.log(JSON.stringify(conversationData));
    const allConditions = [
      "askDeployment",
      "askIndustry",
      "askModules",
      "askNoOfUsers",
      "askCustomization",
    ];
    const freeTextConditions = ["askDeployment", "askIndustry", "askModules", "askCustomization", "userDenied", "userAccepted"];

    const result = singleServiceHandler(conversationData, allConditions, freeTextConditions, intent);
    return res.status(result.statusCode).json(result);
  },

  consultingServices: async (req, res) => {
    let { conversationData } = req.body;
    console.log(conversationData);
    conversationData.previousIntentName = "agent.consultingServices";
    let result = integrator.responseCreater(
      integrator.conditionCreater("Default response"),
      conversationData
    );
    return res.status(result.statusCode).json(result);
  },
};

module.exports = serviceController;
