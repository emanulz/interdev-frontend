import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    presale: store.printPresale.presale
  }
})
export default class Notes extends React.Component {

  render() {
    const presale = this.props.presale
    let extras = {
      notes: '',
      client: {
        last_name: 'General',
        name: 'Cliente',
        email: ''
      }
    }
    try {
      extras = presale.extras ? JSON.parse(presale.extras) : extras
    } catch (err) { console.log('EXTRAS ERROR PARSE', err) }
    const notes = extras.notes

    return <div className='print-compact-presale-notes'>
      <h1>Notas:</h1>
      <div className='print-compact-presale-notes-content'>
        <div>{notes}</div>
      </div>

    </div>

  }

}
