var express = require('express');
var router = express.Router();
var multer = require('multer')
var fs = require('fs');
var request = require('request').defaults({ rejectUnauthorized: false });





var ODM_ProcessBacaDocument_ServiceURL = "http://localhost:9090/DecisionService/rest/v1/ContentAnalyzer/ProcessDocument/OPENAPI?format=JSON";
var BACA_URL = "https://backend-aca.159.8.181.251.nip.io/ca/rest/content/v1/contentAnalyzer";
var BACA_API_KEY = "OTdmNmY1ZjItMzVjZS00ZWIzLTllOTYtMzA1MTBkZjJjMTYxO3Q0OTEwO09OVDE=";
var BACA_BASIC_AUTH = "Bearer zNwmnZ1jnfSYXyMxqIIVD7lIAhi7zbWwHYGJr71A";

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' +file.originalname )
    }
})

var upload = multer({ storage: storage }).single('file');

router.get('/CheckStatus', function(req, res, next) {
  console.log(req.param('aid'));
  CheckTheCAData(req.param('aid')).then(function(result) {
    CAResults = result;
    console.log("Initialized CA");
    // Use user details from here
    console.log(CAResults)
    return res.status(200).send(CAResults)
    }, function(err) {
      console.log(err);
      return res.status(400).send(err);
    }
  )




});


router.post('/', function(req, res, next) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err)
    } else if (err) {
      return res.status(500).json(err)
    }

    console.log(req.file)
    console.log("Calling mYData")
    CATheData(req.file).then(function(result) {
      CAResults = result;
      console.log("Initialized CA");
      // Use user details from here
      console.log(CAResults)
      return res.status(200).send(CAResults)
      }, function(err) {
        console.log(err);
        return res.status(400).send(err);
      }
    )
  })
});

function CATheData(file) {
  const formData = {
  // See the `form-data` README for more information about options: https://github.com/form-data/form-data
    file: {
      value:  fs.createReadStream(file.path),
      options: {
        filename: file.filename,
        contentType: file.mimetype
      }
    },
    jsonOptions: '"OCR","DC","KVP","SN","MT","HR","TH","DS"',
    responseType: '"json"'
   };
   const options = {
     url: BACA_URL,
     headers: {
      apiKey: BACA_API_KEY,
      Authorization: BACA_BASIC_AUTH,
      Accept: 'application/json'
    },
    formData: formData
   }
   // Return new promise
   return new Promise(function(resolve, reject) {
       	// Do async job


        request.post(options, function optionalCallback(err, httpResponse, body) {
        if (err) {
          reject(err)
        }
        else {
          resolve(JSON.parse(body));
        }

      });
  })
}
function CheckTheCAData(aid) {

  const options = {
    url: BACA_URL + "/" + aid + "/json"   ,
    headers: {
     apiKey: BACA_API_KEY,
     Authorization: BACA_BASIC_AUTH,
     Accept: 'application/json'
   },
  }
   // Return new promise
   return new Promise(function(resolve, reject) {
       	// Do async job
        request.get(options, function optionalCallback(err, httpResponse, body) {
        if (err) {
          reject(err)
        }
        else {
          resolve(JSON.parse(body));
        }

      });
  })
}




module.exports = router;
