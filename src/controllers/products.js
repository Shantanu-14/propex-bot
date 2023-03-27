const integrator = require("is-integration-provider");
const products = require("../data/products");
const singleServiceHandler = require("../helpers/singleServiceHandler");
const productsList = products.List;

let productController = {
  products: async (req, res) => {
    console.log('Inside Product Controller!')

    const {conversationData} = req.body;
    const {userMessage} = conversationData;
    let replaceValue = "Something went wrong";
    let defaultFlag = 1;

    productsList.forEach(element => {
      if(element.productName === userMessage){
        replaceValue=element.productData;
        defaultFlag=0;
      }
    });
    try{
      let responseObject=[];
      console.log("Inside Try");
      if(defaultFlag == 0){
        responseObject = integrator.singleValueReplacer('giveProductDetails', "$productDetails", replaceValue, "message");
      }else{
        responseObject = integrator.conditionCreater("Default response");
      }
      const result = integrator.responseCreater(responseObject, conversationData);
      res.status(result.statusCode).json(result);
    } catch (err){
        console.log(err);
        console.log("Inside Catch");
        const responseObject = integrator.conditionCreater("Default response");
        const result = integrator.responseCreater(responseObject, conversationData);
        res.status(result.statusCode).json(result);
    }

  },
  eInvoicingController: async (req, res) => {
    console.log('Inside EInvoicing Controller!')
    let {conversationData} = req.body;
    const intent = "agent.products.automation"
    const allConditions = [
      "askEntitiesNum",
      "askWhetherDiffVAT",
      "askInvoicesAR",
      "askCurrentERP",
    ];
    const freeTextConditions = ["askWhetherDiffVAT",
    "askInvoicesAR",
    "askCurrentERP"];
    const result = singleServiceHandler(conversationData, allConditions, freeTextConditions, intent);
    return res.status(result.statusCode).json(result);
  } 
  
}

module.exports = productController;