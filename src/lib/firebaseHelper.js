import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDo3Tandf4ivUfosNv0PIaVZliI93I-Gt0",
  authDomain: "xpostersfm.firebaseapp.com",
  projectId: "xpostersfm",
  storageBucket: "xpostersfm.appspot.com",
  messagingSenderId: "628122841532",
  appId: "1:628122841532:web:a07bdad4c34fdbd2f17bb9",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export async function fetchOldSongs() {
  return new Promise(async (resolve, reject) => {
    const storageRef = ref(storage, "old_songs.json");

    try {
      const fileURL = await getDownloadURL(storageRef);
      const response = await fetch(fileURL);
      const data = await response.json();
      resolve(data);
    } catch (error) {
      console.error("Error old_songs:", error);
      resolve(null);
    }
  });
}
