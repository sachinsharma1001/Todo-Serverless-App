import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { CreateTodoRequest } from '../../requests/CreateTodoRequest';
import * as AWS from 'aws-sdk';
import * as uuid from 'uuid';

const docClient = new AWS.DynamoDB.DocumentClient();
const todoTable = process.env.TODO_TABLE;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("Create Todo item for a user");

  const userId = 1;
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const itemId = uuid.v4();
  const createdAt = new Date().toISOString();

  const newItem = {
    userId,
    createdAt,
    itemId,
    ...newTodo
  }

  await docClient.put({
    TableName: todoTable,
    Item: newItem
  }).promise();
  
  return {
    statusCode: 201,
    headers: {
    'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
        newItem: newItem
    })
}
}
