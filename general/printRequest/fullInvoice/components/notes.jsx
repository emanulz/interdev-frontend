import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    order: store.printOrder.order
  }
})
export default class Notes extends React.Component {

  render() {

    const order = this.props.order
    let extras = {
      notes: '',
      client: {
        last_name: 'General',
        name: 'Cliente',
        email: ''
      }
    }
    try {
      extras = order.extras ? JSON.parse(order.extras) : extras
    } catch (err) { console.log('EXTRAS ERROR PARSE', err) }
    const notes = extras.notes

    return <div className='reprint-full-order-notes'>
      <h1>Notas:</h1>
      <div className='print-full-order-notes-content'>
        <div>{notes}</div>
      </div>

    </div>

  }

}
