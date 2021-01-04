import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { uploadGeneratedUrl, attachmentUrl, updateGeneratedUrl } from '../../businessLogic/Todos';
import { getUserId } from '../utils';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const userId = getUserId(event);
  const todoId = event.pathParameters.todoId;

  const uploadUrl = await uploadGeneratedUrl(todoId);
  const url = await attachmentUrl(todoId);

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
