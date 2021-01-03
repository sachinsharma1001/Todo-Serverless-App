import 'source-map-support/register';
import * as AWS from 'aws-sdk';
const AWSXRay = require('aws-xray-sdk')
import { TodoItem } from '../models/TodoItem';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
// import { TodoUpdate } from '../models/TodoUpdate';
import { createLogger } from '../utils/logger';

const XAWS = AWSXRay.captureAWS(AWS);
const logger = createLogger("TodoAccess");

export class TodosAccess {

    constructor(
        private readonly docClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todoTable = process.env.TODO_TABLE,
        private readonly todoIndex = process.env.INDEX_NAME,
    ) {}

    async getTodosItem(userId: string): Promise<TodoItem[]> {
        logger.info("Get all TODO items for a current user");
        
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
            Item: newItem,
        }).promise()
    }

    async updateTodoItem(userId: string, todoId: string, updatedTodo: UpdateTodoRequest) {
        const todo = await this.getByTodoId(userId, todoId);

        await this.docClient.update({
            TableName: this.todoTable,
            Key: {
                userId,
                createdAt: todo.createdAt
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
    }

    async deleteTodoItem(userId: string, todoId: string) {
        const todo = await this.getByTodoId(userId, todoId);

        await this.docClient.delete({
            TableName: this.todoTable,
            Key: {
              userId,
              createdAt: todo.createdAt
            }
        }).promise();
    }

    async updateGeneratedS3Url(todoId: string, attachmentUrl: string) {

        await this.docClient.update({
            TableName: this.todoTable,
            Key: {
              todoId
            },
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
              ':attachmentUrl': attachmentUrl
            }
        }).promise()
    }

    async getByTodoId(userId: string, todoId: string): Promise<TodoItem> {
        const item = await this.docClient.query({

                TableName: this.todoTable,
                IndexName: this.todoIndex,
                KeyConditionExpression: "userId = :userId and todoId = :todoId",
                ExpressionAttributeValues: {
                    ":userId": userId,
                    ":todoId": todoId
                }
            }).promise();

        if (item.Items.length === 0) {
            throw new Error("Item does not exist");
        }
        return item.Items[0] as TodoItem;
    }
}