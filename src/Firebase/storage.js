import {
  getStorage,
  ref,
  uploadBytes
} from "firebase/storage";

const storage =
  getStorage();

const fileRef =
  ref(
    storage,
    `images/photo.jpg`
  );

await uploadBytes(
  fileRef,
  file
);