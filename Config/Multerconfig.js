const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads'); // Directory where images will be saved
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Set up file filter
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype.startsWith('image/') ||
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'video/mp4'
    ) {
        cb(null, true);
    } else {
        cb(new Error('Only image, PDF, and MP4 files are allowed!'), false);
    }
};

// Configure multer middleware without specifying the fields
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 35 // Limit file size to 20MB
    },
    fileFilter: fileFilter
});

module.exports = upload;
