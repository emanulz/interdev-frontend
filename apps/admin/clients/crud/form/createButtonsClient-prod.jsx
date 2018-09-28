import React from 'react'
import alertify from 'alertifyjs'
import {connect} from 'react-redux'
import {saveItem} from '../../../../../utils/api'
import {checkClientProduct} from '../../actions'
import { withRouter } from 'react-router-dom'

@connect((store) => {
  return {
    client: store.clients.clientActive,
    clientProdFormVisible: store.clients.clientProdFormVisible,
    activeClientProd: store.clients.activeClientProd,
  }
})

class CreateButtons extends React.Component {

  // BUTTONS
  saveBtn() {

    //check if this is a create or edit
    const activeClientProd = this.props.activeClientProd
    const client = this.props.client
    activeClientProd.client_id= client.id
    const fieldsOk = checkClientProduct(activeClientProd)

    let endpoint = '/api/clientproduct/'
    if (activeClientProd.is_edit){
      endpoint =  `/api/clientproduct/custom_update/`
    }

    if (fieldsOk) {
      const kwargs = {
        url: endpoint,
        item: activeClientProd,
        sucessMessage: 'Entrada Cliente-Producto creada correctamente.',
        errorMessage: 'Hubo un error al crear la entrada Cliente-Producto, intente de nuevo.',
        dispatchType: ''
      }

      this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      this.props.dispatch(saveItem(kwargs))
    }

    this.props.dispatch({type:'HIDE_CLIENT_PRODUCT_EDIT'})
  }

  hideEdit(event){
      this.props.dispatch({type: 'HIDE_CLIENT_PRODUCT_EDIT'})
  }

    
  render() {
    // ********************************************************************
    // BUTTONS
    // ********************************************************************
    const buttons = <div className='col-xs-12 row form-buttons-container-row'>
      <div className='col-xs-12 col-sm-4'>
        <button onClick={this.saveBtn.bind(this, true)}
          className='form-buttons-container-save form-control btn-success'>
          Actualizar
        </button>
      </div>

      <div className='col-xs-12 col-sm-4'>
        <button onClick={this.hideEdit.bind(this)}
          className='form-buttons-container-cancel form-control btn-danger'>
          Cancelar
        </button>
      </div>
    </div>

    // ********************************************************************
    // RETURN BLOCK
    // ********************************************************************
    return <div className='form-buttons-container'>
      {buttons}
    </div>

  }
}

// EXPORT THE CLASS WITH ROUTER
export default withRouter(CreateButtons)
