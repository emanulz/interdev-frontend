/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import alertify from 'alertifyjs'
import {saveClient} from '../actions.js'
import {getFullClientById} from '../../../apps/sales/general/clients/actions.js'
import { generalSave } from '../../../utils/api.js'

@connect((store) => {
  return {
    client: store.clientCreatePanel.clientActive,
    autoCode: store.clientCreatePanel.autoCode
  }
})
export default class ClientCreateSave extends React.Component {

  saveBtn() {
    const client = {...this.props.client}
    client['code'] = this.props.autoCode ? '' : client['code']

    const kwargs = {
      url: '/api/clients/',
      item: client
    }

    const _this = this

    const updatePromise = new Promise((resolve, reject) => {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      _this.props.dispatch(saveClient(kwargs, resolve, reject))
    })
    // SAVE PROCESS
    updatePromise.then((data) => {
      this.props.dispatch({type: 'CLEAR_CREATE_CLIENT', payload: ''})
      this.props.dispatch({type: 'HIDE_CREATE_CLIENT_PANEL', payload: ''})
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      // THEN SET THE NEW CLIENT AS ACTIVE
      let newClient
      try {
        newClient = data
        const clientId = newClient.id
        getFullClientById(clientId, _this.props.dispatch)
        // _this.props.dispatch({type: 'CLIENT_SELECTED', payload: newClient})
        alertify.alert('COMPLETADO', `Nuevo Cliente creado correctamente con el código: ${newClient.code}`)
      } catch (err) {
        alertify.alert('ERROR', `Error al cargar el nuevo cliente, por favor haga una búsqueda por nombre para utilizarlo.`)
      }
    }).catch((err) => {
      if (err.response) {
        console.log(err.response.data)
        alertify.alert('Error', `Hubo un error al Crear el Cliente, ERROR: ${err.response.data.friendly_errors}, ERROR DE SISTEMA: ${err.response.data.system_errors}`)
      } else {
        console.log('NO CUSTOM ERROR')
        console.log(err)
        alertify.alert('Error', `Hubo un error al Crear el Cliente, ERROR: ${err}.`)
      }
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
    })

  }

  sicApi(){
    let target_id = this.props.client.id_num
    if(!target_id || target_id.length<9){
      alertify.alert('Información', `Se debe ingresar una identificación de 9 ó 10 dígitos.`)
    }
    console.log("Target id --> ", target_id)
    const kwargs = {
      url: `/api/clients/getClientData/?id_number=${target_id}`,
      method: 'get',
      successType: 'CLIENT_SIC_DATA_FETCHED',
      errorType: 'CLIENT_SIC_DATA_REJECTED',
      sucessMessage: 'Datos del cliente obtenidos.',
      errorMessage: 'Error identificando el cliente.'
    }

    this.props.dispatch(generalSave(kwargs))
    this.props.dispatch({type: "FETCHING_STARTED"})
  }

  render() {

    return <div className='clientCreatePanel-content-save'>
      <div onClick={this.saveBtn.bind(this)}>
        Registrar
        <i className='fa fa-save' aria-hidden='true' />
      </div>
      <div onClick={this.sicApi.bind(this)}>
        Identificar ID
        <i className='fa fa-rocket' aria-hidden='true' />
      </div>
    </div>

  }

}
