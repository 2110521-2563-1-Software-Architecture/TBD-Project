import mime from "mime-types"; // get file type
import googleCloudStorage from "./googleCloudStorage";

// upload file
let uploads;
let all_upload = [];

for (let i = 0; i < newFile.media.length; i++) {
    name =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      "." +
      mime.extension(file.media[i].mimetype);
    all_upload[i] = googleCloudStorage.sendUploadFileToGCS(
      newFile.media[i],
      name
    );
    all_name[i] = name;
  }
uploads = await Promise.all(all_upload);
// save all_name to DB


// get file
let files = [];
let arrReq = [];
  for (var i = 0; i < pic.length; i++) {
      arrReq[i] = googleCloudStorage.getSignedUrl(name_from_backend);
  }
files = await Promise.all(arrReq);