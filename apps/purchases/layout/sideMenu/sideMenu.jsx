/*
 * Module dependencies
 */
import React from 'react'
import Search from './components/search/search.jsx'
import User from './components/user/user.jsx'
// import ComposedItem from './components/items/composed.jsx'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    sideMenuVisible: store.layout.sideMenuVisible
  }
})
export default class SideMenu extends React.Component {

  componentDidMount() {
    document.getElementById('loader').classList.remove('loader')
  }

  // Main Layout
  render() {


    // const title = this.props.userCompanyConfig.comercialName || this.props.defaultCompanyConfig.comercialName || 'APP'
    const sideMenuClass = this.props.sideMenuVisible ? 'sideMenu' : 'sideMenu hiddenByApp'
    return <div id='sideMenu' className={sideMenuClass}>

      {/* <h3 className='sideMenu-header'>{title.toUpperCase()}</h3> */}
      <User />

      <Search />

      <div className='sideMenu-wrapper col-xs-12'>
        <ul className='sideMenu-items'>
          <li>
            <Link to='/purchases'>
              <span className='fa fa-area-chart' />
              Inicio</Link>
          </li>
          <li>
            <Link to='/purchases/add'>
              <span className='fa fa-file' />
              Ingresar Factura</Link>
          </li>
          <li>
            <Link to='/purchases/list'>
              <span className='fa fa-list-alt' />
              Listado Facturas</Link>
          </li>
        </ul>
      </div>

    </div>

  }

}
