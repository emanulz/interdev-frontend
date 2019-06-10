/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    user: store.user.user
  }
})
export default class Fetching extends React.Component {

  onClickDiv() {
    const isStaff = this.props.user ? this.props.user.is_staff : false
    if (isStaff) {
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
    }
  }

  // Main Layout
  render() {
    return <div className='fetcing-container' onClick={this.onClickDiv.bind(this)}>
      <img src={'/static/vendor/loaders/Eclipse.gif'} />
      <h1>Cargando elementos</h1>
    </div>

  }

}
