import React from 'react'
import {connect} from 'react-redux'
import Warehouse from '../../../../general/warehouses/warehouse.jsx'
import {checkImportData, importData, validateFile} from '../actions.js'


@connect(store=>{
    return {
        file: store.picker.file,
        warehouse: store.warehouses2.selectedWarehouse,
        load_preview: store.transferDataLoad.load_preview,
        requested_by: store.transferDataLoad.transferData.requested_by
    }
})
export default class Aside extends React.Component {


    componentWillMount(){
        
    }

    componentDidUpdate(prevProps, prevState){
        if(!prevProps.load_preview && this.props.load_preview){
            this.props.dispatch({type:'UNTAG_FOR_PREVIEW_LOAD'})
            this.previewMerchandise()
        }
    }

    componentWillReceiveProps(nextprops){
        if(nextprops.file !== this.props.file){
            console.log("Dispatch file validation")
            let valid = validateFile(nextprops.file)
            if(valid){
                //dispatch the file processing if it is valid
                this.props.dispatch({type:'TAG_FOR_PREVIEW_LOAD'})
            }
        }
    }

    importMerchandise(){
        this.importOrPreviewMerchandise(true, 
            'MERCHANDISE_LOAD_SUCCESFULLY',
            'MERCHANDISE_LOAD_FAILURE')
    }

    previewMerchandise(){
        this.importOrPreviewMerchandise(false,
            'MERCHANDISE_PREVIEW_LOAD_SUCCESS',
            'MERCHANDISE_PREVIEW_LOAD_FAIL'
            )
    }

    importOrPreviewMerchandise(should_import, onSuccess, onFailure){

        //check if the view is ready to load the inventory
        let is_valid = true
        if(should_import){
            is_valid = checkImportData(this.props.warehouse, this.props.file)
        }
        

        if(!is_valid){
            return
        }

        const formData = new FormData()
        formData.append('transfer_file', this.props.file)
        formData.append('warehouse', this.props.warehouse.id)
        formData.append('should_process', should_import)
        const transfer_kwargs = {
            url: '/api/inventorymovementslist/loadTransferFile/',
            data: formData,
            onSuccess: onSuccess,
            onFailure: onFailure
        }

        this.props.dispatch(importData(transfer_kwargs))

    }

    render(){

        let created_by = ""
        if(this.props.requested_by){
            console.log("Requested by --> ", this.props.requested_by)
            let parsed_data = JSON.parse(this.props.requested_by)
            let first_name = parsed_data.first_name
            let last_name = parsed_data.last_name
            console.log(first_name, last_name)
            if(first_name==="" && last_name===""){
                created_by = `${parsed_data.username}`
            }else{
                created_by = `${first_name} ${last_name}`
            }
            
        }

        return <div className="transfer-view-aside">
            <div className="transfer-view-aside-title">
                <h1>Información Transferencia</h1>
            </div>
            <div className="transfer-view-aside-createdby">
                <div className="transfer-view-aside-legend">
                    Creada por:
                </div>
                <div className="transfer-view-aside-value">
                    {created_by}
                </div>
            </div>

            {/*<div className="transfer-view-aside-origin">
                <div className="transfer-view-aside-legend">
                    Local origen:
                </div>
                <div className="transfer-view-aside-value">
                    Local 2
                </div>
            </div>*/}

            <div className="transfer-view-aside-warehouse">
                <Warehouse />
            </div>          

            <div className="transfer-view-aside-buttons">
                <button className='form-control btn-primary product-importer-btn product-importer-btn-import'
                        onClick={this.importMerchandise.bind(this)}>
                        Cargar Mercaderia
                    </button>
            </div>

        </div>
    }
}





