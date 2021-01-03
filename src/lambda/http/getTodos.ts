import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const docClient = new AWS.DynamoDB.DocumentClient();
const todoTable = process.env.TODO_TABLE;
const todoIndexName = process.env.INDEX_NAME;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  console.log("Get all TODO items for a current user"+ event);
  const userId = "1";

  const items = await docClient.query({
    TableName: todoTable,
    IndexName: todoIndexName,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId 
    }
  }).promise()

  return {
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
        items: items
    })
}
}
