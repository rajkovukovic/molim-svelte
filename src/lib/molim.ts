import { defaultProxyHandler } from './sample-data';
import type { Molimfied } from './wrapper';


export class Molim {
  static init<T extends object>(multiverse: T): Molimfied<T> {
    return new Proxy(multiverse as any, defaultProxyHandler as any);
  }
}

