import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    sale: store.sales.saleActive,
    company: store.config.company
  }
})
export default class Header extends React.Component {

  render() {

    const headertext = this.props.sale.pay.payMethod == 'CREDIT' ? 'Factura de crédito' : 'Factura de contado'

    // BILL DATA
    const headerName = this.props.company.comercialName || ''

    const headerName2 = this.props.company.legalName || ''

    const tels = this.props.company.telephones || ''
    const telsText = tels.split('/').length > 1 ? `Tels: ${tels}` : `Tel: ${tels}`

    const idType = this.props.company.idType || ''
    const id = this.props.company.id || 'PERSON'
    const idText = idType == 'JURIDI' ? `Céd Jurid No ${id}` : `Céd No ${id}`

    return <div>

      <div className='compact-invoice-header'>

        <div className='compact-invoice-header-info'>
          <h2>{headerName}</h2>
          <h3>{headerName2}</h3>
          <h3>{idText}</h3>
          <h3>{this.props.company.address1 || ''}</h3>
          <h3>{this.props.company.address2 || ''}</h3>
          <h3>{this.props.company.country || ''}</h3>
          <h3>{telsText}</h3>
        </div>

      </div>

      <div className='compact-invoice-separator'>
        <span />

        <h1>{headertext}</h1>

        <span />
      </div>
    </div>

  }

}
