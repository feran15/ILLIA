import app from "./config";

import {
  getFirestore,
  addDoc,
  collection
} from "firebase/firestore";

const db =
  getFirestore(app);

export async function addUser(
  user
) {
  await addDoc(
    collection(
      db,
      "users"
    ),
    user
  );
}