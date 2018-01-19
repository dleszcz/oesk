import Firebase from 'firebase';
import env from 'env-config';

const firebase = Firebase.initializeApp({
  apiKey: env.apiKey,
  authDomain: env.authDomain,
  databaseURL: env.databaseURL,
  projectId: env.projectId,
  messagingSenderId: env.messagingSenderId,
  debug: false,
});

export default firebase;
