const integrator = require("is-integration-provider");
const {
  verifyValidEmail,
  checkValidPhoneNumber,
  validateBusinessEmail,
  isAuthenticatedUser
} = require("../utils/verifier");
const { apis } = require('../utils/apis');
const { slotFiller } = require("../utils/slotFiller");
const { leadGenaratedLogs, serviceLeadsLogs } = require("../utils/logger");
const { slotData } = require("../utils/supporter");
const { mailComposeForSalesTeam, mailComposerForCandidateManagement, mailComposerForLeadManagement } = require("../utils/mailComposer");
const { sendMail } = require("../utils/mailer");
const axios = require("axios");
const JSONTransport = require("nodemailer/lib/json-transport");
const { nextConditionToAsk } = require('../helpers/slotDetails');
const { generateOTP, getCustomerDetailsByMobil, authenticateUser, verifiyOtp } = require('../utils/login');
const CryptoJS = require("crypto-js");

const key = "polyOtp";

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

const queryParserLink = "https://lenssmartsearch.polynomial.ai/prod/shona/queryParser"
const propertyListLink = "https://lenssmartsearch.polynomial.ai/prod/shona/listProperty"

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


let buyerController = {
  buyer: async (req, res) => {
    let { conversationData } = req.body;
    const initialConditions = ["askBiddingPrice", "askCity", "askRange", "askLocality", "PreResults"];
    // const initialConditions = ["askRange", "askBiddingPrice", "askCity", "askLocality", "PreResults"];.
    const freeTextConditions = ["askBiddingPrice", "askRange", "askBiddingPriceAgain", "askRangeAgain"];
    const numberConditions = ["askBiddingPrice", "askRange", "askBiddingPriceAgain", "askRangeAgain"];
    let filterMoreConditions = ["askSaleType", "askPropertyType", "askRoomType"];
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




    if (getAreaFromString(userMessage)) {
      requiredInformation.push({
        condition: "askPlot",
        answer: getAreaFromString(userMessage)
      })
    }


    conversationData.previousIntentName = "agent.specific.buyer";

    if (slotValues["user"]?.listValue?.values?.length > 0) {
      conversationData.userType = slotValues["user"].listValue.values[0].stringValue
    }
    // console.log(JSON.stringify(conversationData), "Conversation Data");
    console.log(conversationData, "Conversation Data");


    // CHECK USER AUTHENTICATION
    // let authenticatedUser = conversationData.authenticatedUser;
    // if (!conversationData.authenticatedUser) {
    //   conversationData.authenticatedUser = false; //change this
    // }
    // if (!authenticatedUser) {
    //   const data = await authenticateUser(conversationData);
    //   responseObject = data.responseObject;
    //   conversationData = data.conversationData;
    //   // console.log(conversationData, "response conversationData");
    //   if (responseObject !== null) {
    //     const result = integrator.responseCreater(responseObject, conversationData);
    //     return res.status(result.statusCode).json(result);
    //   }
    // }

    // CHECK USER DENIAL
    if (userDenial(userMessage)) {
      if (freeTextConditions.includes(conversationData.conditionAsked)) {
        conversationData.isFreeText = true;
      }
      let responseObject = integrator.conditionCreater("userDenied");
      let result = integrator.responseCreater(responseObject, conversationData);
      return res.status(result.statusCode).json(result);
    }

    //Get all properties
    const slots = await queryParser(userMessage, requiredInformation);
    const properties = await propertyList(slots);

    //list of properties to show
    const matchedList = properties.matchedProperties ? properties.matchedProperties.map((property) => property.metaData) : [];

    //checkin if user wants to filter more
    let filterFurther = conversationData.filterFurther;
    if (slotValues.MoreFilter) {
      filterFurther = conversationData.slotValues.MoreFilter.listValue.values.length > 0 ? true : false;
    }
    conversationData.filterFurther = true;


    //handling free text conditions
    if (freeTextConditions.includes(conversationData.conditionAsked)) {
      let condition = removeAgain(conversationData.conditionAsked);
      if (!isConditionAnswered(condition, requiredInformation)) {
        if (condition === "askBiddingPrice") {
          if (userMessage === "0" || userMessage === "0.0" || userMessage === "0.00" || userMessage === "zero" || userMessage === "Zero") {
            let responseObject = integrator.conditionCreater("askBiddingPriceAgain");
            let result = integrator.responseCreater(responseObject, conversationData);
            return res.status(result.statusCode).json(result);
          } else {
            let answer = userMessage;
            conversationData.requiredInformation.push({ condition, answer });
          }
        } else if (condition === "askRange") {
          if (!extractKilometers(userMessage)) {
            let responseObject = integrator.conditionCreater("askRangeAgain");
            let result = integrator.responseCreater(responseObject, conversationData);
            return res.status(result.statusCode).json(result);
          }
          else {
            let answer = extractKilometers(userMessage);
            conversationData.requiredInformation.push({ condition, answer });
          }
        }
      }
    }

    //storing slot values in required information
    requiredInformation = conversationData.requiredInformation;
    for (let key in slotValues) {
      let value = '';
      if (slotValues[key].kind === "listValue") {
        if (slotValues[key].listValue.values.length > 0) {
          value = slotValues[key].listValue.values[0].stringValue
        }
      } else {
        value = slotValues[key].stringValue;
      }
      if (slotsMap[key] && value !== '') {
        requiredInformation.push({ condition: slotsMap[key], answer: value });
      }
    }
    conversationData.requiredInformation = requiredInformation;
    // console.log(requiredInformation, "Required Information");

    const locationListMap = new Set();
    locationApiResult.data.Data.forEach((location) => {
      let city = '';
      requiredInformation.forEach((info) => {
        if (info.condition == "askCity") {
          city = info.answer;
        }
      })
      if ((location.MenuLevel == 3 || location.MenuLevel == 2) && presentInUrl(location.URL, city)) {
        locationListMap.add(location.Menu);
      }
    })
    locationListMap.forEach((location) => {
      locationList.push(location);
    })

    // //removing askRoomType from filterMoreConditions if property type is commercial or plot
    // if (requiredInformation.length > 0) {
    //   for (let i = 0; i < requiredInformation.length; i++) {
    //     let condition = requiredInformation[i].condition;
    //     let answer = requiredInformation[i].answer;
    //     if ((condition === "askPropertyType" && answer === "Commercial") || (condition === "askPropertyType" && answer === "Plot")) {
    //       //remove askRoomType from additional conditions
    //       let index = filterMoreConditions.indexOf("askRoomType");
    //       if (index > -1) {
    //         filterMoreConditions.splice(index, 1);
    //       }
    //     }
    //   }
    // }


    for (let i = 0; i < initialConditions.length; i++) {
      let condition = initialConditions[i];
      if (!isConditionAnswered(condition, requiredInformation)) {
        if (condition === "askLocality") {
          conversationData.filterFurther = false;
          responseObject = integrator.singleValueReplacer(condition, "$dynamicPlainQuickReply", locationList, "plainQuickReply")
          result = integrator.responseCreater(responseObject, conversationData);
          return res.status(result.statusCode).json(result);
        } else if (condition === "PreResults") {
          if (matchedList.length === 0) {
            conversationData.filterFurther = false;
            responseCondition = 'noPropertyView';
            responseObject = integrator.conditionCreater(responseCondition);
            result = integrator.responseCreater(responseObject, conversationData);
            return res.status(result.statusCode).json(result);
          } else {
            const newProperties = getPropertyListInPatterns(properties, conversationData)
            responseCondition = 'PreResults';
            responseObject = createResponseForPropertyList(newProperties, responseCondition);
            result = integrator.responseCreater(responseObject, conversationData);
            conversationData.requiredInformation.push({ condition: "PreResults", answer: "PreResults" });
            return res.status(result.statusCode).json(result);
          }

        }
        else {
          conversationData.filterFurther = false;
          responseObject = integrator.conditionCreater(condition);
          result = integrator.responseCreater(responseObject, conversationData);
          return res.status(result.statusCode).json(result);
        }
      }
    }

    if (!filterFurther) {
      if (matchedList.length === 0) {
        conversationData.filterFurther = false;
        responseCondition = 'noPropertyView';
        responseObject = integrator.conditionCreater(responseCondition);
        result = integrator.responseCreater(responseObject, conversationData);
        return res.status(result.statusCode).json(result);
      } else {
        conversationData.filterFurther = false;
        const newProperties = getPropertyListInPatterns(properties, conversationData)
        responseCondition = 'results';
        responseObject = createResponseForPropertyList(newProperties, responseCondition);
        console.log(JSON.stringify(responseObject), "Response Object")
        // responseObject = integrator.conditionCreater(responseCondition);
        result = integrator.responseCreater(responseObject, conversationData);
        return res.status(result.statusCode).json(result);
      }
    }

    console.log(nextConditionToAsk(requiredInformation), "Filter Priority");
    const next = nextConditionToAsk(requiredInformation);
    console.log(next, "Next Condition");
    conversationData.filterFurther = false;
    if (next.condition === "" && next.options.length === 0) {
      responseObject = integrator.conditionCreater("noFilterFurther");
    } else if (next.condition !== "askPlot" && next.options.length === 0) {
      responseObject = integrator.conditionCreater("noFilterFurther");
    } else if (next.condition === "askPlot" && next.options.length === 0) {
      if (isConditionAnswered("askPlot", requiredInformation)) {
        responseObject = integrator.conditionCreater("noFilterFurther");
      } else {
        responseObject = integrator.conditionCreater(next.condition);
      }
    }
    else {
      responseObject = integrator.singleValueReplacer(next.condition, "$dynamicPlainQuickReply", next.options, "plainQuickReply")
    }
    result = integrator.responseCreater(responseObject, conversationData);
    return res.status(result.statusCode).json(result);

    // conversationData.filterFurther = false;
    // conversationData.requiredInformation = [];
    // responseObject = integrator.conditionCreater("noFilterFurther");
    // result = integrator.responseCreater(responseObject, conversationData);
    // return res.status(result.statusCode).json(result);

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

function removeAgain(str) {
  if (str) {
    if (str.includes("Again")) {
      str = str.replace("Again", "");
    }
  }
  return str;
}

const queryParser = async (query, requiredInformation) => {
  let message = query;
  for (let i = 0; i < requiredInformation.length; i++) {
    let condition = requiredInformation[i].condition.slice(3);;
    message = message + " " + condition + " " + requiredInformation[i].answer;
  }
  const res = await axios.post(queryParserLink, { query: message });
  return res.data.slots;
}

const propertyList = async (slots) => {
  const res = await axios.post(propertyListLink, {
    mode: "direct",
    queryID: "basdkdjb23232",
    slots
  });
  return res.data;
}

function extractCurrencyAmounts(input) {
  const regex = /(?:Rs\s?)?(\d{1,3}(?:,\d{3})*)(?:\.\d+0*)?\s?((?:thousand|k|lakh|l|crore|cr))?/gi;
  const matches = input.match(regex);
  if (matches) {
    return matches.map(match => match.trim())[0];
  }
  if (!isNaN(input)) {
    return "INR " + input;
  }
  return null;
}

function extractKilometers(str) {
  const regex = /\b\d+(\.\d+)?\s*(k(m|ilometer)?s?)\b/i;
  const match = str.match(regex);
  if (match) {
    return match[0];
  }
  if (!isNaN(str)) {
    return str + "km";
  }
  return null;
}

const createResponseForPropertyList = (properties, condition) => {
  return [
    {
      conditions: [{
        conditionType: condition,
        conditionValue: [condition],
      }],
      replaceMentValues: [
        {
          replaceKey: "$n",
          replaceIn: "message",
          replaceValue: properties?.carousalData?.total_count,
        },
        {
          replaceKey: "$title",
          replaceIn: "carousal",
          position: "title",
          replaceValue: properties?.carousalData?.title,
        },
        {
          replaceKey: "$subTitle",
          replaceIn: "carousal",
          position: "subtitle",
          replaceValue: properties?.carousalData?.title,
        },
        {
          replaceKey:
            "https://coliveshona.blob.core.windows.net/richcardimageuploads/$dynamicImage.jpg",
          replaceIn: "carousal",
          position: "imageURL",
          replaceValue: properties?.carousalData?.imageUrl,
        },
        {
          replaceKey: "$propertyName",
          replaceIn: "carousal",
          position: "value",
          replaceValue: properties?.carousalData?.title,
        },
        {
          replaceKey: "$dynamicPrice",
          replaceIn: "carousal",
          position: "description|price",
          replaceValue: properties?.carousalData?.price,
        },
        {
          replaceKey: "$dynamicLocation",
          replaceIn: "carousal",
          position: "description|location",
          replaceValue: properties?.carousalData?.location,
        },
      ],
    }
  ]
}

const getPropertyListInPatterns = (properties, conversationData) => {

  const propertyList = new Array();
  for (const property of properties?.matchedProperties) {
    propertyList.push({
      title: property.metaData.propertyName,
      value: `I want to view more on ${property.metaData.propertyName}`,
      image_url: property.metaData.tileImageUrl,
      price: property.metaData.price,
      location: property.metaData.subLocation,
    });
  }
  conversationData.exactMatchProperty = propertyList;
  const carousal = carousalConstructor(
    propertyList,
    [],
    conversationData
  )
  return {
    propertyList,
    carousalData: carousal
  }
}

const carousalConstructor = (
  properties,
  suggestions,
  conversationData
) => {
  let total_count = properties.length;
  let title = new Array();
  let imageUrl = new Array();
  let value = new Array();
  let price = new Array();
  let location = new Array();
  for (const obj of properties) {
    title.push(obj.title);
    imageUrl.push(obj.image_url);
    value.push(obj.value);
    price.push(obj.price);
    location.push(obj.location);
  }

  title = title.slice(0, 5);
  imageUrl = imageUrl.slice(0, 5);
  value = value.slice(0, 5);
  price = price.slice(0, 5);
  location = location.slice(0, 5);

  let dynamicPQR = [];
  if (
    conversationData?.checkoutProperties &&
    conversationData?.checkoutProperties.length
  ) {
    dynamicPQR.unshift("Added Wishlist");
  }

  //if (trending_properties.length)
  dynamicPQR.push("Trending Properties");
  //if (smiliar_properties.length)
  dynamicPQR.push("Similar Properties");
  if (suggestions.length) dynamicPQR = dynamicPQR.concat(suggestions);
  return { total_count, title, imageUrl, value, price, location, dynamicPQR };
};


const presentInUrl = (url, city) => {
  //lowercase the city
  city = city.toLowerCase();
  const urlArray = url.split("/")
  if (urlArray.includes(city)) {
    return true;
  }
  return false;
}

function getAreaFromString(areaString) {
  // Define the regular expression pattern to match the area value and unit
  const areaPattern = /\b(\d+(\.\d+)?)\s*(m|m²|sq m|square meters|hectares|ha|acres|sq mi|square miles|feet|ft|sq ft|sq\.ft|square feet|ft²)\b/i;

  // Extract the numerical value and unit from the input string
  const match = areaString.match(areaPattern);

  if (!match) {
    // If no match is found, return null to indicate failure
    return null;
  }

  // Return the area with the same unit as in the input string
  return match[0];
}

module.exports = buyerController;