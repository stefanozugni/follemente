import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/components/app/app.component';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

const firebaseConfig = {
  apiKey: "AIzaSyDomWtfgaLPuC5RTqhvZ3RS0jTEsejKwto",
  authDomain: "follemente-quiz.firebaseapp.com",
  projectId: "follemente-quiz",
  storageBucket: "follemente-quiz.firebasestorage.app",
  messagingSenderId: "1001795213537",
  appId: "1:1001795213537:web:fabfb775223fb12bf7ffa0",
  measurementId: "G-9J3NP93CFK"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);