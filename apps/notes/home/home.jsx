
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
    console.log("Home will mount")
    this.props.dispatch({type: 'HOME_PANEL_MOUNTED'})

  }
  // *******************************************************************

  // Main Layout
  render() {
    console.log("Rendering home notes")
    return <div className='Main heigh100'>
      INICIO APLICACIÓN NOTAS
    </div>

  }

}