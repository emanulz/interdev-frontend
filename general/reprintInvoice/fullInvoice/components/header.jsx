import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    sale: store.reprintInvoice.sale,
    userProfile: store.userProfile,
    conf: store.config.globalConf
  }
})
export default class Header extends React.Component {

  render() {
    // Credit or cash
    let wasCredit = false
    try {
      wasCredit = this.props.sale.pay.cred[0].amount
    } catch (err) {}
    let headertext = wasCredit ? 'Factura de crédito' : 'Factura de contado'
    headertext = this.props.conf.printFacturaElectronicaInFullInvoice ? 'Factura Electrónica' : headertext
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

    // LOGO
    const logo = local && local.logo_name ? local.logo_name : 'logoInterdev.png'
    const logoWidth = local && local.logo_width ? local.logo_width : '130px'
    const logoUrl = `/media/logos/${logo}`

    const slogan = this.props.conf.tempSlogan ? <span>{this.props.conf.tempSlogan}</span> : ''
    
    return <div>

      <div className='reprint-full-invoice-header'>

        <div className='reprint-full-invoice-header-logo'>
          <img style={{'width': `${logoWidth}`}} src={logoUrl} />
          {slogan}
        </div>
        <div className='reprint-full-invoice-header-info'>
          <h2>{headerName.toUpperCase()}</h2>
          <h3>{headerName2}</h3>
          <h3>{idText}</h3>
          <h3>{address1}</h3>
          <h3>{address2}</h3>
          <h3>Costa Rica</h3>
          <h3>{telsText}</h3>
          {emailTag}
        </div>

      </div>

      <div className='reprint-full-invoice-separator'>
        <span />

        <h1>{headertext}</h1>
        <span />
      </div>
    </div>

  }

}
