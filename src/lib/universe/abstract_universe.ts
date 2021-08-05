import type { AsyncCollection } from "../wrapper";

let _idCounter = 1;

function generateId() {
  return _idCounter++;
}

type Id = number;

export class Entity {
  id: Id;
  constructor(id?: Id) {
    this.id = id ?? generateId();
  }
}

export class Collection<T> {
  items: T[];
}

export interface InitCollectionProps {
  name: string;
}

export interface InitUniverseProps {

}

export abstract class AbstractUniverse {
  abstract collection<T>(initProps: InitCollectionProps): AsyncCollection<T>;
}

// export class GenericUniverse extends AbstractUniverse {
//   constructor(definition: UniverseDefinition) {
//     super();
//   }

//   collection<T>(props: InitCollectionProps): Collection<T> {
//     throw new Error('GenericUniverse can not have a collection');
//   }
// }
