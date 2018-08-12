import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    company: store.printCashAdvance.company
  }
})
export default class Header extends React.Component {

  render() {

    const headertext = 'Adelanto de Dinero'

    // BILL DATA
    const headerName = this.props.company.comercial_name || ''

    const headerName2 = this.props.company.legal_name || ''

    const tels = this.props.company.telephones || ''
    const telsText = tels.split('/').length > 1 ? `Tels: ${tels}` : `Tel: ${tels}`

    return <div>

      <div className='cash-advance-compact-invoice-header'>

        <div className='cash-advance-compact-invoice-header-info'>
          <h2>{headerName}</h2>
          <h3>{headerName2}</h3>
          <h3>{this.props.company.address1 || ''}</h3>
          <h3>{this.props.company.address2 || ''}</h3>
          <h3>{this.props.company.country || ''}</h3>
          <h3>{telsText}</h3>
        </div>

      </div>

      <div className='cash-advance-compact-invoice-separator'>
        <span />

        <h1>{headertext}</h1>

        <span />
      </div>
    </div>

  }

}
