import React,{Component} from 'react';
import cp4aservice from '../services/cp4aservices.js';
import ProgressBar from 'react-bootstrap/ProgressBar'
import axios from 'axios';
import 'carbon-components/css/carbon-components.min.css';

import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Tabs,
  Tab,
  ProgressStep,
  ProgressIndicator,
  Tooltip
} from "carbon-components-react";
//import ReactJson from 'react-json-view'
import Uploader from './uploader.js'
import RulesMessages from './rulesMessages.js'


class docprocessing extends Component {

  constructor(props) {
    super(props);
    console.log(this.props.location.state);
    this.state = {
         selectedFile: null,
         loaded: 0,
         anaylserID: "",
         uploading: true,
         uploaded: false,
         progress: false,
         progressState: 0,
         progressMessage: "",
         rulesM: [],
         successfullUploaded: false,
         DocProcessing: 0,
         files: [],
         access_token: this.props.location.state
       }

  }
  onChangeHandler=event=>{
    const  addFiles = event.target.files

    const a = Array.from(addFiles)
    //const files = [...filesList]
    console.log(a)
    const newFiles = a.map(File => ({
        uuid: File.name,
        name: File.name,
        size: File.size,
        status: 'uploading',
        iconDescription: 'Uploading',
      }));
    console.log(newFiles);
    this.setState({
      files: newFiles,
      selectedFile: event.target.files[0],
      loaded: 0,
    })
  //  this.onClickHandler();
 }



 doCp4aWork = ()  => {
   var serviceCall = cp4aservice.checkStatus(this.state.anaylserID, this.state.access_token.access_token).then(serviceReturn =>{
      console.log(serviceReturn);
      if(serviceReturn.status=="InProgress"){
          this.timer = setTimeout(() =>this.doCp4aWork(), 3000);
      }else{
          console.log(serviceReturn.rulesMessages);
          this.setState({
              rulesM : serviceReturn.rulesMessages,
              DocProcessing : 4
          })
      }
      this.setState({
        progressState: serviceReturn.progress,
        progressMessage: serviceReturn.progressMessage
      })
   });

 }
 onSubmitHandler = () => {
   this.setState({
     uploading: false,
     progress: true
   });
   cp4aservice.uploadFile(this.state.selectedFile,this.state.access_token.access_token).then(analyzerId =>{
     this.setState({
       anaylserID: analyzerId,
       uploaded: true,
       progrss: false
     })
     this.timer = setTimeout(() =>this.doCp4aWork(), 3000);
   })

 }
 onClickStatusHandler = () => {
     axios.get("http://localhost:9000/testAPI/CheckStatus/?aid=" + this.state.anaylserID +"&token=" + this.state.access_token.access_token)
       // receive two parameter endpoint url ,form d)
    .then(res => { // then print response status
      console.log(res)
      this.setState({
        jsonpayload: res.data
      })
    }).catch(function (error) {
    console.log(error);
  });
    console.log("What!")
 }



  render(){

    return (

      <div className="bx--grid">
      <div className="bx--row">
        <section className="bx--offset-lg-3 bx--col-lg-13">
      <Tabs>
        <Tab href="#" id="tab-1" label="Document Processing">
          <div>
            <ProgressIndicator currentIndex={0}>
              <ProgressStep
              label="Upload Documents"
              description="Step 1: Getting started with Carbon Design System"
            />
            <ProgressStep
              label="Document Processing"
              description="Step 3: Getting started with Carbon Design System"
            />
            <ProgressStep
              invalid
              label="Verify Results"
              description="Step 4: Getting started with Carbon Design System"
            />
            </ProgressIndicator>
            <div>
            {this.state.uploading && (<Uploader onChange={this.onChangeHandler} files={this.state.files}/>)}
            {this.state.uploading && (<Button onClick={this.onSubmitHandler} >Submit</Button>)}

            {this.state.uploaded && (<div><div><label>Analyser ID</label> : {this.state.anaylserID}</div><div>Processing Document <ProgressBar now={this.state.progressState} label={this.state.progressMessage}/> </div></div>)}

            {this.state.DocProcessing == 4 && (<RulesMessages rulesmessages={this.state.rulesM} />)}
            </div>
          </div>
        </Tab>
      </Tabs>
      </section>
      </div>
      <div>
      <div style={{ width: '50%' }}>
  <Tabs>
    <Tab
      href="#"
      id="tab-1"
      label="Document processing"
    >
      <div className="some-content">
        Content for first tab goes here.
      </div>
    </Tab>
    <Tab
      href="#"
      id="tab-2"
      label="Tab label 2"
    >
      <div className="some-content">
        Content for second tab goes here.
      </div>
    </Tab>
    <Tab
      href="#"
      id="tab-3"
      label='Tab label 3'
    >
      <div className="some-content">
        Content for third tab goes here.
      </div>
    </Tab>
  </Tabs>
</div>
      </div>
      </div>


    );
  }
}
export default docprocessing;
