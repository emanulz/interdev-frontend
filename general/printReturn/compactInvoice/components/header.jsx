import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    returnObject: store.printReturn.return_object,
    userProfile: store.userProfile
  }
})
export default class Header extends React.Component {

  render() {

    const headertext = 'N. de Crédito a factura'

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

    return <div>

      <div className='print-return-compact-invoice-header'>

        <div className='print-return-compact-invoice-header-info'>
          <h2>{headerName.toUpperCase()}</h2>
          <h3>{headerName2}</h3>
          <h3>{address1}</h3>
          <h3>{address2}</h3>
          <h3>Costa Rica</h3>
          <h3>{telsText}</h3>
          {emailTag}
        </div>

      </div>

      <div className='print-return-compact-invoice-separator'>
        <span />

        <h1>{headertext}</h1>

        <span />
      </div>
    </div>

  }

}
