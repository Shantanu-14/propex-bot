const integrator = require("is-integration-provider");

const userDenial = (userMsg) => {
  const noSynonyms = ["No", "no", "nahi", "naah", "NO", "not", "Not", "NOT"];
  const words = userMsg.split(" ");
  let isNo = false;
  words.forEach((word) => {
    if (noSynonyms.includes(word)) {
      isNo = true;
    }
  });
  return isNo;
};
const userAccepted = (userMsg) => {
  const noSynonyms = [
    "yes",
    "Yes",
    "Yeah",
    "Sure",
    "Yep",
    "yeah",
    "sure",
    "yep",
    "YEP",
    "YES",
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

const decesionHandler = (conversationData) => {
  const { userMessage } = conversationData;
  const { previousIntentName } = conversationData;
  if (userDenial(userMessage)) {
    let result = {}
    let responseObject = {}
    conversationData.intentFromAPI = previousIntentName;
    if(!conversationData.denialCount) conversationData.denialCount= {}
    if(!conversationData.denialCount[previousIntentName]) conversationData.denialCount[previousIntentName]=0;
    console.log("DENIAL COUNT", conversationData.denialCount[previousIntentName]);
    if(conversationData.denialCount<2){
    conversationData.denialCount[previousIntentName] += 1;
    responseObject = integrator.conditionCreater("multipleDenials");
    result = integrator.responseCreater(responseObject, conversationData);
    return result;
    }else{
    conversationData.denialCount[previousIntentName] =0;
    responseObject = integrator.conditionCreater("userDenied");
    result = integrator.responseCreater(responseObject, conversationData);
    return result;
    }
  } else if (userAccepted(userMessage)) {
    conversationData.intentFromAPI = previousIntentName;
    let responseObject = integrator.conditionCreater("userAccepted");
    let result = integrator.responseCreater(responseObject, conversationData);
    return result;
  }
};

module.exports = { decesionHandler, userDenial, userAccepted };
