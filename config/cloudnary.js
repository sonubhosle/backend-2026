
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
    cloud_name: 'dccfai5ci',
    api_key: '841286866772369',
    api_secret: 'CCFRpzuFXMm35BrVLAZzewyzXKk',
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'products',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
});

const upload = multer({ storage });

const uploadProduct = upload.any();

module.exports =  { cloudinary, uploadProduct, upload };