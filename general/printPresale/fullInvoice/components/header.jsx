import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    presale: store.printPresale.presale,
    userProfile: store.userProfile
  }
})
export default class Header extends React.Component {

  render() {
    let wasReserve = false
    try {
      wasReserve = this.props.presale.presale_type == 'RESERVE'
    } catch (err) {}
    let wasQuoting = false
    try {
      wasQuoting = this.props.presale.presale_type == 'QUOTING'
    } catch (err) {}

    let wasRestaurant = false
    try {
      wasRestaurant = this.props.presale.presale_type == 'RESTAURANT'
    } catch (err) {}

    const headertext = wasReserve ? 'Recibo' : wasQuoting ? 'Factura Proforma' : wasRestaurant ? 'Cuenta de restaurante' : 'Recibo de Preventa'

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

    const email = local && local.email ? local.email : ''
    const emailTag = email ? <h3>{email}</h3> : ''

    // LOGO
    const logo = local && local.logo_name ? local.logo_name : 'logoInterdev.png'
    const logoWidth = local && local.logo_width ? local.logo_width : '130px'
    const logoUrl = `/media/logos/${logo}`

    return <div>

      <div className='reprint-full-presale-header'>

        <div className='reprint-full-presale-header-logo'>
          <img style={{'width': `${logoWidth}`}} src={logoUrl} />
        </div>
        <div className='reprint-full-presale-header-info'>
          <h2>{headerName.toUpperCase()}</h2>
          <h3>{headerName2}</h3>
          <h3>{address1}</h3>
          <h3>{address2}</h3>
          <h3>Costa Rica</h3>
          <h3>{telsText}</h3>
          {emailTag}
        </div>

      </div>

      <div className='reprint-full-presale-separator'>
        <span />

        <h1>{headertext}</h1>
        <span />
      </div>
    </div>

  }

}
