
import React from 'react'
// import { checkUserPermissions } from '../../utils/checkPermissions'
// import { getItemDispatch } from '../../utils/api.js'
import {connect} from 'react-redux'

@connect((store) => {
  return {
  }
})
export default class Home extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'HOME_PANEL_MOUNTED', payload: ''})

  }
  // *******************************************************************

  // Main Layout
  render() {
    console.log("Rendering home notes")
    return <div className='Main heigh100'>
      <h1>INICIO APLICACIÓN NOTAS </h1>
    </div>

  }

}