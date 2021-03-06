/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import alertify from 'alertifyjs'
import {updateClient, updateClientLocal} from '../actions.js'
import {getFullClientById} from '../../../apps/sales/general/clients/actions.js'

@connect((store) => {
  return {
    client: store.clientUpdatePanel.clientActive,
    clientLocal: store.clientUpdatePanel.clientLocalActive
  }
})
export default class ClientCreateSave extends React.Component {

  saveBtn() {
    const client = {...this.props.client}

    const kwargs = {
      url: `/api/clients/${client.id}/`,
      item: client
    }

    const localObject = this.props.clientLocal
    localObject['client'] = this.props.client.id

    const localKwargs = {
      url: `/api/clientlocal/${localObject.id}/`,
      item: localObject,
      errorMessage: 'Hubo un error al actualizar el Local del Cliente, intente de nuevo.',
      dispatchType: 'CLEAR_CLIENT_LOCAL_ADDING_UPDATING'
    }
    const updateLocalPromise = new Promise((resolve, reject) => {
      this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      this.props.dispatch(updateClientLocal(localKwargs, resolve, reject))
    })

    const _this = this

    updateLocalPromise.then(() => {
      const __this = _this
      const updatePromise = new Promise((resolve, reject) => {
        __this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        __this.props.dispatch(updateClient(kwargs, resolve, reject))
      })
      // SAVE PROCESS
      updatePromise.then((data) => {
        console.log('DATAAAA', data)
        this.props.dispatch({type: 'CLEAR_UPDATE_CLIENT', payload: ''})
        this.props.dispatch({type: 'HIDE_UPDATE_CLIENT_PANEL', payload: ''})
        this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
        // THEN SET THE NEW CLIENT AS ACTIVE
        let newClient
        try {
          newClient = data
          const clientId = newClient.id
          getFullClientById(clientId, _this.props.dispatch)
          // _this.props.dispatch({type: 'CLIENT_SELECTED', payload: newClient})
          alertify.alert('COMPLETADO', `Cliente actualizado correctamente.`)
        } catch (err) {
          alertify.alert('ERROR', `Error al cargar el cliente actualizado, por favor haga una búsqueda por nombre para utilizarlo.`)
        }
      }).catch((err) => {
        if (err.response) {
          console.log(err.response.data)
          alertify.alert('Error', `Hubo un error al actualizar el Cliente, ERROR: ${err.response.data.friendly_errors}, ERROR DE SISTEMA: ${err.response.data.system_errors}`)
        } else {
          console.log('NO CUSTOM ERROR')
          console.log(err)
          alertify.alert('Error', `Hubo un error al actualizar el Cliente, ERROR: ${err}.`)
        }
        this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  render() {

    return <div className='clientCreatePanel-content-save'>
      <div onClick={this.saveBtn.bind(this)}>
        Actualizar
        <i className='fa fa-save' aria-hidden='true' />
      </div>
    </div>

  }

}
