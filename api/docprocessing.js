import React,{Component} from 'react';
import cp4aservice from '../services/cp4aservices.js';
import ProgressBar from 'react-bootstrap/ProgressBar'
import axios from 'axios';
import 'carbon-components/css/carbon-components.min.css';
import {Redirect } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Tabs,
  Tab,
  ProgressStep,
  ProgressIndicator,
  Tooltip,
  Grid,
  Row,
  Column,
  Loading
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


  verifyToken = () =>{

    //  this.props.location.state
      //console.log(myval);

      console.log(this.props.location.state);
      if(typeof this.props.location.state == 'undefined'){
          console.log(false);
         return false
      }else{
        return true;
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

    this.timer = setTimeout(() =>this.onSubmitHandler(), 300);

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
     progress: true,
     DocProcessing: 1
   });
   cp4aservice.uploadFile(this.state.selectedFile,this.state.access_token.access_token).then(analyzerId =>{
     this.setState({
       anaylserID: analyzerId,
       uploaded: true,
       progrss: false,
       DocProcessing: 2
     })
     this.timer = setTimeout(() =>this.doCp4aWork(), 3009);
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
    if(!this.verifyToken()){
      return <Redirect to="/login" />;
    }else{
    return (

      <Grid fullWidth>
        <Row>
          <Column><h1>Document Processing</h1></Column>
        </Row>
        <Row>
          <Column>
          <ProgressIndicator>
            <ProgressStep
              label="Upload"
                description="Step 1: Getting started with Carbon Design System"

            />
            <ProgressStep
              label="Processing"
                description="Step 1: Getting started with Carbon Design System"

            />
            <ProgressStep
              label="Review"
                description="Step 1: Getting started with Carbon Design System"

            />
          </ProgressIndicator>
          </Column>
          </Row>
        <Row>
          <Column>
            {this.state.DocProcessing == 0 && (<Uploader onChange={this.onChangeHandler} files={this.state.files}/>)}
            {this.state.DocProcessing == 1 && ( <Loading description="Uploading Document" withOverlay={false} />)}
            {this.state.DocProcessing == 2 && (<div><div><label>Analyser ID</label> : {this.state.anaylserID}</div><div>Processing Document <ProgressBar now={this.state.progressState} label={this.state.progressMessage}/> </div></div>)}
            {this.state.DocProcessing == 4 && (<RulesMessages rulesmessages={this.state.rulesM} />)}
          </Column>
        </Row>
      </Grid>


    );
  }
  }
}
export default docprocessing;
