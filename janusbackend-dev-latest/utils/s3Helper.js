import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
const getS3 = () => {
  //   const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_KEY } = process.env;
  const myConfig = new AWS.Config({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    signatureVersion: "v4",
  });

  return new AWS.S3(myConfig);
};

// exports.getS3 = getS3;
export const multerUploadS3 = multer({
  storage: multerS3({
    s3: getS3(),
    bucket: "janus-uploads",
    acl: "public-read",
    metadata: function (req, file, cb) {
      // console.log(file, "file");
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      // console.log("running");
      cb(
        null,
        Date.now().toString() + "-" + file.originalname.split(" ").join("-")
      );
    },
    contentType: function (req, file, cb) {
      cb(null, "inline");
    },
  }),
});

// delete files by key from s3
export const deleteFileFromS3 = (key) => {
  const s3 = getS3();
  s3.deleteObject(
    {
      Bucket: "janus-uploads", // Your S3 bucket name
      Key: key,
    },
    (err, data) => {
      if (err) {
        console.error("Error deleting image from S3:", err);
        // res.status(500).json({ error: "Unable to delete image from S3" });
      } else {
        console.log("Image deleted from S3:", key, data);
        // res.json({ message: "Image deleted from S3" });
      }
    }
  );
};
