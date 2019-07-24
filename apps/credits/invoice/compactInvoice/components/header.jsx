import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    userProfile: store.userProfile,
    payment: store.payments.paymentActive
  }
})
export default class Header extends React.Component {

  render() {

    // BILL DATA
    const profile = this.props.userProfile.profile
    const tpLocals = this.props.userProfile.tp_locals
    const taxPayer = this.props.userProfile.taxPayer
    const activeLocal = profile.active_local_id

    let local = false
    try {
      local = tpLocals.find(local => {
        return local.id == activeLocal
      })
    } catch (err) { console.log('LOCAL ERR', err) }
    // COMERCIAL NAME
    const headerName = local && local.name ? local.name : 'NOMBRE DEL LOCAL NO CONFIGURADO'

    const headerName2 = taxPayer && taxPayer.legal_name ? taxPayer.legal_name : 'CONTRIBUYENTE NO CONFIGURADO'

    const tels = local && local.phone_number ? local.phone_number : 'TELEFONO NO CONFIGURADO'
    const telsText = tels.split('/').length > 1 ? `Tels: ${tels}` : `Tel: ${tels}`

    const address1 = local && local.long_address ? local.long_address : 'DIRECCION 1 NO CONFIGURADA'
    const address2 = local && local.receipt_address ? local.receipt_address : 'DIRECCION 2 NO CONFIGURADA'

    const isNull = this.props.payment ? this.props.payment.is_null : false

    const headerText = isNull ? 'PAGO ANULADO' : 'RECIBO POR PAGO A FACTURAS'

    // STYLES
    const fontFamily = 'Arial'
    const fontSize = '16px'
    const fontSize2 = '14px'

    const headerStyles = {
      textAlign: 'center',
      fontFamily: fontFamily,
      fontSize: fontSize,
      fontWeight: 'bold'
    }
    const separatorStyles = {
      display: 'flex',
      flexFlow: 'row',
      justifyContent: 'space-between',
      height: '40px',
      lineHeight: '40px',
      textTransform: 'uppercase'
    }

    const h1Styles = {
      fontFamily: fontFamily,
      fontSize: fontSize,
      margin: '0 0 2px 0',
      fontWeight: 'bold'
    }

    const h2Styles = {
      fontFamily: fontFamily,
      fontSize: fontSize,
      margin: '0 0 2px 0',
      fontWeight: 'bold'
    }

    const h3Styles = {
      fontFamily: fontFamily,
      fontSize: fontSize2,
      margin: '0 0 2px 0',
      fontWeight: 'bold'
    }

    const spanStyles = {
      flexGrow: 1,
      marginTop: '20px',
      height: '1px',
      borderTop: '1px solid black',
      verticalAlign: 'middle'
    }

    const email = local && local.email ? local.email : ''
    const emailTag = email ? <h3 style={h3Styles}>{email}</h3> : ''

    return <div style={headerStyles}>

      <div>

        <div>
          <h2 style={h2Styles}>{headerName.toUpperCase()}</h2>
          <h3 style={h3Styles}>{headerName2}</h3>
          <h3 style={h3Styles}>{address1}</h3>
          <h3 style={h3Styles}>{address2}</h3>
          <h3 style={h3Styles}>Costa Rica</h3>
          <h3 style={h3Styles}>{telsText}</h3>
          {emailTag}
        </div>

      </div>

      <div style={separatorStyles}>
        <span style={spanStyles} />

        <h1 style={h1Styles}>{headerText}</h1>

        <span style={spanStyles} />
      </div>
    </div>

  }

}
