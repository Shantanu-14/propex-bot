function apis(isProduction){
    if(isProduction){
        const coliveBaseUrl = ' https://api.colive.com/tp/live/CRMapi/Chatbot/';
        const mlSuggestionsBaseUrl = 'https://colive-sales-brain.azurewebsites.net/'
        const coliveHeaders = {
            'Content-Type': 'application/json',
            'auth_id': 'EB884785-82B8-4F20-8264-D629D51D99BB'
        }
        const smartSearchHeaders = {
            'Content-Type': 'application/json',
            'auth_id': '4761F04B-3C3C-4B0C-9B70-0DB6D167CFC9'
        }
        const APIs = {
            "train_sequence":mlSuggestionsBaseUrl+'train_suggestion',
            'lead_insert': coliveBaseUrl + 'LandingPageLeadInsert',
            'lead_update': coliveBaseUrl + 'LandingPageLeadUpdate',
            'ticket_create': coliveBaseUrl + 'ServiceRequestInsert',
            'ticket_update': coliveBaseUrl + 'ServiceRequestStatusUpdate_V2',
            'ticket_rating': coliveBaseUrl + 'ServiceRequestRatingUpdate_V2',
            'ticket_history': coliveBaseUrl + 'ServiceRequestSelectAllById',
            'crm_master': coliveBaseUrl + 'GetServiceRequestMasters',
            bookingHistory:coliveBaseUrl + "GetCustomerBookingHistory_V2",
            getPropertyByLocationLink: coliveBaseUrl + 'GetPropertyDetailsById',
            getRoomWiseDetailFromPropertyId: coliveBaseUrl + 'GetPropertyAvailablityDetails',
            searchPropertyDetails: coliveBaseUrl + 'GetPropertySearchDetails',
            getCustomerDetailsByMobile: coliveBaseUrl + 'GetCustomerDetailsByMobile',
            otpVerification: coliveBaseUrl + 'OTPVerification',
            otpVerificationWithSignUp: coliveBaseUrl + 'OTPVerificationWithSignUp',
            generateOTP: coliveBaseUrl + 'OTPGeneration',
            getCustomerLoginDetailsByOTP: coliveBaseUrl + 'GetCustomerLoginDetailsByOTP',
            rescheduleAppointment: coliveBaseUrl + 'ServiceRequestInsert',
            invoiceDetails: coliveBaseUrl + 'InvoiceDetailsV2',
            bankDetails: coliveBaseUrl+'CustomerBankInfoSelectById',
            outstandingSD: coliveBaseUrl+'GetCustomerSDOutstanding',
            faqForCheckout:coliveBaseUrl+'CheckoutFeedback_FetchQuestionAnswers',
            checkInTimesForCheckout : coliveBaseUrl + 'GetCheckInTimes',
            bindCustomerChargesForNotice:coliveBaseUrl+"BindCustomerChargesForNotice",
            customerBookingRequestInsert:coliveBaseUrl+"CustomerBookingRequestInsert",
            checkPMAvailabilityForCheckout : coliveBaseUrl + 'CheckoutDateTimeforPMAvailablity',
            customerBankDetailsInsert:coliveBaseUrl +"CustomerBankDetailsInsert",
            cancelRaisedCheckoutRequest:coliveBaseUrl + "CancelRaisedCheckoutRequest",
            locationAPI : " https://api.colive.com/tp/live/CRMapi/PropertyCRM/GetLocationMenuForWeb",
            propertyDetailsByLocationId : "https://api.colive.com/tp/qa/api/PropexBot/SmartSearchAttributesByLocationID"
        }
        return { APIs,coliveHeaders, smartSearchHeaders}
    }
    else{
        const coliveBaseUrl = 'https://api.colive.com/tp/qa/CRMapi/Chatbot/';
        const mlSuggestionsBaseUrl = 'https://colive-sales-brain.azurewebsites.net/'
        const coliveHeaders = {
            'Content-Type': 'application/json',
            'auth_id': '8E8CA351-110E-4272-8A15-DD26E3B3E8C5'
        }
        const APIs = {
            "train_sequence":mlSuggestionsBaseUrl+'train_suggestion',
            'lead_insert': coliveBaseUrl + 'LandingPageLeadInsert',
            'lead_update': coliveBaseUrl + 'LandingPageLeadUpdate',
            'ticket_create': coliveBaseUrl + 'ServiceRequestInsert',
            'ticket_update': coliveBaseUrl + 'ServiceRequestStatusUpdate_V2',
            'ticket_rating': coliveBaseUrl + 'ServiceRequestRatingUpdate_V2',
            'ticket_history': coliveBaseUrl + 'ServiceRequestSelectAllById',
            'crm_master': coliveBaseUrl + 'GetServiceRequestMasters',
            bookingHistory:coliveBaseUrl + "GetCustomerBookingHistory_V2",
            getPropertyByLocationLink: coliveBaseUrl + 'GetPropertyDetailsById',
            getRoomWiseDetailFromPropertyId: coliveBaseUrl + 'GetPropertyAvailablityDetails',
            searchPropertyDetails: coliveBaseUrl + 'GetPropertySearchDetails',
            getCustomerDetailsByMobile: coliveBaseUrl + 'GetCustomerDetailsByMobile',
            otpVerification: coliveBaseUrl + 'OTPVerification',
            otpVerificationWithSignUp: coliveBaseUrl + 'OTPVerificationWithSignUp',
            generateOTP: coliveBaseUrl + 'OTPGeneration',
            getCustomerLoginDetailsByOTP: coliveBaseUrl + 'GetCustomerLoginDetailsByOTP',
            rescheduleAppointment: coliveBaseUrl + 'ServiceRequestInsert',
            invoiceDetails: coliveBaseUrl + 'InvoiceDetailsV2',
            bankDetails: coliveBaseUrl+'CustomerBankInfoSelectById',
            outstandingSD: coliveBaseUrl+'GetCustomerSDOutstanding',
            faqForCheckout:coliveBaseUrl+'CheckoutFeedback_FetchQuestionAnswers',
            checkInTimesForCheckout : coliveBaseUrl + 'GetCheckInTimes',
            bindCustomerChargesForNotice:coliveBaseUrl+"BindCustomerChargesForNotice",
            customerBookingRequestInsert:coliveBaseUrl+"CustomerBookingRequestInsert",
            checkPMAvailabilityForCheckout : coliveBaseUrl + 'CheckoutDateTimeforPMAvailablity',
            customerBankDetailsInsert:coliveBaseUrl +"CustomerBankDetailsInsert",
            cancelRaisedCheckoutRequest:coliveBaseUrl + "CancelRaisedCheckoutRequest",
            locationAPI : "https://api.colive.com/tp/live/CRMapi/PropertyCRM/GetLocationMenuForWeb"
        }
        return { APIs,coliveHeaders}
    }
}

module.exports = {apis};