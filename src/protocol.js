//js file for import??
import { defineSyncMapActions } from '@logux/actions';    
export const SUBPROTOCOL = '1.0.0';    
export const [createTask, changeTask, deleteTask, createdTask, changedTask, deletedTask] = defineSyncMapActions('tasks');

