const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');


// Configuration
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_KEY, 
  api_secret: process.env.CLOUD_SECRET 
});


let streamUploadImages = (buffer) => {
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

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

module.exports = async (buffer) => {
  let result = await streamUploadImages(buffer);
  return result.url;
} 