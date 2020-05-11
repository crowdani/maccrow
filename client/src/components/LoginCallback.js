import React,{Component} from 'react';

import { Redirect } from "react-router-dom";


class LoginCallback extends Component {

  UNSAFE_componentWillMount() {
    //this.callAPI();
    console.log(this.props.location.hash);
    var arrs = this.props.location.hash.split("&")
    var access_token_string = arrs[1];
    var access_token_string_split = access_token_string.split("=");
    var access_token = access_token_string_split[1]
    console.log(access_token);
    this.setState({access_token: access_token});
  }

  render(){
    return (
      <Redirect
      to={{
        pathname: "/docprocessing",
        state: { access_token: this.state.access_token }
  }}
/>


    )
  }
}

export default LoginCallback;
