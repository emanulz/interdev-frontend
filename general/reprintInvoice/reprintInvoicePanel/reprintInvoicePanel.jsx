import React from 'react'
import { connect } from 'react-redux'
import FullInvoice from '../fullInvoice/fullInvoice.jsx'
import CompactInvoice from '../compactInvoice/compactInvoice.jsx'
import SimpleCompactInvoice from '../simpleCompactInvoice/simpleCompactInvoice.jsx'
import alertify from 'alertifyjs'
import axios from 'axios'

@connect((store) => {
  return {
    panelVisible: store.reprintInvoice.isVisible,
    isFull: store.reprintInvoice.isFull,
    sale: store.reprintInvoice.sale,
    config: store.config.globalConf,
    receiptStyles: store.config.receiptStyles
  }
})
export default class ReprintInvoicePanel extends React.Component {

  componentWillReceiveProps(nextProps) {
    if (this.props.config != nextProps.config) {
      this.props.dispatch({ type: 'SET_REPRINT_INVOICE_PANEL_FULL', payload: nextProps.config.defaultInvoiceFull })
    }
  }

  hidePanel() {

    this.props.dispatch({ type: 'HIDE_REPRINT_INVOICE_PANEL', payload: -1 })
    // printDiv('full-invoice-print')
  }

  togglePanel() {

    this.props.dispatch({ type: 'TOGGLE_REPRINT_INVOICE_PANEL_FULL', payload: -1 })

  }

  printPanel() {
    window.printDiv('reprint-invoice-print', ['/static/fixedBundles/css/sales.css'])
  }

  calcTotalInPay() {
    const pay = this.props.sale.pay
    let total = 0
    for (const item in pay) {
      let innerAmount = 0
      for (const innerItem in pay[item]) {
        innerAmount += pay[item][innerItem].amount
      }
      total += innerAmount
    }
    return total
  }

  getZpl() {
    document.getElementById('link').click()
  }

  regenerateInvoiceConfirm() {
    // ALERTIFY CONFIRM
    const _this = this
    alertify.confirm('Re-Facturar', `Desea crear una copia de la venta seleccionada?`, function() {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      _this.regenerateInvoice()
    }, function() {
      return true
    }).set('labels', {
      ok: 'Si',
      cancel: 'No'
    })
  }

  regenerateInvoice() {
    const sale = this.props.sale
    const _this = this
    const reinvoicePromise = new Promise((resolve, reject) => {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      axios({
        method: 'post',
        url: '/api/presales/createFromSale/',
        data: {'sale_id': sale.id}
      })
        .then((response) => {
          resolve(response.data)
        }).catch((err) => {
          reject(err)
        })
    })

    reinvoicePromise.then(() => {
      _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      _this.props.dispatch({ type: 'HIDE_REPRINT_INVOICE_PANEL', payload: -1 })
      alertify.alert('COMPLETADO', `Se ha creado una copia de la venta seleccionada, dirígase a la aplicación de caja para facturarla`)
    }).catch((err) => {
      console.log(err.response.data)
      if (err.response) {
        console.log(err.response.data)
        alertify.alert('Error', `Error al crear la copia de la factura, ERROR: ${err.response.data.friendly_errors}, ERROR DE SISTEMA: ${err.response.data.system_errors}`)
      } else {
        console.log('NO CUSTOM ERROR')
        console.log(err)
        alertify.alert('Error', `Error al crear la copia de la factura, ERROR: ${err}.`)
      }
      _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
    })
  }

  render() {

    const isVisible = (this.props.panelVisible)
      ? 'reprint-invoice-panel is-visible'
      : 'reprint-invoice-panel'
    const isFullClass = (this.props.isFull)
      ? ''
      : ' compact-invoice-on'

    const compactInvoice = this.props.receiptStyles.useSimpleCompactInvoice ? <SimpleCompactInvoice /> : <CompactInvoice />

    const componentToMount = (this.props.isFull)
      ? <FullInvoice />
      : compactInvoice

    let change = ''
    try {
      const total = parseFloat(this.props.sale.cart.cartTotal)
      const totalInPay = this.calcTotalInPay()
      change = totalInPay - total
    } catch (err) {
      //console.log(err)
    }

    let zpl_button = ''
    let zpl_link = ''
    if (this.props.config) {
      if (this.props.config.EnableZplDownloads) {
        if (this.props.sale) {
          zpl_link = <a id='link' href={`/api/saleslist/get_zpl/?sale_consec=${this.props.sale.consecutive}`} />
          zpl_button = <i onClick={this.getZpl.bind(this)} className='fa fa-download' aria-hidden='true' />
        }
      }
      zpl_link = <a id='link' href={`/api/saleslist/get_zpl/?sale_consec=${this.props.sale.consecutive}`} />
    }

    const reInvoiceBtn = this.props.reinvoiceEnable
      ? <div className='reprint-invoice-panel-main-reinvoice' onClick={this.regenerateInvoiceConfirm.bind(this)}>
        <span>RE-FACTURAR</span>
      </div>
      : <div />

    return <div className={isVisible}>

      <div className={'reprint-invoice-panel-main' + isFullClass}>
        <div className='reprint-invoice-panel-header'>
          <div>
            Factura de Venta
          </div>
          <div>
            <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
            <i onClick={this.togglePanel.bind(this)} className='fa fa-file-text-o' aria-hidden='true' />
            <i onClick={this.printPanel.bind(this)} className='fa fa-print' aria-hidden='true' />
            {/* <i onClick={this.toggleInvoice.bind(this)} className='fa fa-coffee' aria-hidden='true' /> */}
            {zpl_button}
            {zpl_link}
          </div>
        </div>

        <div id='reprint-invoice-print' className={'reprint-invoice-panel-container' + isFullClass}>

          {componentToMount}

        </div>

      </div>
      <div className='reprint-invoice-panel-main-change'>
        <span>CAMBIO</span>
        <h1>₡ {parseFloat(change).formatMoney(2, ',', '.')}</h1>
      </div>
      {reInvoiceBtn}

    </div>

  }

}
