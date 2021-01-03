import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { updateGeneratedUrl } from '../../businessLogic/Todos';
import { TodosAws } from '../../dataLayer/TodosAws';
import { getUserId } from '../utils';

const todosAws = new TodosAws();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const userId = getUserId(event);
  const todoId = event.pathParameters.todoId;

  const uploadUrl = await todosAws.uploadGeneratedUrl(todoId);
  const url = await todosAws.attachmentUrl(todoId);

  await updateGeneratedUrl(userId, todoId, url);

  return {
    statusCode: 200,
    headers: {
    'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
        uploadUrl: uploadUrl
    })
}
}
