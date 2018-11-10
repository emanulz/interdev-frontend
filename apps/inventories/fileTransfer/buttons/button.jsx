import React from 'react'
import {connect} from 'react-redux'
import {generalSave} from '../../../../utils/api.js'

@connect(store=>{
    return {
        note: store.extras.notes,
        cart: store.cart,
        sendToEmails: store.extras.client.email,
        uniqueId: store.fileTransfer.uniqueId,
        selectedWarehouse: store.warehouses2.selectedWarehouse.id
    }
})
export default class Buttons extends React.Component {


    generateTransfer(){
        console.log("Generating Inv transfer")
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

    render() {
        return <div className="col-xs-12 buttons">
            <button
                onClick={this.generateTransfer.bind(this)}
                style={{
                'height': '48px',
                'width': '49%',
                'marginTop': '10px'
                }}
                className='btn btn-default'>
                Generar Transferencia
                <span>
                <i className='fa fa-cloud-download' />
                </span>
            </button>
        </div>
    }
}