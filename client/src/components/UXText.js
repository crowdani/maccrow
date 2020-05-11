// ------------------------------------------------
// PLEASE DO NOT EDIT. FORK IF YOU NEED TO MODIFY.
// ------------------------------------------------

import React,{Component} from 'react';
import { render } from "react-dom";

import HeaderContainer from "carbon-components-react/lib/components/UIShell/HeaderContainer";
import {
  Content,
  Header,
  HeaderMenuButton,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
  SideNav,
  SideNavItems,
  SideNavLink,
  SideNavMenu,
  SideNavMenuItem
} from "carbon-components-react/lib/components/UIShell";
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
  Column
} from "carbon-components-react";



class UXTest extends Component {



  render(){

    return (

      <Grid fullWidth>
      <Row>
        <Column><h1>Document Processing</h1></Column>
      </Row>
       <Row>

       <Column>
          <Button>Refresh Status</Button>
      </Column>

         <Column>
            <Button>Add Document</Button>
        </Column>
      </Row>
      <Row>
        <Column>Files</Column>
      </Row>
      <Row>
        <Column sm={{span: 2}}>Files</Column>
      </Row>
    </Grid>



    );
  }
}
export default UXTest;
