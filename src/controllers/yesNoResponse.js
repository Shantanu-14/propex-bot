const integrator = require("is-integration-provider");

const checkPrevIntent = (prevIntent) => {
  if (
    prevIntent === "agent.careers" ||
    prevIntent === "agent.contactUs" ||
    prevIntent === "agent.consultingServices" ||
    prevIntent === "agent.implementingDynamics" ||
    prevIntent === "agent.upgradingDynamics" ||
    prevIntent === "agent.freeAudit" ||
    prevIntent === "agent.offshoreOnshore" ||
    prevIntent === "agent.products.automation" || 
    prevIntent === "agent.specific.buyer" 
  )
    return true;
  else return false;
};

const denialController = {
  yesNoResponse: async (req, res) => {
    let { conversationData } = req.body;
    console.log(conversationData);
    try {
      if (!conversationData.userDetails) conversationData.userDetails = {};
      if (!conversationData.denialCount) conversationData.denialCount = 0;
      if(!conversationData.askedConditions) {
        conversationData.askedConditions = {}
        conversationData.askedConditions[conversationData.previousIntentName] = []
      }
      if(conversationData.askedConditions[conversationData.previousIntentName].length >=1 ){
        conversationData.askedConditions[conversationData.previousIntentName].pop();
      }
      if (conversationData.intentNameByCordinator === "agent.smalltalk.no")
        conversationData.denialCount += 1;
      console.log(`denial count: ${conversationData.denialCount}`);
      console.log("PREV-INTENT: ", conversationData.previousIntentName);
      if (
        checkPrevIntent(conversationData.previousIntentName) &&
        conversationData.denialCount < 2
      ) {
        console.log("inside denial");
        let result = integrator.responseCreater(
          integrator.conditionCreater("pleaseProceed"),
          conversationData
        );
        return res.status(result.statusCode).json(result);
      } else if (
        (conversationData.previousIntentName === "agent.contactUs" ||
          conversationData.previousIntentName === "agent.careers" || conversationData.previousIntentName === "agent.specific.buyer") &&
        conversationData.denialCount >= 2
      ) {
        console.log("Handling multiple denials");
        let result = integrator.responseCreater(
          integrator.conditionCreater("multipleDenials"),
          conversationData
        );
        return res.status(result.statusCode).json(result);
      } else {
        console.log("inside denial else");
        conversationData.denialCount = 0;
        let result = integrator.responseCreater(
          integrator.conditionCreater("Default response"),
          conversationData
        );
        return res.status(result.statusCode).json(result);
      }
    } catch (e) {
      console.log("ERROR", e);
      let result = integrator.responseCreater(
        integrator.conditionCreater("Default response"),
        conversationData
      );
      return res.status(result.statusCode).json(result);
    }
  },
};

module.exports = denialController;
