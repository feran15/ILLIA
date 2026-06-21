import app from "./config";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

const auth = getAuth(app);

export async function login() {
  const provider =
    new GoogleAuthProvider();

  return signInWithPopup(
    auth,
    provider
  );
}
export default auth;