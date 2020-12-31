import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const docClient = new AWS.DynamoDB.DocumentClient();
const todoTable = process.env.TODO_TABLE;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("Remove a TODO item by id");
  const todoId = event.pathParameters.todoId

  docClient.delete({
    TableName: todoTable,
    Key: {
      id: todoId
    }
  }).promise();

  return undefined
}
