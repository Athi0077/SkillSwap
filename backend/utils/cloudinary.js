const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "qnyt9vnl",
  api_key: process.env.CLOUDINARY_API_KEY || "473697861747978",
  api_secret: process.env.CLOUDINARY_API_SECRET || "g5eb2942cUQ1EneMPLrBTsVfWPA",
});

module.exports = cloudinary;
