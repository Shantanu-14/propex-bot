const { saleType } = require('./filterPriority');

const ConditionAnswered = (condition, requiredInformation) => {
    for (let i = 0; i < requiredInformation.length; i++) {
        if (requiredInformation[i].condition.toLowerCase().substring(3) === condition.toLowerCase()) {
            return requiredInformation[i].answer;
        }
    }
    return false;
}

const getOptionsAndCondition = (name, filterArray, requiredInformation) => {
    console.log(name, filterArray, requiredInformation, "getOptionsAndCondition in next");
    try {
        console.log(ConditionAnswered(name, requiredInformation), "ConditionAnswered(name,requiredInformation)");

        if (!ConditionAnswered(name, requiredInformation)) {
            let conditionToAsk = '';
            let optionsArray = [];
            conditionToAsk = name;
            filterArray.map((item) => {
                optionsArray.push(item.name);
            });
            return {
                condition: formatCondition(conditionToAsk),
                options: optionsArray
            }
        }
        for (let i = 0; i < filterArray.length; i++) {
            if (filterArray[i].name === ConditionAnswered(name, requiredInformation)) {
                if(filterArray[i].furtherFilter){
                    return getOptionsAndCondition(Object.keys(filterArray[i].furtherFilter)[0], filterArray[i].furtherFilter[Object.keys(filterArray[i].furtherFilter)[0]], requiredInformation);
                }else{
                    return {
                        condition: 'ask'+filterArray[i].name,
                        options: []
                    }
                }

            }
        }
    } catch (err) {
        console.log(err, "err");
        return {
            condition: "",
            options: []
        }
    }
}

const nextConditionToAsk = (requiredInformation) => {
    let conditionToAsk = '';
    let optionsArray = [];
    try {
        if (!ConditionAnswered('saleType', requiredInformation)) {
            conditionToAsk = 'saleType';
            saleType.map((item) => {
                optionsArray.push(item.name);
            });
            return {
                condition: formatCondition(conditionToAsk),
                options: optionsArray
            }
        }
        const ans = getOptionsAndCondition("saleType", saleType, requiredInformation);
        console.log(ans, "ans");
        return {
            condition: ans.condition,
            options: ans.options
        }
    } catch (err) {
        return {
            condition: "",
            options: []
        }
    }
}

function formatCondition(str) {
    // Convert the first letter to upper case and concatenate "ask" to the front
    const formattedStr = "ask" + str.charAt(0).toUpperCase() + str.slice(1);
    return formattedStr;
}

module.exports = { nextConditionToAsk };