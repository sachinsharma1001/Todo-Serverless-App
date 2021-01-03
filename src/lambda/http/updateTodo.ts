import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest';
import * as AWS from 'aws-sdk';

const docClient = new AWS.DynamoDB.DocumentClient();
const todoTable = process.env.TODO_TABLE;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("Update a TODO item with the provided id using values in the updatedTodo object")
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  await docClient.update({
    TableName: todoTable,
    Key: {
      todoId
    },
    UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
    ExpressionAttributeNames: {
      "#name": "name"
    },
    ExpressionAttributeValues: {
      ":name": updatedTodo.name,
      ":dueDate": updatedTodo.dueDate,
      ":done": updatedTodo.done
    }
  }).promise()   

  return {
    statusCode: 201,
    headers: {
    'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      updatedTodo: updatedTodo
    })
  }
}
