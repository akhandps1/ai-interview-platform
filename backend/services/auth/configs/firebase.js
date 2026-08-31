/**
 * FILE: backend/services/auth/configs/firebase.js
 * PURPOSE: Core logic and configuration for firebase.js.
 */
import { initializeApp, cert } from "firebase-admin/app";

import serviceAccount from "../serviceAccountKey.json" with { type: "json" };

export const app = initializeApp({
  credential: cert(serviceAccount),
});