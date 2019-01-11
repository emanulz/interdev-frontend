import React from 'react'
import {connect} from 'react-redux'

import DragANDdrop from '../../../../general/dANDd/main.jsx'

import {uploadXmlForProcessing} from '../actions.js'

@connect(store=>{
    return{
        files: store.smart_purchase.files,
        selectedFile: store.smart_purchase.selectedFile,
        force_reprocess: store.smart_purchase.force_reprocess
    }
})
export default class Purchase_Loader extends React.Component {


    componentWillMount() {

    }

    componentWillUpdate(nextProps){
        //force reprocess on events such as a new supplier created
        //or associated
        if(!this.props.force_reprocess &&  nextProps.force_reprocess){
            this.processFiles()
        }
    }

    handleDocsDrop = (files) => {
        this.props.dispatch({type: 'SET_FILES', payload:files})
    }

    selectedFile(file, e){
        this.props.dispatch({type: 'SET_FILE_SELECTED', payload: file})
    }

    removeFile(file, e){
        this.props.dispatch({type:'REMOVE_FILE', payload: file})
    }

    makeFileDiv(file){
        if(file.type !=='text/xml'){
            return ''
        }
        return <div className="dnd-container-presentation-item" 
        key={file.lastModified}
        onClick={this.selectedFile.bind(this, file)}>
            {file.name}
            <span onClick={this.removeFile.bind(this, file)} className="fa fa-times-circle"/>
        </div>
    }

    processFiles(){
        this.props.dispatch({type:'FETCHING_STARTED'})
        this.props.dispatch({type: 'FORCE_REPROCESS_FIRED'})
        const formData = new FormData()
        for(let file of this.props.files){
            formData.append(file.name, file)
        }
        
        formData.append('preprocess', true)
        let upload_kwarg = {
            data: formData,
            url: '/api/purchase/smart_purchase/',
            
        }

        this.props.dispatch(uploadXmlForProcessing(upload_kwarg))
    }

    render() {

        let childs = []
        {for(let i = 0; i<this.props.files.length; i++){
            childs.push(this.makeFileDiv(this.props.files[i]))
        }}

        return <div className='purchase_loader'>
            <h1 className="section_header">Seleccione el archivo XML de la compra electrónica</h1>
            <hr/>

            <DragANDdrop handleDrop = {this.handleDocsDrop} refresh = {this.props.files}>
                <div className="dnd-container-presentation">
                    {childs}
                </div>
            </DragANDdrop>

            <button 
            onClick={this.processFiles.bind(this)}
            id="process_button">
                Procesar documentos
            </button>


        </div>
    }
}