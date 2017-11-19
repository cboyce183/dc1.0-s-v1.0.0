import React, { Component } from 'react';

import ReactFileReader from 'react-file-reader';
import Dropzone from 'react-dropzone';

import './App.css';

class DragDrop extends Component {

  handleFileChange = files => {
    try { var reader = new FileReader();
    reader.onload = () => {
      this.props.func(reader.result);
      console.log(reader.result)
    }
    console.log(reader.readAsText(files[0]));
  } catch (e) {
    alert('Invalid file type, please upload a JavaScript file');
    }
  }

  //=============================================== REDERING

  render() {
    return (
      <Dropzone className="DropZone" onDrop={this.handleFileChange} accept='.js'>
        <ReactFileReader handleFiles={this.handleFileChange} 
                        fileTypes={'.js'}>
          <button className="">Upload</button>
        </ReactFileReader>
      </Dropzone>
    );
  }
}

export default DragDrop;
