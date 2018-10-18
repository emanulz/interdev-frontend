/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {generalSave} from '../../../../utils/api.js'

@connect((store) => {
  return {
    disabled: store.completed.completed,
    globalConf: store.config.globalConf,
    cart: store.cart,
    sale_consecutive: store.notes.saleConsecutive,
  }
})
export default class Buttons extends React.Component {

  showPayPanel() {
    this.props.dispatch({type: 'SHOW_PAY_PANEL'})
  }

  showInoicePanel() {
    this.props.dispatch({type: 'SHOW_INVOICE_PANEL'})
  }
  showSalePanel() {
    this.props.dispatch({type: 'SHOW_SALES_PANEL'})
  }

  registerNote(){
    console.log("Register Note")

    const kwargs = {
      url: '/api/additions/makeAddition/',
      method: 'post',
      successType: 'NOTE_APPLIED',
      errorType: 'NOTE_REJECTED',
      sucessMessage: 'Nota aplicada',
      errorMessage: 'Nota rechazada',
      data: {
        sale_consecutive: this.props.sale_consecutive,
        cart: JSON.stringify(this.props.cart)
      }
    }
    this.props.dispatch(generalSave(kwargs))


  }


  // Main Layout
  render() {

    const buttons = this.props.disabled
      ? <div>
        <button
          onClick={this.newSale.bind(this)}
          style={{
            'height': '48px',
            'width': '49%',
            'marginTop': '10px'
          }}
          className='btn btn-default buttons-payButton'>
          Nueva Pre-Venta
          <span>
            <i className='fa fa-refresh' />
          </span>
        </button>
      </div>
      : ''

    return <div className='col-xs-12 buttons'>

      <button
        disabled={this.props.disabled}
        onClick={this.registerNote.bind(this)}
        style={{
          'height': '48px',
          'width': '49%',
          'marginTop': '10px'
        }}
        className='btn btn-default buttons-payButton'>
        Registrar Nota
        <span>
          <i className='fa fa-credit-card-alt' />
        </span>
      </button>

      {/*buttons*/}

  
    </div>

  }

}
