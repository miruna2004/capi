// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyB8XC8vgVKJBLZ_kYUvVj52pooXgybXito",
  authDomain: "django-todo-app-2fa33.firebaseapp.com",
  projectId: "django-todo-app-2fa33",
  storageBucket: "django-todo-app-2fa33.firebasestorage.app",
  messagingSenderId: "213680637337",
  appId: "1:213680637337:web:b1555eea39a970ff33ff08"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;