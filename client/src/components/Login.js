import React, { FC, useCallback } from "react";
//import { Card, Button } from "@material-ui/core";
//import styled from "@emotion/styled";
import { Button } from 'react-bootstrap';


//const StyledCard = styled(Card)`
//  padding: 20px;
//  margin: 100px auto;
//  max-width: 40vw;
//  min-width: 300px;
//`;

const LoginComp: FC = () => {

  const handleGoogleLogin = useCallback(async () => {



    try {
      //const response = await fetch(`/api/auth-url/google?${qParams}`);
    //  https://<ums-host>/oidc/endpoint/ums/authorize?response_type=token&client_id=browser&scope=openid&state=none&redirect_uri=http://192.168.99.100:8080https://<ums-host>/oidc/endpoint/ums/authorize?response_type=token&client_id=browser&scope=openid&state=none&redirect_uri=http://192.168.99.100:8080
      const url = "https://ums-uk.159.122.214.124.nip.io/oidc/endpoint/ums/authorize?response_type=token&client_id=" + process.env.REACT_APP_CLIENT_SECRET + "&scope=openid&state=none&redirect_uri=http://"+ process.env.REACT_APP_REDIRECT_URL + "/oauth_callback/"
      window.location.assign(url);
    } catch (e) {
      console.error(e);
    }

  }, []);

  return (
    <div>
      <Button onClick={handleGoogleLogin}>
        Login with UMS
      </Button>
    </div>
  );
};

export default LoginComp;
