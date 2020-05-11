 import React,{Component} from 'react';
 import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell

 } from "carbon-components-react";

 class RulesMessages extends Component {

   render(){
     return (
       <div>
         <label>Data Extraction Rules</label>
         <TableContainer title="Data Extraction Results">
         <Table>
          <TableHead>
            <TableRow>
            <TableHeader>Message
            </TableHeader>
            </TableRow>
       </TableHead>
       <TableBody>

          {this.props.rulesmessages.map(txt =>
            <TableRow key={txt}>
            <TableCell key={txt}>{txt}</TableCell>
            </TableRow>
          )}
          </TableBody>
      </Table>
    </TableContainer>
        </div>


     )

   }
}
export default RulesMessages;
