import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    request: store.printRequest.request
  }
})
export default class Notes extends React.Component {

  render() {

    const request = this.props.request
    let extras = {
      notes: '',
      client: {
        last_name: 'General',
        name: 'Cliente',
        email: ''
      }
    }
    try {
      extras = request.extras ? JSON.parse(request.extras) : extras
    } catch (err) { console.log('EXTRAS ERROR PARSE', err) }
    const notes = extras.notes

    return <div className='reprint-full-request-notes'>
      <h1>Notas:</h1>
      <div className='print-full-request-notes-content'>
        <div>{notes}</div>
      </div>

    </div>

  }

}
