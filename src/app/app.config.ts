import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideFirebaseApp, initializeApp} from "@angular/fire/app";
import {provideAuth, getAuth} from "@angular/fire/auth";
import {provideFirestore, getFirestore} from "@angular/fire/firestore";
import {provideDatabase, getDatabase} from "@angular/fire/database";
import {environment} from "../environment";
import {provideHttpClient} from "@angular/common/http";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(environment)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideHttpClient()
  ]};
