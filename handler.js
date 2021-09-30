"use strict";

const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const dynamo = new AWS.DynamoDB.DocumentClient();
 
const table = process.env.VEKTOR_INCOME_TABLE;

module.exports.createIncomeEvent = async (event) => {
  try {
    
    
    console.log(event)
    
    const eventDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

    let eventBody = JSON.parse(event.body);

    const { event, type, investment,recurrent,recurrence,value } = eventBody;

    const incomeEvent = {
      expense_uuid: uuidv4(),
      event,
      event_date: eventDate,
      event_payload : {
        type,
        investment,
        recurrent,
        recurrence
      },
      value
    };
    
    console.log(incomeEvent)

    await dynamo
      .put({
        TableName: table,
        Item: incomeEvent,
      })
      .promise();

    return {
      statusCode: 201,
    };
  } catch (err) {
    console.log("Error", err);
    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      body: JSON.stringify({
        error: err.name ? err.name : "Exception",
        message: err.message ? err.message : "Unknown error",
      }),
    };
  }
};