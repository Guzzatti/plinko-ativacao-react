import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBiMngQxlULWk1h5i2IHV1QahSs1C8zgtQ',
  authDomain: 'plinko-board-gzt-react.firebaseapp.com',
  projectId: 'plinko-board-gzt-react',
  storageBucket: 'plinko-board-gzt-react.firebasestorage.app',
  messagingSenderId: '399415949986',
  appId: '1:399415949986:web:11096481dc3dbfa0d7b5fb',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
