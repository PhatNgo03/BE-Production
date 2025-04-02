const uploadToCloudinary = require("../../helpers/uploadToCloudinary");

const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');


// Configuration
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_KEY, 
  api_secret: process.env.CLOUD_SECRET 
});

module.exports.uploadImages = async (req, res, next) => {
  if(req.file){
  const link = await uploadToCloudinary(req.file.buffer);
  req.body[req.file.fieldname] = link;
  }
  next();
}


module.exports.upload =  (req, res, next) => {
  if(req.file){
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream(
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
  };

  async function upload(req) {
      let result = await streamUpload(req);
      // console.log(result.url);
      req.body[req.file.fieldname] = result.url;
      next();
  }
  upload(req);
  }else {
    next();
  }
}