import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import { AsyncCollection } from '../wrapper';
import { AbstractUniverse, InitCollectionProps, InitUniverseProps } from './abstract_universe';

export interface InitFirebaseProps extends InitUniverseProps {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

function firebaseCollectionToArray(collection: Record<string, any>): any {
  return Object.entries(collection).map(([key, value]) => {
    return {
      ...value,
      id: key
    }
  });
}

export class FirebaseUniverse extends AbstractUniverse {
  constructor(initProps: InitFirebaseProps) {
    super();
    firebase.initializeApp(initProps);
    const auth = firebase.auth();
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    this.db = firebase.database();
  }

  db: firebase.database.Database;

  collection<T>(initProps: InitCollectionProps): AsyncCollection<T> {
    return new AsyncCollection(
      (onDataOrError) => {
        let isCanceled = false;

        this.db.ref(initProps.name).get()
          .then(data => {
            !isCanceled && onDataOrError(firebaseCollectionToArray(data.val()));
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
