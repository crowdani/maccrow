import React,{Component} from 'react';
import {  Spinner, Button } from 'react-bootstrap';
class Loading extends Component {

  render(){
    return (
<div>
<Button variant="primary" disabled>
    <Spinner
      as="span"
      animation="grow"
      size="sm"
      role="status"
      aria-hidden="true"
    />
    Loading...
  </Button>
  </div>

)
}
}

export default Loading;
