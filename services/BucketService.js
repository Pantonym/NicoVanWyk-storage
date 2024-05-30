import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

// Upload Image to Buckets
export const handleUploadOfImage = async (uri, fileName) => {
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.onload = function () {
            resolve(xhr.response);
        }

        xhr.onerror = function (e) {
            console.log(e);
            reject(new TypeError("Network request failed"));
        }

        xhr.responseType = "blob";
        // open the network, get the image using this uri, and set async to true
        xhr.open('GET', uri, true);
        // Similar to return in normal functions
        xhr.send(null);
    })

    // only refers to where it should be stored, and what it should eb called
    const imageRef = ref(storage, fileName);

    const uploadResult = await uploadBytes(imageRef, blob);

    console.log(await getDownloadURL(imageRef)); // returns the url of the image on firebase

    var data = {
        image: await getDownloadURL(imageRef),
        title: fileName
    }

    try {
        const docRef = await addDoc(collection(db, "memories"), data);
        console.log("Created memory with ID: ", docRef.id, " data: ", data);
    } catch (error) {
        console.log(error);
        console.log("error data: ", data);
    }

    blob.close();

    // if you name the image the same as another one, it will replace the image.
    // for example, setting a profile equal to the user's uID it will replace the old image with the new one
}

export const getAllMemories = async () => {
    var memories = [];

    const querySnapshot = await getDocs(collection(db, "memories"));
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        memories.push(doc.data())
    });

    return memories
}