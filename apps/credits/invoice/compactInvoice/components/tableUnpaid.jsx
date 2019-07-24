import React from 'react'
import {connect} from 'react-redux'
import {formatDate, formatDateTimeAmPm} from '../../../../../utils/formatDate.js'

@connect((store) => {
  return {
    payment: store.payments.paymentActive,
    client: store.clients.clientActive,
    clientActiveSalesWithDebt: store.unpaidSales.clientActiveSalesWithDebt
  }
})
export default class Table extends React.Component {

  getPendingItem(item, tableBodyTrStyles, tableBodyTdStyles) {

    const date = formatDate(item.created)
    return <tr style={tableBodyTrStyles} key={`${item.consecutive}_${item.type}`}>
      <td style={tableBodyTdStyles}>{item.consecutive}</td>
      <td style={tableBodyTdStyles}>{date}</td>
      {/* <td>₡ {sale.debits ? sale.debits.formatMoney(2, ',', '.') : 0}</td> */}
      <td style={tableBodyTdStyles}>₡ {item.balance ? parseFloat(item.balance).formatMoney(2, ',', '.') : 0}</td>
    </tr>

  }
  // Main Layout
  render() {

    const fontFamily = 'Arial'
    const fontSize = '14px'

    const tableStyles = {
      fontFamily: fontFamily,
      fontSize: fontSize,
      fontWeight: 'bold',
      border: 'none',
      width: '100%',
      marginTop: '10px'
    }

    const tableHeadThStyles = {
      padding: '5px 0'

    }

    const tableBodyTdStyles = {
      padding: '10px 0'
    }

    const tableBodyTrStyles = {
      borderTop: '1px solid black'
    }

    const h1Styles = {
      fontFamily: fontFamily,
      fontSize: fontSize,
      fontWeight: 'bold',
      paddingTop: '5px'
    }

    const separatorStyles = {
      display: 'flex',
      flexFlow: 'row',
      justifyContent: 'space-between',
      height: '40px',
      lineHeight: '40px',
      marginTop: '30px',
      textTransform: 'uppercase'
    }

    const spanStyles = {
      flexGrow: 1,
      marginTop: '20px',
      height: '1px',
      borderTop: '1px solid black',
      verticalAlign: 'middle'
    }

    const h1SeparatorStyles = {
      fontFamily: fontFamily,
      fontSize: fontSize,
      margin: '0 0 2px 0',
      fontWeight: 'bold'
    }

    const sales = this.props.clientActiveSalesWithDebt

    const rows = sales.length
      ? sales.map(sale => {
        return this.getPendingItem(sale, tableBodyTrStyles, tableBodyTdStyles)
      })
      : <tr>
        <td>NO HAY PENDIENTES</td>
      </tr>
    const date = formatDateTimeAmPm(new Date())
    return <div>
      <div style={separatorStyles}>
        <span style={spanStyles} />

        <h1 style={h1SeparatorStyles}>Estado de Cuenta</h1>

        <span style={spanStyles} />
      </div>
      <h1 style={h1Styles}>Facturas pendientes a la fecha:</h1>
      <h1 style={h1Styles}>{date}</h1>
      <table style={tableStyles}>
        <thead>
          <tr>
            <th style={tableHeadThStyles}>Factura #</th>
            <th style={tableHeadThStyles}>Fecha</th>
            <th style={tableHeadThStyles}>Deuda</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>

      <div style={separatorStyles}>
        <span style={spanStyles} />

        <h1 style={h1SeparatorStyles}>Final del recibo</h1>

        <span style={spanStyles} />
      </div>
    </div>

  }

}
