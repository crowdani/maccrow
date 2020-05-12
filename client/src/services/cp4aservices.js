import axios from 'axios';

const Cp4aService = {
  checkStatus: function(analyserId,token) {
      return new Promise(function(resolve, reject) {
        var serviceReturn = {}
        axios.get("http://"+ process.env.REACT_APP_BACKEND_URL+"/cp4aproxy/CheckStatus/?aid=" + analyserId +"&token=" +  token)
        .then(res => {
          var status = res.data.data.statusDetails[0].status;
          var progress = res.data.data.statusDetails[0].progress;
          var completedPages = res.data.data.statusDetails[0].completedPages
          var totalPages = res.data.data.numPages;
          var progressMessage = "";

          //alert(status);
          if(status == "InProgress"){
            if(completedPages == 0){
              progressMessage = "Pre-Processing Document"
            }else{
              progressMessage = completedPages + " of " + totalPages + " pages completed"
            }
              serviceReturn = {"status" : "InProgress", "progress": progress,"completedPages": completedPages,"progressMessage": progressMessage }
               resolve(serviceReturn);
          }else{
            axios.get("http://"+ process.env.REACT_APP_BACKEND_URL+"/cp4aproxy/getData/?aid=" + analyserId +"&token=" + token)
            .then(res => { // t
               var rex = new RegExp('Sensitivity":false', 'g');
               var BACA_STRING_RESPONSE = JSON.stringify(res.data)
               BACA_STRING_RESPONSE = BACA_STRING_RESPONSE.replace(rex, 'Sensitivity":0');

               var caData = JSON.parse(BACA_STRING_RESPONSE);
               //console.log("Dans", caData);
               axios.post("http://"+ process.env.REACT_APP_BACKEND_URL+"/cp4aproxy/rules",caData.data).then(res =>{
                 serviceReturn = {"status" : "Complete", "rulesMessages" : res.data.metaData_inout.ruleMessages, "progress": "100", "progressMessage": "Completed" }
                 resolve(serviceReturn);

               })
             })
          }
        }).catch(function (error) {
          reject(error);

          });
        });
    },

    AdjustRulesData: function(rulesMessages){

      //var rules = ["APG7103FI - Blah, value","APG7103FI - Blah 2, value", "APG7104FI - Blah 1,value"];
      var rules = rulesMessages
      var rtnVal = {};
      var newrulesObject = [];
      var headers  = [];
      var rowData = [];
      headers.push({"header": "esccode", "key": "esccode"})
      rules.forEach(function(message){
        var res = message.substr(0, 9);
        var patt = "[A-Z]{3}[0-9]{4}[A-Z]{2}";
        const re = new RegExp(patt)
        var foundHeader=false
        //Iss the ESC Code present.
        if(re.test(res)){
          //Split the line


          var arr = message.split("-")

          var code = arr[0];
          var value = arr[1]
          //Value is , seperated
          var myvalfields = value.split(",");
          var fieldName = myvalfields[0].trim()
          var fieldValue = myvalfields[1].trim();
          if(headers.length!=0){
            for (let i = 0; i < headers.length; i++) {
              if(headers[i].key==fieldName){
                  foundHeader = true;
              }

            }
            if(!foundHeader){
                headers.push({"header": fieldName, "key": fieldName})
            }
          }else{
            headers.push({"header": fieldName, "key": fieldName})
          }
        }
      })

      rules.forEach(function(message) {
        var res = message.substr(0, 9);
        var patt = "[A-Z]{3}[0-9]{4}[A-Z]{2}";
        const re = new RegExp(patt)
        //Iss the ESC Code present.
        if(re.test(res)){
          //Split the line
          var arr = message.split("-")
          var code = arr[0];
          var value = arr[1]
          //Value is , seperated
          var myvalfields = value.split(",");
          var fieldName = myvalfields[0].trim()
          var fieldValue = myvalfields[1].trim();


          code = code.trim()

          var found = false;
          console.log(newrulesObject.length);

          if(newrulesObject.length!=0){
            for (let i = 0; i < newrulesObject.length; i++) {

              console.log(newrulesObject[i].esccode + ":" + code);
                if(newrulesObject[i].esccode==code){
                  found = true;
                  newrulesObject[i][fieldName] = fieldValue

                }
            }
            console.log("Did the find it" + found);
            if(found == false){
              newrulesObject.push({"id":code,"esccode": code, [fieldName]: fieldValue})

            }
          }else{
            newrulesObject.push({"id":code,"esccode": code, [fieldName]: fieldValue})
          }
          console.log(newrulesObject);
        }
        console.log(res);
      });
      rtnVal.headers = headers;
      rtnVal.rulesObject = newrulesObject
      return rtnVal;
    },

    uploadFile: function(file,token) {
      return new Promise(function(resolve, reject) {
        const data = new FormData()
        data.append('file', file)
        data.append('access_token',token)
        axios.post("http://"+ process.env.REACT_APP_BACKEND_URL+"/cp4aproxy", data, {}).then(res => {
          resolve(res.data.data.analyzerId);
        }).catch(function (error) {
          reject(error);

        });
      });
    }
};

export default Cp4aService;
