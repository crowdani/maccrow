var express = require('express');
var router = express.Router();
var multer = require('multer')
var fs = require('fs');
var request = require('request').defaults({ rejectUnauthorized: false });


var ODM_ProcessBacaDocument_ServiceURL = "https://uk-cp4a-deployment-odm-ds-console-route-cp4a-all.uktechcluster-4d2c0e6e364e1cb6bda1360a996d18f0-0000.eu-gb.containers.appdomain.cloud/DecisionService/rest/v1/ContentAnalyzer/ProcessDocument/OPENAPI?format=JSON";
var BACA_URL = process.env.REACT_APP_BACA_URL
var BACA_API_KEY = process.env.REACT_APP_BACA_API_KEY;
//var BACA_BASIC_AUTH = "Bearer 6HypaAe98LeBXyYOU9D8ukgHFYy6hfc6EvstD3xX";

//var storage = multer.memoryStorage();

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

  CheckTheCAStatus(req.param('aid'),req.param('token')).then(function(result) {
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

router.get('/getData', function(req, res, next) {
  console.log(req.param('aid'));

  CheckTheCAData(req.param('aid'),req.param('token')).then(function(result) {
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

router.post('/rules', function(req, res, next) {
  //console.log(req.body);
  var data2 = req.body;
  console.log(data2);
  RunTheRules(data2).then(function(result){
    res.status(200).send(result);
  })

});



router.post('/', function(req, res, next) {
  console.log(req.body)
  console.log(process.env.REACT_APP_BACA_API_KEY);
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err)
    } else if (err) {
      return res.status(500).json(err)
    }
    console.log(req.body.access_token)
    console.log(req.body)
    console.log(req.file)
    console.log("Calling mYData")
    CATheData(req.file,req.body.access_token).then(function(result) {
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

function CATheData(file, token) {
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
     url: process.env.REACT_APP_BACA_URL + "/contentAnalyzer",
     headers: {
      apiKey: process.env.REACT_APP_BACA_API_KEY,
      Authorization: "Bearer " +token,
      Accept: 'application/json'
    },
    formData: formData
   }
   console.log(options);
   // Return new promise
   return new Promise(function(resolve, reject) {
       	// Do async job


        request.post(options, function optionalCallback(err, httpResponse, body) {
        if (err) {
          reject(err)
        }
        else {
          fs.unlinkSync(file.path);
          resolve(JSON.parse(body));
        }

      });
  })
}

function CheckTheCAStatus(aid, token) {

  const options = {
    url: process.env.REACT_APP_BACA_URL + "/contentAnalyzer" + "/" + aid + ""   ,
    headers: {
     apiKey: process.env.REACT_APP_BACA_API_KEY,
     Authorization: "Bearer " +token,
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

function RunTheRules(data) {

  var odmData = {
    "__DecisionID__": "string",
    "document_in": data,
    "metaData_inout": {"dynamicParams": "" }
  }

  console.log("My payload", odmData);

  const options = {
    url: process.env.REACT_APP_ODM_ProcessBacaDocument_ServiceURL,
    body: odmData,
    headers : {
      "content-type": "application/json"
    },
    json: true,
    auth: {
      user: "odmAdmin",
      pass: "odmAdmin"
  }
  }
   // Return new promise
   return new Promise(function(resolve, reject) {
       	// Do async job
        request.post(options, function optionalCallback(err, httpResponse, body) {
        if (err) {
           return console.error('upload failed:', err);
        }
        else {
          //console.log(httpResponse);

          resolve(body);


        }

      });
  })
}


function CheckTheCAData(aid, token) {

  const options = {
    url: process.env.REACT_APP_BACA_URL + "/contentAnalyzer" + "/" + aid + "/json"   ,
    headers: {
     apiKey: process.env.REACT_APP_BACA_API_KEY,
     Authorization: "Bearer " +token,
     Accept: 'application/json'

   },
  }
  console.log(options);
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
