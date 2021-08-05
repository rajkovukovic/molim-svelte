import { AsyncCollection } from "../wrapper";
import { AbstractUniverse, InitCollectionProps, InitUniverseProps } from "./abstract_universe";

export interface InitRestProps extends InitUniverseProps {
  apiURL: string;
}

export class RestUniverse extends AbstractUniverse {
  private apiURL: string;

  constructor(initProps: InitRestProps) {
    super();
    this.apiURL = initProps.apiURL;
  }

  collection<T>(initProps: InitCollectionProps): AsyncCollection<T> {
    return new AsyncCollection(
      (onDataOrError) => {
        let isCanceled = false;

        fetch(`${this.apiURL}/${initProps.name}`)
          .then(response => {
            if (response.ok) {
              return response.json();
            } else {
              throw Error(response.status.toString());
            }
          })
          .then(data => {
            !isCanceled && onDataOrError(data)
          })
          .catch(error => {
            !isCanceled && onDataOrError(null, error)
          });

        return () => {
          console.log('collection.fetchCanceled');
          isCanceled = true;
        };
      }
    )
  }
}
