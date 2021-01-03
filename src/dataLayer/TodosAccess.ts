import 'source-map-support/register';
import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import * as AWSXRay from 'aws-xray-sdk';
import { TodoItem } from '../models/TodoItem';
// import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

export class TodosAccess {

    constructor(
        private  docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private  todoTable = process.env.TODO_TABLE,
        private  todoIndex = process.env.INDEX_NAME
    ) {}

    async getTodosItem(userId: string): Promise<TodoItem[]> {
        console.log("Get all TODO items for a current user");
        
        const items = await this.docClient.query({
            TableName: this.todoTable,
            IndexName: this.todoIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
            ':userId': userId 
            }
        }).promise();
        const todos = items.Items
        return todos as TodoItem[];
    }

    async createTodoItem(newItem: TodoItem) {
        console.log("Creating todo item for user");

        await this.docClient.put({
            TableName: this.todoTable,
            Item: newItem
        }).promise();
    }
}