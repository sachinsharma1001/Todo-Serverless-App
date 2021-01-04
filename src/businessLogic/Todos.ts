import 'source-map-support/register';
import * as uuid from 'uuid';
import { TodosAccess } from '../dataLayer/TodosAccess';
import { TodosAws } from '../dataLayer/TodosAws';
import { TodoItem } from '../models/TodoItem';
// import { TodoUpdate } from '../models/TodoUpdate';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';

const todosAccess = new TodosAccess();
const todosAws = new TodosAws();

export async function getTodos(userId: string): Promise<TodoItem[]> {
    return await todosAccess.getTodosItem(userId);
}

export async function createTodo(userId: string, todoItem: CreateTodoRequest): Promise<TodoItem> {
    const todoId = uuid.v4();

    const newItem = {
        userId,
        todoId,
        createdAt: new Date().toISOString(),
        done: false,
        attachmentUrl: null,
        ...todoItem
    }
    console.log("new item: " + newItem);
    await todosAccess.createTodoItem(newItem)
    return newItem
}

export async function updateTodoItem(userId: string, todoId: string, updatedTodo: UpdateTodoRequest) {
    await todosAccess.updateTodoItem(userId, todoId, updatedTodo);
}

export async function deleteTodo(userId: string, todoId: string) {
    await todosAccess.deleteTodoItem(userId, todoId);
}

export async function uploadGeneratedUrl(todoId: string): Promise<string> {
    const url = await todosAws.uploadGeneratedUrl(todoId);
    return url;
}

export async function attachmentUrl(todoId: string): Promise<string> {
    const url = await todosAws.attachmentUrl(todoId);
    return url;
}

export async function updateGeneratedUrl(userId: string, todoId: string, url: string) {
    await todosAccess.updateGeneratedS3Url(userId, todoId, url);
}