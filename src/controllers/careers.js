const integrator = require("is-integration-provider");
const { slotData } = require("../utils/supporter");

const validateResume = (url) => {
  console.log("URL====>", url);
  let isValid = false;
  if (url.includes(".pdf") || url.includes(".doc") || url.includes(".docx")) {
    isValid = true;
  }
  return isValid;
};

const careersController = {
  careers: async (req, res) => {
    console.log("YO CAREERS CONTROLLER");
    let { conversationData } = req.body;
    console.log("CONV DATA", JSON.stringify(conversationData, null, 2));
    try {
      let responseObject = {};
      let allSlots = ["resume"];
      let slotValues = conversationData.slotValues;
      let invalidData = [];
      conversationData.previousIntentName = "agent.careers";
      if (!Array.isArray(conversationData.slotsAnswered))
        conversationData.slotsAnswered = [];
      let slotsData = { isSlotGiven: false, slotsAnswered: [] };
      let resumeData = {
        isGiven: false,
        verifiedStatus: false,
        data: null,
      };
      if (!conversationData.userDetails) conversationData.userDetails = {};
      console.log("RESUME LINK", conversationData.userDetails);
      if (slotValues["resume"]) {
        let url = slotValues["resume"][0].contentUrl;
        if (validateResume(url)) {
          slotsData.isSlotGiven = true;
          slotsData.slotsAnswered.push("askResume");
          conversationData.isResumeAsked = false;
          resumeData = {
            isGiven: true,
            verifiedStatus: true,
            data: url,
          };
          conversationData.userDetails.resume = resumeData.data;
        }else{
          invalidData.push("invalidResume");
          resumeData = {
            isGiven: true,
            verifiedStatus: false,
            data: url,
          }
        }
      }
      let getSlotAnsweredData = slotData(conversationData.userDetails)
      conversationData.slotsAnswered = getSlotAnsweredData;
      let toAsk = "";
      console.log("SLOTS ANSWERED", conversationData.slotsAnswered);
      if(conversationData.slotsAnswered.length === 0 || !conversationData.slotsAnswered.includes("askResume")){
        console.log("I AM HERE IN ASK RESUME")
        toAsk = "askResume";
      }else{
        console.log("I AM HERE IN ASK NAME")
        toAsk = "askName";
      }
      switch (toAsk) {
        case "askResume":
          conversationData.isResumeAsked = true;
          break;
      }
      responseObject = integrator.conditionCreater(toAsk)
      let result = integrator.responseCreater(responseObject, conversationData);
      console.log("NOTT THEE ENDD")
      return res.status(result.statusCode).json(result);

    } catch (e) {
      console.log("INSIDE DEFAULT RESPONSE", e);
      let result = integrator.responseCreater(
        integrator.conditionCreater("Default response"),
        conversationData
      );
      console.log("ENDDDDDDD")
      res.status(result.statusCode).json(result);
    }
  },
  allSlots: ["resume"],
};

module.exports = careersController;
