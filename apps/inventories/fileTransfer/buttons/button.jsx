import React from 'react'
import {connect} from 'react-redux'
import {generalSave} from '../../../../utils/api.js'

@connect(store=>{
    return {
        note: store.extras.notes,
        cart: store.cart,
        sendToEmails: store.extras.client.email,
        uniqueId: store.fileTransfer.uniqueId,
        selectedWarehouseData: store.warehouse_multi.selectedWarehouse,
        transfer_location: store.fileTransfer.transfer_location,
        transfer_mode: store.fileTransfer.transfer_mode
    }
})
export default class Buttons extends React.Component {


    generateTransfer(){
        
        console.log("Selected warehouse data --> ", this.props.selectedWarehouseData)
        let warehouse = this.props.selectedWarehouseData["transfer_origin"]

        const kwargs = {
            url: '/api/filetransfers/transferInv/',
            method: 'post',
            successType: 'INV_DOWNLOAD_SUCCESFUL',
            errorType: 'INV_DOWNLOAD_REJECTED',
            sucessMessage: 'Transferencia de inventario a archivo éxitosa',
            errorMessage: 'Error al transferir inventario a archivo',
            data: {
              notes: this.props.note,
              cart: JSON.stringify(this.props.cart),
              transfer_id: this.props.uniqueId,
              warehouse: warehouse.id
            }
          }
          this.props.dispatch(generalSave(kwargs))
    }

    massLoadInv(type_flag){

        let destination_warehouse = this.props.selectedWarehouseData["transfer_destiny"]
        let warehouse = this.props.selectedWarehouseData["transfer_origin"]

        let is_input = "INPUT"
        switch(this.props.transfer_mode){
            case "OUTPUT":
                {
                    is_input = "OUTPUT"
                    console.log("FRONTEND DO INPUT --> ", is_input)
                    if(warehouse.id === '00000000-0000-0000-0000-000000000000' 
                        || warehouse === undefined){
                        console.log("Origin warehouse not selected")
                        return
                    }
                    break
                }
                

            case "INPUT": 
            {
                
                if(destination_warehouse.id === '00000000-0000-0000-0000-000000000000' 
                    || destination_warehouse === undefined){
                    console.log("Destination warehouse not selected")
                    return
                }
                break
                
            }

            case "TRANSFER":
            {
                if(destination_warehouse.id === warehouse.id){
                    console.log("On a transfer both warehouses must be different")
                    return
                }

                if(destination_warehouse.id === '00000000-0000-0000-0000-000000000000' 
                    || warehouse.id === '00000000-0000-0000-0000-000000000000'){
                        console.log("Se deben seleccionar ambas bodegas en una transferencia")
                        return
                }
                break
            }
        }

        const kwargs = {
            url: '/api/filetransfers/massLoadInv/',
            method: 'post',
            successType: 'INV_LOAD_SUCCESFUL',
            errorType: 'INV_LOAD_REJECTED',
            sucessMessage: 'Ingreso a inventario exitoso',
            errorMessage: 'Error ingresando mercadería',
            data: {
              notes: this.props.note,
              cart: JSON.stringify(this.props.cart),
              transfer_id: this.props.uniqueId,
              warehouse: warehouse ? warehouse.id: undefined,
              destination_warehouse: destination_warehouse ? destination_warehouse.id: undefined,
              is_input: is_input
            }
          }
          console.log("After KWARGS")
          this.props.dispatch(generalSave(kwargs))
    }

    getFile(){
        //window.location.href = this.props.transfer_location
        //window.open(this.props.transfer_location, '_blank')
        document.getElementById('link').click()
    }

    render() {
        let download_button = ''
        let generate_button = ''
        let mass_load_button = ''
        let mass_download_button = ''
        let mass_transfer_button = ''
        if(this.props.transfer_mode === "INPUT"){
            mass_load_button  = <button
            onClick={this.massLoadInv.bind(this, 'INPUT')} 
            style={{
                'height': '48px',
                'width': '49%',
                'marginTop': '10px'
                }}
            className='btn btn-default'>
                Cargar Inventario
            </button>
        }
        
        if(this.props.transfer_mode === "OUTPUT"){
            mass_download_button  = <button
            onClick={this.massLoadInv.bind(this, 'OUTPUT')} 
            style={{
                'height': '48px',
                'width': '49%',
                'marginTop': '10px'
                }}
            className='btn btn-default'>
                Descargar Inventario
            </button>
        }

        if(this.props.transfer_mode === "TRANSFER"){
            mass_download_button  = <button
            onClick={this.massLoadInv.bind(this, 'TRANSFER')} 
            style={{
                'height': '48px',
                'width': '49%',
                'marginTop': '10px'
                }}
            className='btn btn-default'>
                Transferir Inventario
            </button>
        }

        let proposed_file_name =''
        if(this.props.transfer_location !== "")
        {
            proposed_file_name = `${this.props.transfer_location.split('/').pop()}`

            download_button = <button
            onClick={this.getFile.bind(this)}
            style={{
            'height': '48px',
            'width': '49%',
            'marginTop': '10px'
            }}
            className='btn btn-default'>
           <a id="link" href={this.props.transfer_location} download={proposed_file_name}>
           Descargar Transferencia
           </a>
            <span>
            <i className='fa fa-cloud-download' />
            </span>
        </button>

        }else{
            if(this.props.transfer_mode === "FILE"){
                generate_button = <button
                onClick={this.generateTransfer.bind(this)}
                style={{
                'height': '48px',
                'width': '49%',
                'marginTop': '10px'
                }}
                className='btn btn-default'>
                Generar Transferencia
            </button>
            }

        }
        return <div className="col-xs-12 buttons">
            {generate_button}
            {download_button}
            {mass_load_button}
            {mass_download_button}
            {mass_transfer_button}
        </div>
    }
}