import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    order: store.printOrder.order,
    userProfile: store.userProfile
  }
})
export default class Header extends React.Component {

  render() {

    const headerStyles = {
      textAlign: 'center',
      fontFamily: 'Lato',
      fontSize: '15px',
      fontWeight: 'bold',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between'
    }

    const headerInfoStyles = {
      'flex-grow': 1,
      'text-align': 'right'
    }

    const headerInfoH2Styles = {
      fontSize: '14px',
      margin: '0 0 5px 0',
      fontWeight: 'bold'
    }

    const headerInfoH3Styles = {
      fontSize: '11px',
      margin: '0 0 2px 0',
      fontWeight: 'normal'
    }

    const headerSeparatorStyles = {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: '50px',
      lineHeight: '40px',
      textTransform: 'uppercase'
    }

    const headerSeparatorSpanStyles = {
      flexGrow: '1',
      marginTop: '25px',
      height: '1px',
      borderTop: '1px solid #ccc',
      verticalAlign: 'middle'
    }

    const headerSeparatorH1Styles = {
      fontSize: '18px',
      margin: '0 15px',
      lineHeight: '50px'
    }

    const headertext = 'Orden de Compra'

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
    const emailTag = email ? <h3 style={headerInfoH3Styles}>{email}</h3> : ''

    // LOGO
    const logo = local && local.logo_name ? local.logo_name : 'logoInterdev.png'
    const logoWidth = local && local.logo_width ? local.logo_width : '130px'
    const logoUrl = `/media/logos/${logo}`

    return <div>

      <div style={headerStyles}>

        <div>
          <img style={{'width': `${logoWidth}`}} src={logoUrl} />
        </div>
        <div style={headerInfoStyles}>
          <h2 style={headerInfoH2Styles}>{headerName.toUpperCase()}</h2>
          <h3 style={headerInfoH3Styles}>{headerName2}</h3>
          <h3 style={headerInfoH3Styles}>{address1}</h3>
          <h3 style={headerInfoH3Styles}>{address2}</h3>
          <h3 style={headerInfoH3Styles}>Costa Rica</h3>
          <h3 style={headerInfoH3Styles}>{telsText}</h3>
          {emailTag}
        </div>

      </div>

      <div style={headerSeparatorStyles}>
        <span style={headerSeparatorSpanStyles} />
        <h1 style={headerSeparatorH1Styles}>{headertext}</h1>
        <span style={headerSeparatorSpanStyles} />
      </div>
    </div>

  }

}
