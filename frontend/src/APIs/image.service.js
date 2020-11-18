import React, { useState } from 'react';
import firebase from "firebase/app";
import "firebase/storage";

var firebaseConfig = {
    apiKey: "AIzaSyBKVAm0qyLfEL79sLx4KvD3_f6ionoxQog",
    authDomain: "project-fookbace.firebaseapp.com",
    databaseURL: "https://phomo-image.firebaseio.com",
    // projectId: "project-fookbace",
    storageBucket: "project-fookbace.appspot.com",
    // messagingSenderId: "1095497437577",
    // appId: "1:857491992572:web:1d2f8dc141160cd2678c79",
    // measurementId: "G-BLW3JNXN5G"
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

const UploadImageService = (image, setPhoto, setIsLoading, setUploadProgress) => {

    var uploadTask = storage
        .ref()
        .child(
            "images/users/" + JSON.parse(localStorage.getItem('user'))['user_id'] + "_" + image.name
        )
        .put(image);

    uploadTask.on(
        "state_changed",
        (snapshot) => {
            const uploadProgress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setUploadProgress(uploadProgress)
            setIsLoading(true)
        },
        (error) => {
            console.log(error);
            // return null;
        },
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                setPhoto(downloadURL)
                setIsLoading(false)
                // return downloadURL;
            })
        }
    );
}

export default UploadImageService;