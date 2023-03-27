const integrator = require("is-integration-provider");
const {
  verifyValidEmail,
  checkValidPhoneNumber,
  validateBusinessEmail,
} = require("../utils/verifier");
const { slotFiller } = require("../utils/slotFiller");
const { leadGenaratedLogs, serviceLeadsLogs } = require("../utils/logger");
const { slotData } = require("../utils/supporter");
const { mailComposeForSalesTeam, mailComposerForCandidateManagement, mailComposerForLeadManagement } = require("../utils/mailComposer");
const { sendMail } = require("../utils/mailer");
let contactController = {
  contactUs: async (req, res) => {
    console.log("INSIDE CONTACT CONTROLLER!");
    let { conversationData } = req.body;
    // console.log("CONVERSATION DATA=====>", conversationData);
    let { userMessage } = conversationData;

    // Handling User Denials
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

    // CHECK USER DENIAL
    if (userDenial(userMessage)) {
      let responseObject = integrator.conditionCreater("userDenied");
      let result = integrator.responseCreater(responseObject);
      return res.status(result.statusCode).json(result);
    }

    // CHECK IF ITS AN EMAIL
    if (userMessage.includes("@")) {
      const words = userMessage.split(" ");
      const email = words.filter((word) => {
        if (word.includes("@")) return word; //|| word.includes(".")
      });
      let isBusinessEmail = validateBusinessEmail(email[0]);
      if (!isBusinessEmail) {
        let responseObject = integrator.conditionCreater("invalidEmail");
        let result = integrator.responseCreater(responseObject);
        return res.status(result.statusCode).json(result);
      }
    }

    try {
      let responseObject = [];
      let allSlots = ["askName", "askEmail", "askUserType"];
      // let allSlots = ["askName", "askEmail"];
      let slotValues = conversationData.slotValues;
      let invalidData = [];
      if (!Array.isArray(conversationData.slotsAnswered))
        conversationData.slotsAnswered = [];
      let slotsData = { isSlotGiven: false, slotsAnswered: [] };
      let phoneNumberData = {
        isGiven: false,
        verifiedStatus: false,
        data: null,
      };
      let emailData = {
        isGiven: false,
        verifiedStatus: false,
        isBusinessEmail: false,
        data: null,
      };
      let nameData = { isGiven: false, data: null };
      // let jobSeekerData = { isGiven: false, data: false };
      if (!conversationData.userDetails) conversationData.userDetails = {};
      if (conversationData.userDetails.resume)
        conversationData.userDetails.isCandidate = true;
      if (!conversationData.leadInserted) conversationData.leadInserted = false;
      if (
        conversationData.leadInserted &&
        conversationData.intentNameByCordinator === "agent.contactUs"
      ) {
        conversationData.leadInserted = true;
        console.log("Lead is already Inserted");
        responseObject = integrator.singleValueReplacer(
          "finalMessage",
          "$userName",
          conversationData.userDetails.name,
          "message"
        );
        conversationData.askedConditions = {};
        let result = integrator.responseCreater(
          responseObject,
          conversationData
        );
        return res.status(result.statusCode).json(result);
      }

      if (conversationData.conditionAsked === "askCompanyName") {
        conversationData.userDetails.companyName = userMessage;
      }
      console.log("SLOT VALUES", JSON.stringify(slotValues));
      for (let key in slotValues) {
        switch (key) {
          case "given-name":
            console.log("Inside Given Name");
            if (slotValues[key].listValue.values.length !== 0) {
              slotsData.isSlotGiven = true;
              slotsData.slotsAnswered.push("askName");
              conversationData.isNameAsked = false;
              nameData = {
                isGiven: true,
                data: slotValues[key].listValue.values[0].stringValue,
              };
              conversationData.userDetails.name = nameData.data;
            }
            break;
          case "email":
            console.log("Inside Email");
            if (slotValues[key].listValue.values.length !== 0) {
              let isBusinessMail = validateBusinessEmail(
                slotValues[key].listValue.values[0].stringValue
              );
              //let emailVerifiedData = "";
              // if (isBusinessMail)
              // THIS IS SLOWING DOWN EVERYTHING
              // emailVerifiedData = await verifyValidEmail(
              //   slotValues[key].listValue.values[0].stringValue
              // )
              //   .then((res) => {
              //     console.log("RES",res)
              //     return res;
              //   })
              //   .catch((err) => {
              //     return err;
              //   });
              if (!isBusinessMail) {
                invalidData.push("invalidEmail");
                emailData = {
                  isGiven: true,
                  verifiedStatus: false,
                  isBusinessEmail: false,
                  data: slotValues[key].listValue.values[0].stringValue,
                };
              } else {
                slotsData.isSlotGiven = true;
                slotsData.slotsAnswered.push("askEmail");
                conversationData.isEmailAsked = false;
                emailData = {
                  isGiven: true,
                  verifiedStatus: true,
                  isBusinessEmail: true,
                  data: slotValues[key].listValue.values[0].stringValue,
                };
                conversationData.userDetails.email = emailData.data;
              }
            }
            break;
          case "phone-number":
            console.log("Inside Phone Number");
            if (slotValues[key].listValue.values.length !== 0) {
              let phoneVerifiedData = await checkValidPhoneNumber(
                slotValues[key].listValue.values[0].stringValue
              );
              if (phoneVerifiedData.isValid) {
                slotsData.isSlotGiven = true;
                conversationData.isPhoneNumberAsked = false;
                slotsData.slotsAnswered.push("askPhoneNumber");
                phoneNumberData = {
                  isGiven: true,
                  verifiedStatus: true,
                  data: phoneVerifiedData.data,
                };
                conversationData.userDetails.phoneNumber = phoneNumberData.data;
              } else {
                invalidData.push(phoneVerifiedData.condition);
                phoneNumberData = {
                  isGiven: true,
                  verifiedStatus: false,
                  condition: phoneVerifiedData.condition,
                  data: phoneVerifiedData.data,
                };
              }
            }
            break;
          case "usertype":
            console.log(JSON.stringify(slotValues[key]), "userType");
           if(slotValues[key].stringValue.length > 0){
            conversationData.userDetails.userType = slotValues[key].stringValue;
            conversationData.userType = slotValues[key].stringValue;
           }
            break
        }
      }
      let getSlotAnsweredData = slotData(conversationData.userDetails);

      conversationData.slotsAnswered = getSlotAnsweredData;

      if (conversationData.slotsAnswered.length === 0) {
        let replaceMentArray = [];
        replaceMentArray = integrator.replaceMentValuesArrayConstructor(
          ["$emailConfirm", "$phoneConfirm"],
          [" ", " "],
          ["message", "message"]
        );
        responseObject = integrator.mutipleValueReplacer(
          "askName",
          replaceMentArray
        );
        conversationData.isNameAsked = true;
        // responseObject = integrator.conditionCreater("askName");
        conversationData.previousIntentName = "agent.contactUs";
        conversationData.nameAskedFlag = true;
      } else {
        console.log("SLOTS ANSWERED", conversationData.slotsAnswered);
        let toAsk = slotFiller(conversationData.slotsAnswered, allSlots);
        console.log("TO ASK", toAsk);
        if (invalidData.length == 2) {
          toAsk = "invalidEmailAndPhone";
        }
        if (invalidData.length == 1) {
          toAsk = invalidData[0];
        }
        conversationData.previousIntentName = "agent.contactUs";
        switch (toAsk) {
          case "askEmail":
            conversationData.isEmailAsked = true;
            break;
          case "askPhoneNumber":
            conversationData.isPhoneNumberAsked = true;
            break;
          case "askName":
            conversationData.isNameAsked = true;
            break;
        }

        if (toAsk == "finalMessage") {
          if (!conversationData.askedConditions) {
            conversationData.askedConditions = {}
            conversationData.askedConditions[conversationData.previousIntentName] = []
          }
          console.log("ASKED CONDITIONS", conversationData.askedConditions)
          let intent = Object.keys(conversationData.askedConditions)[0];
          if (conversationData.askedConditions[intent].includes("askCompanyName")) {
            conversationData.askedConditions[intent].push("askCompanyName");
            conversationData.isFreeText = true;
            conversationData.previousIntentName = "agent.contactUs";
            conversationData.intentFromAPI = "agent.contactUs";
            let responseObject = integrator.singleValueReplacer("askCompanyName", "$userName", conversationData.userDetails.name, "message");
            let result = integrator.responseCreater(responseObject, conversationData);
            return res.status(result.statusCode).json(result);
          } else {
            // conversationData.leadInserted = true;
            // let mailData = {}
            // if(conversationData.userDetails.isCandidate){
            //   console.log("Is CANDIDATE");
            //   mailData = mailComposerForCandidateManagement(conversationData.userDetails);
            //   // leadGenaratedLogs(conversationData.userDetails);
            // }
            // else if(conversationData.userDetails.isServiceRequested){
            //   console.log("Is SERVICE REQUESTED");
            //   mailData = mailComposeForSalesTeam(conversationData.userDetails);
            //   // serviceLeadsLogs(conversationData.userDetails);
            // }
            // else {
            //   console.log("Just lead");
            //   mailData = mailComposerForLeadManagement(conversationData.userDetails);
            //   // leadGenaratedLogs(conversationData.userDetails);
            // }
            // // await sendMail(mailData.email, mailData.subject, mailData.body, [], conversationData);
            // console.log("Mail Sent2");
            console.log("Final Message", conversationData.userDetails);
            const replaceMentArray = integrator.replaceMentValuesArrayConstructor(
              ["$userName", "$usertype"], [conversationData.userDetails.name, conversationData.userDetails.userType], ["message", "message"]
            );
            console.log("REPLACEMENT ARRAY", replaceMentArray);
            responseObject = integrator.mutipleValueReplacer(
              toAsk,
              replaceMentArray
            );
          }
        }
        // Prakhar's Suggestion
        else if (toAsk == "askName") {
          let replaceMentArray = [];
          if (
            conversationData.userDetails.phoneNumber &&
            conversationData.userDetails.email
          ) {
            const emailReceivedMsg = `I have noted your email to be ${conversationData.userDetails.email}.`;
            const phoneReceivedMsg = `And phone number as ${conversationData.userDetails.phoneNumber}.`;
            replaceMentArray = integrator.replaceMentValuesArrayConstructor(
              ["$emailConfirm", "$phoneConfirm"],
              [emailReceivedMsg, phoneReceivedMsg],
              ["message", "message"]
            );
          } else if (
            conversationData.userDetails.email &&
            !conversationData.userDetails.phoneNumber
          ) {
            const emailReceivedMsg = `I have noted your email to be ${conversationData.userDetails.email}.`;
            const phoneReceivedMsg = " ";
            replaceMentArray = integrator.replaceMentValuesArrayConstructor(
              ["$emailConfirm", "$phoneConfirm"],
              [emailReceivedMsg, phoneReceivedMsg],
              ["message", "message"]
            );
          } else if (
            conversationData.userDetails.phoneNumber &&
            !conversationData.userDetails.email
          ) {
            const emailReceivedMsg = " ";
            const phoneReceivedMsg = `I got your phone number as ${conversationData.userDetails.phoneNumber}.`;
            replaceMentArray = integrator.replaceMentValuesArrayConstructor(
              ["$emailConfirm", "$phoneConfirm"],
              [emailReceivedMsg, phoneReceivedMsg],
              ["message", "message"]
            );
          } else {
            replaceMentArray = integrator.replaceMentValuesArrayConstructor(
              ["$emailConfirm", "$phoneConfirm"],
              [" ", " "],
              ["message", "message"]
            );
          }
          responseObject = integrator.mutipleValueReplacer(
            toAsk,
            replaceMentArray
          );
        } else if (toAsk == "askEmail") {
          let replaceMentArray = [];
          if (conversationData.userDetails.phoneNumber) {
            const phoneReceivedMsg = `I have noted your phone number as ${conversationData.userDetails.phoneNumber}.`;
            replaceMentArray = integrator.replaceMentValuesArrayConstructor(
              ["$userName", "$phoneConfirm"],
              [conversationData.userDetails.name, phoneReceivedMsg],
              ["message", "message"]
            );
          } else {
            replaceMentArray = integrator.replaceMentValuesArrayConstructor(
              ["$userName", "$phoneConfirm"],
              [conversationData.userDetails.name, " "],
              ["message", "message"]
            );
          }
          responseObject = integrator.mutipleValueReplacer(
            toAsk,
            replaceMentArray
          );
        } else if (toAsk == "askPhoneNumber") {
          let replaceMentArray = [];
          if (conversationData.userDetails.email) {
            const emailReceivedMsg = `I have noted your email to be ${conversationData.userDetails.email}.`;
            replaceMentArray = integrator.replaceMentValuesArrayConstructor(
              ["$userName", "$emailConfirm"],
              [conversationData.userDetails.name, emailReceivedMsg],
              ["message", "message"]
            );
          } else {
            replaceMentArray = integrator.replaceMentValuesArrayConstructor(
              ["$userName", "$emailConfirm"],
              [conversationData.userDetails.name, " "],
              ["message", "message"]
            );
          }
          responseObject = integrator.mutipleValueReplacer(
            toAsk,
            replaceMentArray
          );
        }
         else
        {
          if (!conversationData.userDetails.name)
            responseObject = integrator.singleValueReplacer(
              toAsk,
              "$userName",
              "User",
              "oddMessages"
            );
          else
            responseObject = integrator.singleValueReplacer(
              toAsk,
              "$userName",
              conversationData.userDetails.name,
              "oddMessages"
            );
        }
      }
      // responseObject = integrator.singleValueReplacer("askResume", "$userName", "derek", "oddMessages");
      let result = integrator.responseCreater(responseObject, conversationData);
      return res.status(result.statusCode).json(result);
    } catch (error) {
      console.log("ERROR");
      console.log(error);
      let result = integrator.responseCreater(
        integrator.conditionCreater("Default response"),
        conversationData
      );
      res.status(result.statusCode).json(result);
    }
  },
  allSlots: ["askName", "askEmail", "askPhoneNumber"],
};

module.exports = contactController;
