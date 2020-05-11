import React,{Component} from 'react';

import { Router, Route, Switch,Redirect } from "react-router-dom";


import axios from 'axios';
import Container from 'react-bootstrap/Container';


import docprocessing from './components/docprocessing'
import UXTest from './components/UXText'
import Login from './components/Login'
import LoginCallback from './components/LoginCallback'

import {
  Header,
  HeaderName,
  Content,
  SkipToContent,
  HeaderMenuItem,
  HeaderNavigation,
  HeaderGlobalBar,
  HeaderGlobalAction

} from "carbon-components-react/lib/components/UIShell";


import { createBrowserHistory } from "history";

const fakeAuthCentralState = {
  isAuthenticated:false,
  check(){
    console.log(this.props)
    if(!typeof this.props == 'undefined'){
      if(typeof this.props.location.state == 'undefined'){
          this.isAuthenticated = false
        }else{
          this.isAuthenticated= true;
        }
      }
    }
  }


const ProtectedRoute = ({ component: Component, ...rest }) => (
   <Route {...rest} render={(props) => (
      fakeAuthCentralState.check() ?
         <Component {...props} /> : <Redirect to={{ pathname: '/login', state: { from: props.location }}} />
   )} />
);

class App extends Component {


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
  const hist = createBrowserHistory()
    return (

<Router history={hist}>

<Header aria-label="CP4A">

    <HeaderName href="/docprocessing" prefix="IBM">
        Rules Based Document  Reader
    </HeaderName>
    <HeaderNavigation aria-label="Carbon Tutorial">
      <HeaderMenuItem href="/login">Login</HeaderMenuItem>
      </HeaderNavigation>
  </Header>
<Content>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/oauth_callback" component={LoginCallback} />
          <Route path="/docprocessing" component={docprocessing} />
        </Switch>

  </Content>

</Router>

    );
  }
}
export default App;
