import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    presale: store.printPresale.presale,
    company: store.printPresale.company
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

    const headertext = wasReserve ? 'Recibo' : wasQuoting ? 'Factura Proforma' : 'Recibo de Preventa'

    // BILL DATA
    const headerName = this.props.company.comercial_name || ''

    const headerName2 = this.props.company.legal_name || ''

    const tels = this.props.company.telephones || ''
    const telsText = tels.split('/').length > 1 ? `Tels: ${tels}` : `Tel: ${tels}`

    return <div>

      <div className='print-compact-presale-header'>

        <div className='print-compact-presale-header-info'>
          <h2>{headerName}</h2>
          <h3>{headerName2}</h3>
          <h3>{this.props.company.address1 || ''}</h3>
          <h3>{this.props.company.address2 || ''}</h3>
          <h3>{this.props.company.country || ''}</h3>
          <h3>{telsText}</h3>
        </div>

      </div>

      <div className='print-compact-presale-separator'>
        <span />

        <h1>{headertext}</h1>

        <span />
      </div>
    </div>

  }

}
