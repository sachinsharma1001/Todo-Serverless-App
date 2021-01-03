import 'source-map-support/register';
import * as uuid from 'uuid';
import { TodosAccess } from '../dataLayer/TodosAccess';
import { TodoItem } from '../models/TodoItem';
// import { TodoUpdate } from '../models/TodoUpdate';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';


const todosAccess = new TodosAccess();

export async function getTodos(userId: string): Promise<TodoItem[]> {
    return await todosAccess.getTodosItem(userId);
}

export async function createTodo(userId: string, todoItem: CreateTodoRequest): Promise<TodoItem> {
    const todoId = uuid.v4();
    const createdAt = new Date().toISOString();

    const newItem = {
        userId,
        createdAt,
        todoId,
        done: false,
        attachmentUrl: null,
        ...todoItem
    }

    await todosAccess.createTodoItem(newItem)
    return newItem
}