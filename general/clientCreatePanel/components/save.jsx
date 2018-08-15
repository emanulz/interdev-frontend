/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import alertify from 'alertifyjs'
import {saveClient} from '../actions.js'
import {getFullClientById} from '../../../apps/sales/general/clients/actions.js'

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
      console.log(err.response)
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      alertify.alert('ERROR', `Error al crear cliente: ${err.response.data}`)
      let error = err.response.data
      error = error.replace(/\{/g, '').replace(/\}/g, '').replace(/\[/g, '').replace(/\]/g, '').replace(/'/g, '')
      alertify.alert('ERROR', `Error: ${error}`)
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
    })

  }

  render() {

    return <div className='clientCreatePanel-content-save'>
      <div onClick={this.saveBtn.bind(this)}>
        Registrar
        <i className='fa fa-save' aria-hidden='true' />
      </div>
    </div>

  }

}
