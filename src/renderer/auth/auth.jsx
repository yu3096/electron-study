import { firebaseApp } from "../config/firebase-config";
import { getAuth } from "firebase/auth";

const auth = getAuth(firebaseApp);

export { auth }