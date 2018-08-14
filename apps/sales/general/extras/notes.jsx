/*
 * Module dependencies
 */
import React from 'react'

import {connect} from 'react-redux'
@connect((store) => {
  return {
    extraNotes: store.extras.notes
  }
})
export default class Notes extends React.Component {

  handleInputChange(event) {

    const target = event.target
    const value = target.value

    this.props.dispatch({type: 'SET_EXTRAS_NOTES', payload: value})
  }

  // Main Layout
  render() {

    return <div className='notes'>

      <div className='notes-content'>
        <h3>Notas :</h3>
        <textarea value={this.props.extraNotes} name='observations'
          style={{resize: 'none'}}
          rows='3'
          onChange={this.handleInputChange.bind(this)}
          className='form-control' />
      </div>

    </div>

  }

}
