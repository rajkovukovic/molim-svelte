import { Molim } from './lib/molim';
import { Preferences } from './lib/sample-data';
import { RestUniverse, FirebaseUniverse } from './lib/universe';

// init Firebase universe
const firebaseUniverse = new FirebaseUniverse(
  {
    apiKey: 'AIzaSyDvJF1hNXn3usVr0MtG5ukwSxf83rqSQEI',
    authDomain: 'web-store-e41cc.firebaseapp.com',
    databaseURL: 'https://web-store-e41cc-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'web-store-e41cc',
    storageBucket: 'web-store-e41cc.appspot.com',
    messagingSenderId: '962566532568',
    appId: '1:962566532568:web:5a7404898be38f207296ad',
    measurementId: 'G-8MFNPJHSPQ'
  }
);

// init todo Rest universe
const restUniverse = new RestUniverse({ apiURL: 'https://jsonplaceholder.typicode.com' });

// molim lepo :D
export const molim = Molim.init({
  products   : firebaseUniverse.collection<String>({ name: 'products' }),
  todos      : restUniverse.collection<String>({ name: 'todos' }),
  users      : restUniverse.collection<String>({ name: 'users' }),
  prefereces : new Preferences(),
});

;(window as any).molim = molim;
