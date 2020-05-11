import React,{Component} from 'react';
import { FileUploaderButton,FileUploaderItem } from "carbon-components-react";




class uploader extends Component {

  render(){
    return (

               <form method="post" action="#" id="#">
                    <div className="bx--file__container">
                       <FileUploaderButton onChange={this.props.onChange} />
                       {this.props.files.map(({ uuid, name, size,}) => (
           <FileUploaderItem
             key={uuid}
             uuid={uuid}
             name={name}
             size={size}
           />
         )
       )}
                   </div>
               </form>


    )
  }

}
export default uploader;
