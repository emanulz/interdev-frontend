import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {payment: store.payments.paymentActive}
})
export default class Data extends React.Component {

  render() {

    const payment = this.props.payment
    const dateObj = payment.created ? new Date(payment.created) : ''
    const date = payment.created
      ? `${('0' + dateObj.getDate()).slice(-2)}/
      ${('0' + (dateObj.getMonth() + 1)).slice(-2)}/
      ${dateObj.getFullYear()}`
      : '01/01/1970'

    const client = payment.client ? `${payment.client.code} - ${payment.client.name} ${payment.client.last_name}` : '00 - Cliente de Contado'
    const id = payment.consecutive ? payment.consecutive : '00001'

    return <div className='full-invoice-data'>

      <table className='client-table'>
        <thead>
          <tr>
            <th>CLIENTE:</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{client}</td>
          </tr>
        </tbody>

      </table>
      <table className='datenum-table'>

        <tbody>
          <tr>
            <th>N. de Pago:</th>
            <td>{('0000000' + id).slice(-7)}</td>

          </tr>
          <tr>
            <th>Fecha:</th>
            <td>{date}</td>
          </tr>
        </tbody>

      </table>

    </div>

  }

}
