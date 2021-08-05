import type { Collection, Entity } from "./universe/abstract_universe";

type OnDataOrError<T> = (data: T, error?: Error) => any;

export type FetchDataFunction<T> = (params: OnDataOrError<T>) => Function;

export const NotInitialized = Symbol("not_initialized");

export class AsyncEntity<T> {
  constructor (fetchFn: FetchDataFunction<T>) {
    this._fetchFn = fetchFn;
  }

  private _fetchFn: FetchDataFunction<T>;
  private _unsubscriber: Function;
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

      this._unsubscriber = this._fetchFn((data: T, error: Error) => {
        if (!error) {
          this._value = data;
        }
        this._error = error;
        this._fetching = false;
        this.notifyListeners();
      })
    } else {
      this.notifyOneListener(listener);
    }

    console.log('number of listeners', this._listeners.length);

    return () => {
      this._listeners.splice(this._listeners.indexOf(listener), 1);
      console.log('unsubsribed. number of listeners', this._listeners.length);
      if (this._listeners.length === 0) {
        this._unsubscriber();
        this._unsubscriber = null;
      }
    }
  }
}

export class AsyncCollection<T> extends AsyncEntity<T> {
  query(): T[] {
    return [];
  }
}

export interface ConstructorOf<T> {
  new (): T;
}

export type Molimfied<T> = {
  [K in keyof T]: T[K] extends Collection<infer CollectionItem>
    ? AsyncCollection<CollectionItem>
    : T[K] extends Entity
    ? AsyncEntity<T[K]>
    : T[K] extends object
    ? Molimfied<T[K]>
    : T[K];
}

export type PromisifyProperties<T> = {
  [K in keyof T]: Promise<T[K]>;
}
