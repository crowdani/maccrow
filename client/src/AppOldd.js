import React,{Component} from 'react';
import { Navbar, Jumbotron, Button } from 'react-bootstrap';
import { BrowserRouter, Route, Switch,Redirect } from "react-router-dom";
import {Progress} from 'reactstrap';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import logo from './logo.svg';
import './App.css';
import Docprocessing from './components/docprocessing'
import Login from './components/Login'
import LoginCallback from './components/LoginCallback'
import { createOauthFlow } from 'react-oauth-flow';


import { createBrowserHistory } from "history";

const { Sender, Receiver } = createOauthFlow({
  authorizeUrl: 'https://ums-bacs-554.159.8.181.251.nip.io/oidc/endpoint/ums/authorize',
  tokenUrl: 'https://ums-bacs-554.159.8.181.251.nip.io/oidc/endpoint/ums/token',
  clientId: "AndyAppClient",
  clientSecret: "AndyAppClient",
  redirectUri: 'http://localhost:3000/oauth_callback/',
  appName: "AndyAppClient"
});


class App extends Component {

  handleError = async error => {
      console.error('Error: ', error.message);

      const text = await error.response.text();
      console.log(text);
    };
    handleSuccess = (accessToken, { response, state }) => {
       console.log('Success!');
       console.log('AccessToken: ', accessToken);
       console.log('Response: ', response);
       console.log('State: ', state);
     };


  constructor(props) {
    super(props);
    this.state = {
         selectedFile: null
       }
  }

  callAPI() {
    fetch("http://localhost:9000/testAPI")
        .then(res => res.text())
        .then(res => this.setState({ apiResponse: res }));
  }

  componentWillMount() {
    //this.callAPI();
  }
  onChangeHandler=event=>{
    console.log("state Changed");
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0,
    })
 }

 onClickHandler = () => {
     const data = new FormData()
     console.log(this.state.selectedFile);
     data.append('file', this.state.selectedFile)
     axios.post("http://localhost:9000/testAPI", data, {
       onUploadProgress: ProgressEvent => {
        this.setState({
          loaded: (ProgressEvent.loaded / ProgressEvent.total*100),
      })    // receive two parameter endpoint url ,form data
    }})
    .then(res => { // then print response status
      console.log(res.statusText)
    })
 }


  render(){
      const hist = createBrowserHistory();
    return (

  <BrowserRouter history={hist}>
      <Jumbotron>
        <h1 className="header">Welcome To AndyApp</h1>
        <h2>The place where document Magic Happens </h2>
      </Jumbotron>

      <Route exactpath="/"
          render={() => (
            <div>
              <Sender
                state={{ to: '/auth/success' }}
                render={({ url }) => <a href={url}>Connect to Dropbox</a>}
                onAuthSuccess={this.handleSuccess}
                onAuthError={this.handleError}
              />
            </div>
          )}
        />

        <Route
  exact
  path="/auth/dropbox"
  render={({ location }) => (
    <Receiver
      location={location}
      onAuthSuccess={this.handleSuccess}
      onAuthError={this.handleError}
      render={({ processing, state, error }) => {
        if (processing) {
          return <p>Processing!</p>;
        }

        if (error) {
          return <p style={{ color: 'red' }}>{error.message}</p>;
        }

        return <Redirect to={state.to} />;
      }}
    />
  )}
/>
      </BrowserRouter>

    );
  }
}
export default App;
