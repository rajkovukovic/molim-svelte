import axios from 'axios';

let _idCounter = 1;
const _molimWrappersMap = new Map<string, any>();

function generateId() {
  return _idCounter++;
}

type Id = number;

export class DBRecord {
  id: Id;
  constructor(id?: Id) {
    this.id = id ?? generateId();
  }
}

export class User extends DBRecord {
  name: string;

  constructor(name?: string) {
    super();
    this.name = name;
  }
}

export class Todo extends DBRecord {
  user: User;
  title: string;
  completed: boolean;

  constructor(title?: string, completed = false) {
    super();
    this.title = title;
    this.completed = completed;
  }
}

class Preferences {

}

export class DBWorld {
  users: User[];
  todos: Todo[];
  preferences: Preferences;
}

(window as any).DBWorld = DBWorld;

type FetchDataFunction<T> = (...args) => Promise<T>;
const NotInitialized = Symbol("not_initialized");
class MolimDataWrapper<T> {
  constructor (fetchFn: FetchDataFunction<T>) {
    this._fetchFn = fetchFn;
  }

  private _fetchFn: FetchDataFunction<T>;
  private _listeners: any[] = [];
  private _value: typeof NotInitialized | T = NotInitialized;
  private _error: Error;
  private _fetching: boolean = false;
  private _posting: boolean = false;

  get initilized(): boolean {
    return this._value !== NotInitialized;
  }

  get fetching(): boolean {
    return this._fetching;
  }

  get posting(): boolean {
    return this._posting;
  }

  get value(): T {
    return this._value === NotInitialized ? null : this._value;
  }

  set value(newValue: T) {
    this._value = newValue;
    this.notifyListeners();
  }

  protected notifyOneListener(listener: Function) {
    listener(this.value);
  }

  protected notifyListeners() {
    this._listeners.forEach(this.notifyOneListener.bind(this));
  }

  listen(listener: (data: T, error: Error) => void): () => void {
    this._listeners.push(listener);

    if (this._listeners.length === 1) {
      this.notifyListeners();
      this._fetching = true;
      this._fetchFn()
      .then(value => {
        this._value = value;
      })
      .catch(error => {
        this._error = error;
      })
      .finally(() => {
        this._fetching = false;
        this.notifyListeners();
      });
    } else {
      this.notifyOneListener(listener);
    }

    return () => this._listeners.splice(this._listeners.indexOf(listener), 1);
  }
}

interface ConstructorOf<T> {
  new (): T;
}

type Molimfied<T> = {
  [K in keyof T]: T[K] extends Array<any> ? MolimDataWrapper<T[K]> : Promise<T[K]>;
}

type PromisifyProperties<T> = {
  [K in keyof T]: Promise<T[K]>;
}

function defaultProxyGet
  <
    T extends object,
    Key extends keyof T,
  >
  (
    target: T,
    property: Key,
    receiver: any
  )
  : MolimDataWrapper<T[Key]> {

  // console.log({
  //   target,
  //   property,
  //   receiver,
  // });

  if (_molimWrappersMap.has(property as any)) {
    return _molimWrappersMap.get(property as any);
  }

  const fetchFn = () => axios.get(`https://jsonplaceholder.typicode.com/${property}`).then(response => response.data);
  const result = new MolimDataWrapper<T[Key]>(fetchFn);

  _molimWrappersMap.set(property as any, result);
  return result;
}

const handler1 = {
  get: defaultProxyGet,
};

export class Molim {
  static init<T extends object>(TConstructor: ConstructorOf<T>): Molimfied<T> {
    return new Proxy({} as any, handler1 as any);
  }
}

const molim = (window as any).molim = Molim.init(DBWorld);

// molim.todos.listen(console.log.bind(null, 'todos'));
(window as any).subsribeUsers = (label: string = 'users') => {
  return molim.users.listen(console.log.bind(null, label));
}
