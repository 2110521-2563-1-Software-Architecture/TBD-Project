let { projectId, keyFilename, bucketName } = require("../dev-env/gcs.json");

const stream = require("stream");
const { Storage } = require("@google-cloud/storage");

const storage = new Storage({
  projectId,
  keyFilename,
});
const bucket = storage.bucket(bucketName);

const googleCloudStorage = {};

googleCloudStorage.getSignedUrl = async (gcsName, minute) => {
  try {
    const file = bucket.file(gcsName);
    file.makePrivate();
    const urls = [];
    let expires = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    if (minute) {
      expires = new Date(new Date().getTime() + 24 * minute * 60 * 1000);
    }
    const config = {
      action: "read",
      expires,
    };

    const urlTmp = await file.getSignedUrl(config);
    return urlTmp;
  } catch (err) {
    console.error("ERROR:", err);
    throw err;
  }
};

googleCloudStorage.sendUploadFileToGCS = async (file, gcsName) => {
  if (!file) {
    console.log("file not found");
  }
  file.originalname = gcsName;

  const bucketFile = bucket.file(gcsName);
  const { buffer } = file;

  const bufferStream = new stream.PassThrough();

  bufferStream.end(buffer);

  bufferStream.pipe(
    bucketFile
      .createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
        resumable: false,
      })
      .on("error", (err) => {
        file.cloudStorageError = err;
        console.log(`stream error: ${err}`);
        throw err;
      })
      .on("finish", async () => {
        file.cloudStorageObject = gcsName;
        // console.log("uploaded ", gcsName);
      })
  );
};

googleCloudStorage.deleteFile = (gcsName) => {
  bucket
    .file(gcsName)
    .delete()
    .then(() => {
      console.log(`deleted ${gcsName}`);
    })
    .catch((err) => {
      console.error("DELETE ERROR:", err.code);
    });
};

googleCloudStorage.copyFile = (gcsNameSource, gcsNameDes) => {
  bucket
    .file(gcsNameSource)
    .copy(gcsNameDes)
    .then(() => {
      console.log(`copy ${`${gcsNameSource} to ${gcsNameDes}`}`);
    })
    .catch((err) => {
      console.error("COPY ERROR:", err.code);
    });
};

export default googleCloudStorage;
