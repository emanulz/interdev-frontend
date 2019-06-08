/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import alertify from 'alertifyjs'
import {getElementStatus} from './actions.js'

@connect((store) => {
  return {
    document: store.documentDetail.activeDocument,
    userProfile: store.userProfile.profile
  }
})
export default class Documents extends React.Component {

  openCreditNote() {
    window.open(`/returns/moneyreturn/${this.props.document.sale_consecutive}`, '_blank')
  }
  retryInvoice() {
    const docList = []
    docList.push(this.props.document.id)
    const data = {
      docs_list: docList
    }
    axios({
      method: 'post',
      url: '/api/docactionrequired/reset_human_required/',
      data: data
    }).then((response) => {
      alertify.alert('COMPLETADO', 'Elemento Reintentando...')
    }).catch((err) => {
      alertify.alert('ERROR', `Error al reintentar el documento ${err}`)
    })
  }

  resendMail(id, mails) {
    const noSpacesMails = mails.replace(/\s/g, '')
    const extraMails = noSpacesMails.split(',')
    const data = {
      extra_emails: extraMails,
      doc_consecutive: id
    }
    axios({
      method: 'post',
      url: `/api/facturareception/resendemails/`,
      data: data
    }).then((response) => {
      alertify.alert('COMPLETADO', 'Correos en proceso de reenvío.')
    }).catch((err) => {
      alertify.alert('ERROR', `Error al procesasar el reenvío ${err}`)
    })
  }

  resendMailPrompt() {
    const id = this.props.document.consecutive_numbering
    const _this = this
    alertify.prompt('CORREOS ADICIONALES', `El correo se reenviará a los receptores originales, si hay otros receptores
      digite la lista de correos adicionales a enviar, separados por comas (,)`, '',
    function(evt, value) { _this.resendMail(id, value) },
    function(evt, value) { })
  }

  // Main Layout
  render() {

    const status = getElementStatus(this.props.document)

    const retryButton = status.className == 'processing'
      ? <button className='btn btn-retry' onClick={this.retryInvoice.bind(this)}>Reintentar</button>
      : <div />
    const resendButton = status.className == 'rejected' || status.className == 'accepted'
      ? <button className='btn btn-resend' onClick={this.resendMailPrompt.bind(this)}>Reenviar Correo</button>
      : <div />

    const creditNoteButton = status.className == 'rejected' || status.className == 'accepted'
      ? <button className='btn btn-creditnote' onClick={this.openCreditNote.bind(this)}>Nota de Crédito</button>
      : <div />

    return <div className='documentDetail-actions'>

      <div className='admin-invoicing-detail-header'>
        ACCIONES
      </div>
      <div className='documentDetail-actions-body'>
        {resendButton}
        {retryButton}
        {creditNoteButton}
      </div>
    </div>

  }

}
