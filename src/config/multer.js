const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');

const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, '..', '..', 'tmp'));
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);

        file.path = `${hash.toString('hex')}-${file.originalname}`;

        cb(null, file.key);
      });
    }
  }),
  s3: multerS3({
    s3: new aws.S3(),
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);

        const fileName = `${hash.toString('hex')}-${file.originalname}`;

        cb(null, fileName);
      });
    }
  })
};

module.exports = {
  dest: path.resolve(__dirname, '..', '..', 'tmp'),
  storage: storageTypes[process.env.STORAGE_TYPE]
};
