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
const axios = require("axios");
const JSONTransport = require("nodemailer/lib/json-transport");
const { nextConditionToAsk } = require('../helpers/slotDetails');
const { apis } = require("../utils/apis");
const uuid = require("uuid");
const { authenticateUser } = require("../utils/login");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const slotsMap = {
  "roomType": "askRoomType",
  "propertyType": "askPropertyType",
  "saleType": "askSaleType",
  "city": "askCity",
  "locality": "askLocality",
  "distance": "askRange",
  "amount": "askBiddingPrice",
  "name": "askName",
  "email": "askEmail",
  "phone": "askPhone",
  "user": "askUser",
  "email": "askEmail",
  "projectStatus": "askProjectStatus",
  "commercialType": "askCommercialType",
  "plot": "askPlot",
  "owernship": "askOwnership",
}

let viewPropertyController = {
  buyer: async (req, res) => {
    let { conversationData } = req.body;
    try {
      if (!conversationData.requiredInformation) {
        conversationData.requiredInformation = [];
      }
      let requiredInformation = conversationData.requiredInformation;
      let responseObject;
      let result;
      let responseCondition = '';
      let slotValues = conversationData.slotValues;
      let userMessage = conversationData.userMessage;

      conversationData.previousIntentName = "agent.specific.propertyViewMore";

      if (slotValues["user"]?.listValue?.values?.length > 0) {
        conversationData.userType = slotValues["user"].listValue.values[0].stringValue
      }
      // console.log(JSON.stringify(conversationData), "Conversation Data");

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

      // console.log("######################################")
      // console.log(JSON.stringify(apis(true).APIs), "slotValues Data");
      // console.log("######################################")
      const isProduction = true;
      responseObject = await propertyViewMoreWithConditionedResponsesV1(conversationData, isProduction)
      // console.log(JSON.stringify(conversationData), "response Object final");
      // responseObject = integrator.conditionCreater("showPropertyViewMoreCard");
      result = integrator.responseCreater(responseObject, conversationData);
      return res.status(result.statusCode).json(result);
    }
    catch (err) {
      const responseObject = integrator.conditionCreater("Default response");
      const result = integrator.responseCreater(responseObject, conversationData);
      return res.status(result.statusCode).json(result);
    }
  }
}

module.exports = viewPropertyController;

async function generatePropertyResponseV1(propertyInfoArray, isProduction) {
  const propertyName = propertyInfoArray[0];
  const propertyId = propertyInfoArray[1];
  const propertyLink = propertyInfoArray[2];
  let locationDescription = await getLocationDescription(
    propertyId,
    isProduction
  );
  let homeFeatures = await getHomeFeatures(propertyId, isProduction);
  return [
    {
      conditions: [
        {
          conditionType: "showPropertyViewMoreCard",
          conditionValue: ["testing"],
        },
      ],
      replaceMentValues: [
        {
          replaceKey: "$propertyName",
          replaceIn: "propertyViewCard",
          position: "propertyName",
          replaceValue: [propertyName],
        },
        {
          replaceKey: "$dynamicUrls",
          replaceIn: "propertyViewCard",
          position: "propertyImageUrls",
          replaceValue: locationDescription.image,
        },
        {
          replaceKey: "$propertyDescription",
          replaceIn: "propertyViewCard",
          position: "propertyDescription",
          replaceValue: locationDescription.propertyDescription,
        },
        {
          replaceKey: "$address",
          replaceIn: "propertyViewCard",
          position: "locationDescription|address",
          replaceValue: locationDescription.address,
        },
        {
          replaceKey: "$dynamicFeature",
          replaceIn: "propertyViewCard",
          position: "houseFeatures|featureTitle",
          replaceValue: homeFeatures.featureTitle,
        },
        {
          replaceKey: "$dynamicPrice",
          replaceIn: "propertyViewCard",
          position: "houseFeatures|price",
          replaceValue: homeFeatures.price,
        },
        {
          replaceKey: "$dynamicRoomType",
          replaceIn: "propertyViewCard",
          position: "houseFeatures|roomType",
          replaceValue: homeFeatures.roomType,
        },
        {
          replaceKey: "$dynamicFeatureInDescription",
          replaceIn: "propertyViewCard",
          position: "houseFeatures|features",
          replaceValue: homeFeatures.roomClass,
        },
        {
          replaceKey: "$dynamicPlainQuickReplyV2",
          replaceIn: "plainQuickReply",
          replaceValue: [
            {
              text: "Enquire",
              value: `I am interested in ${propertyName}.`,
            },
            {
              text: "iConnect",
              value: `iConnect for ${propertyName}.`,
            },
            { text: "Explore More", value: `Explore More` },
          ],
        },
      ],
    },
  ];
}

async function propertyViewMoreWithConditionedResponsesV1(
  conversationData,
  isProduction
) {
  let valuesWithoutParsing = conversationData.slotValues;
  let responseObject = [];
  let propertyName = null;
  if (valuesWithoutParsing.propertyName.listValue.values.length)
    propertyName =
      valuesWithoutParsing.propertyName.listValue.values[0].stringValue;

  //let propertyName = "Colive 179 Signature Towers|30555|Colive_179"
  if (propertyName) {
    const propertyNameSplit = propertyName.split("|");
    conversationData.propertyName = propertyNameSplit[0];
    responseObject = await generatePropertyResponseV1(
      propertyNameSplit,
      isProduction
    );
  } else {
    const propertyNameConstructer = await getPropertyNameByQuery(
      conversationData,
      isProduction
    );
    if (propertyNameConstructer) {
      const propertyNameSplit = propertyNameConstructer.split("|");
      conversationData.propertyName = propertyNameSplit[0];
      responseObject = await generatePropertyResponseV1(
        propertyNameSplit,
        isProduction
      );
    } else
      responseObject = [
        {
          conditions: [
            {
              conditionType: "noPropertyView",
              conditionValue: [conversationData],
            },
          ],
          replaceMentValues: [],
        },
      ];
  }
  return responseObject;
}

const getHomeFeatures = async (propertyId, isProduction) => {
  try {
    let apiUrl = apis(isProduction).APIs.getRoomWiseDetailFromPropertyId;
    console.log(Number(propertyId), "propertyId")
    let requestBody = { PropertyID: Number(propertyId) };
    let response = await axios.post(apiUrl, requestBody, { headers: apis(isProduction).coliveHeaders });
    const arr = [];
    let featureTitle = [];
    let price = [];
    let roomType = [];
    let roomClass = [];
    for (const resp of response.data.Data) {
      featureTitle.push(resp.RoomSubType);
      price.push(`${resp.PricePerMonth}  INR`);
      roomType.push(resp.RoomType);
      roomClass.push(resp.RoomClass);
    }
    console.log(featureTitle, price, roomType, roomClass, "featureTitle");
    return { featureTitle, price, roomType, roomClass };
  } catch (err) {
    console.log("*********************************************");
    console.log(err, "error in getHomeFeatures");
    console.log("*********************************************");
  }
}

const getLocationDescription = async (propertyId, isProduction) => {
  try {
    const apiUrl = apis(isProduction).APIs.propertyDetailsByLocationId;
    const requestBody = { LocationIds: propertyId };
    let response = await axios.post(apiUrl, requestBody, { headers: apis(isProduction).smartSearchHeaders });
    console.log(response.data, "response.data");
    const image = [];
    let address = [];
    let propertyDescription = [];
    if (response.data.Data.length) {
      image.push(response.data.Data[0].metaData[0].tileImageUrl);
      response.data.Data[0].attributes.valueBased.forEach((element) => {
        if (element.tag === "Address") {
          address.push(element.attributeValue)
        }
        if (element.tag === "LocationHighlights") {
          propertyDescription.push(removeHtmlTags(element.attributeValue))
        }
      })
    }
    else {
      propertyDescription.push("Not Available")
      address.push("Not Available")
      image.push("https://coliveshona.blob.core.windows.net/coliveshonabot/no-image.jpg")
    }
    console.log(image, address, propertyDescription, "image");
    return { propertyDescription, address, image };
  } catch (err) {
    console.log("*********************************************");
    console.log(err, "error in getLocationDescription");
    console.log("*********************************************");
  }
}
// const getLocationDescription = async (propertyLink, isProduction) => {
//   try {
//     const apiUrl = apis(isProduction).APIs.getPropertyByLocationLink;
//     const requestBody = { LocationLink: propertyLink };
//     console.log("header", apis(isProduction).coliveHeaders);
//     let response = await axios.post(apiUrl, requestBody, { headers: apis(isProduction).coliveHeaders });
//     const image = [];
//     let address = [];
//     let propertyDescription = [];
//     if (response.data?.Data?.Property?.length) {
//       for (const images of response.data.Data.Property[0].Images) {
//         image.push(images.TileImage);
//       }
//       for (const resp of response.data.Data.Property) {
//         if (resp.LocationDescription === null)
//           resp.LocationDescription = "Not Available";
//         propertyDescription.push(removeTags(resp.LocationDescription));
//         address.push(removeTags(resp.Landmark));
//       }
//     } else {
//       propertyDescription.push("Not Available")
//       address.push("Not Available")
//       image.push("https://coliveshona.blob.core.windows.net/coliveshonabot/no-image.jpg")
//     }
//     console.log(image, address, propertyDescription ,"image");
//     return { propertyDescription, address, image };
//   } catch (err) {
//     console.log("*********************************************");
//     console.log(err, "error in getLocationDescription");
//     console.log("*********************************************");
//   }
// }

const removeTags = (str) => {
  if (str === null || str === "") return false;
  else str = str.toString();
  return str.replace(/(<([^>]+)>)/gi, "");
};


function removeHtmlTags(str) {
  const dom = new JSDOM(str);
  return dom.window.document.body.textContent || dom.window.document.body.innerText || '';
}

const getPropertyNameByQuery = async (conversationData, isProduction) => {
  const result = await axios.post(
    "https://lenssmartsearch.polynomial.ai/prod/shona/listProperty",
    {
      slots: {
        locationObject: null,
        propertiesName: [conversationData.userMessage],
        entities: [],
        costFilterEntity: null,
      },
      mode: "direct",
      queryID: uuid(),
    }
  );
  if (result?.matchedProperties?.length)
    return `${result?.matchedProperties?.[0]?.metaData?.propertyName}|${result?.matchedProperties?.[0]?.propertyID}|${result?.matchedProperties?.[0]?.metaData?.propertyLink}`;
  else return null;
};