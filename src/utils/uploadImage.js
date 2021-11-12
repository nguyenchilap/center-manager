const multer  = require('multer');
const fs = require('fs-extra');

module.exports = {
    uploadAvatar:
        multer({
        storage: multer.diskStorage({
            destination: (req, file, callback) => {
                const path = `src/public/img/users/${req.user._id}`;
                fs.ensureDirSync(path);
                callback(null, path);
            },
            filename: (req, file, cb) => {
                cb(null , `${file.originalname}`);
            }
        })
        }),
}