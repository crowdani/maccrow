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
               console.log("Dans", caData);
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
