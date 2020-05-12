 import React,{Component} from 'react';
 import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  DataTable

 } from "carbon-components-react";

 class RulesTable extends Component {

   render(){
     return (
       <div>
         <DataTable
         rows={this.props.rowData}
         headers={this.props.headerData}
         render={({ rows, headers, getHeaderProps }) => (
           <TableContainer title="Data Extraction Details">
            <Table>
              <TableHead>
                <TableRow>
                  {headers.map(header => (
                    <TableHeader {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow key={row.id}>
                    {row.cells.map(cell => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>)}
           />
        </div>
      )
}






}
export default RulesTable;
