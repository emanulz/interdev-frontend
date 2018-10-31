import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    sale: store.reprintInvoice.sale,
    userProfile: store.userProfile,
    receiptStyles: store.config.receiptStyles
  }
})
export default class Header extends React.Component {

  render() {
    let wasCredit = false
    try {
      wasCredit = this.props.sale.pay.cred[0].amount
    } catch (err) {}
    const headertext = wasCredit ? 'Factura de crédito' : 'Factura de contado'

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

    const idType = taxPayer ? taxPayer.id_type : '01'
    const id = taxPayer && taxPayer.id_number ? taxPayer.id_number : 'IDENTIFICACION NO CONFIGURADA'
    const idText = idType == '02' ? `Céd Jurid No ${id}` : `Céd No ${id}`

    const address1 = local && local.long_address ? local.long_address : 'DIRECCION 1 NO CONFIGURADA'
    const address2 = local && local.receipt_address ? local.receipt_address : 'DIRECCION 2 NO CONFIGURADA'

    const email = local && local.email ? local.email : ''
    const emailTag = email ? <h3>{email}</h3> : ''

    const fontFamily = this.props.receiptStyles.simpleCompactInvoiceFont ? this.props.receiptStyles.simpleCompactInvoiceFont : 'Arial'
    const fontSize = this.props.receiptStyles.simpleCompactInvoiceFontSize ? this.props.receiptStyles.simpleCompactInvoiceFontSize : '10px'

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
      height: '30px',
      lineHeight: '30px',
      textTransform: 'uppercase'
    }

    const h1Styles = {
      fontFamily: fontFamily,
      fontSize: fontSize,
      margin: '0 5px',
      lineHeight: '30px',
      fontWeight: 'bold'
    }

    const spanStyles = {
      flexGrow: 1,
      marginTop: '13px',
      height: '1px',
      borderTop: '1px solid black',
      verticalAlign: 'middle'
    }
    return <div style={headerStyles}>
      <div>
        <div>
          <h2>{headerName.toUpperCase()}</h2>
          <h3>{headerName2}</h3>
          <h3>{idText}</h3>
          <h3>{address1}</h3>
          <h3>{address2}</h3>
          <h3>{telsText}</h3>
          {emailTag}
        </div>

      </div>

      <div style={separatorStyles}>
        <span style={spanStyles} />
        <h1 style={h1Styles}>{headertext}</h1>
        <span style={spanStyles} />
      </div>
    </div>

  }

}
