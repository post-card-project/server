"use strict";

const { Storage } = require("@google-cloud/storage");

const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT,
  keyFilename: process.env.GCLOUD_KEYFILE
});
const bucket = storage.bucket(process.env.GCLOUD_BUCKET);

const getPublicUrl = filename => {
  return `https://storage.googleapis.com/${process.env.GCLOUD_BUCKET}/${filename}`;
};

const getGsUri = filename => {
  return `gs://${process.env.GCLOUD_BUCKET}/${filename}`;
};

const sendUploadToGCS = (req, res, next) => {
  if (!req.file) {
    return next({ status: 400, message: "Image required" });
  }

  const gcsname = Date.now() + req.file.originalname;
  const file = bucket.file(gcsname);

  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    }
  });

  stream.on("error", err => {
    req.file.cloudStorageError = err;
    next(err);
  });

  stream.on("finish", () => {
    req.file.cloudStorageObject = gcsname;
    file.makePublic().then(() => {
      req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
      req.file.cloudStorageGsUri = getGsUri(gcsname);
      next();
    });
  });

  stream.end(req.file.buffer);
};

const Multer = require("multer");
const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: function(req, file, next) {
    if (file.mimetype !== "image/jpeg") {
      next({
        status: 400,
        message: "File is not an image"
      });
    }
    next(null, true);
  }
});

module.exports = {
  getGsUri,
  getPublicUrl,
  sendUploadToGCS,
  multer
};
