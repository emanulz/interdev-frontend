import React from 'react'
import {connect} from 'react-redux'
import {generalSave} from '../../../../utils/api.js'

@connect(store=>{
    return {
        note: store.extras.notes,
        cart: store.cart,
        sendToEmails: store.extras.client.email,
        uniqueId: store.fileTransfer.uniqueId,
        selectedWarehouse: store.warehouses2.selectedWarehouse.id,
        transfer_location: store.fileTransfer.transfer_location
    }
})
export default class Buttons extends React.Component {


    generateTransfer(){
        const kwargs = {
            url: '/api/inventorymovementslist/transferInv/',
            method: 'post',
            successType: 'INV_DOWNLOAD_SUCCESFUL',
            errorType: 'INV_DOWNLOAD_REJECTED',
            sucessMessage: 'Transferencia de inventario a archivo éxitosa',
            errorMessage: 'Error al transferir inventario a archivo',
            data: {
              notes: this.props.note,
              cart: JSON.stringify(this.props.cart),
              transfer_id: this.props.uniqueId,
              warehouse: this.props.selectedWarehouse 
            }
          }
          this.props.dispatch(generalSave(kwargs))
    }

    getFile(){
        //window.location.href = this.props.transfer_location
        //window.open(this.props.transfer_location, '_blank')
        document.getElementById('link').click()
    }

    render() {
        let download_button = ''
        let generate_button =''

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
        return <div className="col-xs-12 buttons">
            {generate_button}
            {download_button}
        </div>
    }
}