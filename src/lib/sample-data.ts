import axios from "axios";
import { Entity } from "./universe/abstract_universe";
import { AsyncCollection, AsyncEntity } from "./wrapper";

export class User extends Entity {
  name: string;

  constructor(name?: string) {
    super();
    this.name = name;
  }
}

export class Todo extends Entity {
  user: User;
  title: string;
  completed: boolean;

  constructor(title?: string, completed = false) {
    super();
    this.title = title;
    this.completed = completed;
  }
}

export class Preferences extends Entity {

}

export class Universe {
  users: User[];
  todos: Todo[];
  preferences: Preferences;
}

const _molimWrappersMap = new Map<string, any>();

export function defaultProxyGet
  <
    T extends object,
    Key extends keyof T,
  >
  (
    target: T,
    propertyKey: Key,
    receiver: any
  )
  : AsyncEntity<T[Key]> {
    // });

  // console.log({
  //   target,
  //   propertyKey,
  //   receiver,

  const propertyValue = target && target[propertyKey as any];

  if (propertyValue instanceof AsyncCollection) {
    return propertyValue;
  }

  // const fetchFn = () => axios.get(`https://jsonplaceholder.typicode.com/${propertyKey}`).then(response => response.data);
  // const result = new AsyncEntity<T[propertyKey]>(fetchFn);

  // _molimWrappersMap.set(propertyKey as any, result);
  // return result;
  return null;
}

export const defaultProxyHandler = {
  get: defaultProxyGet,
};
