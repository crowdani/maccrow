var express = require('express');
var router = express.Router();
var multer = require('multer')
//var request = require('request');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' +file.originalname )
    }
})

var upload = multer({ storage: storage }).single('file');

router.post('/', function(req, res, next) {
  upload(req, res, function (err) {
           if (err instanceof multer.MulterError) {
               return res.status(500).json(err)
           } else if (err) {
               return res.status(500).json(err)
           }

           //console.log(req.file)

      return res.status(200).send(req.file)

    });
});

function myData(file) {
  const formData = {
  // See the `form-data` README for more information about options: https://github.com/form-data/form-data
    file: {
      value:  fs.createReadStream(file.path),
      options: {
        filename: file.filename,
        contentType: file.mimetype
      }
    }
  };

  request.post({url:'http://service.com/upload', formData: formData}, function optionalCallback(err, httpResponse, body) {
  if (err) {
    return console.error('upload failed:', err);
  }
    console.log('Upload successful!  Server responded with:', body);
  });
}

module.exports = router;
