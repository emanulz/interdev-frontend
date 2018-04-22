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

    // const childProducts = [
    //   {
    //     text: 'Productos',
    //     class: 'fa-gift',
    //     href: '/admin/products'
    //   }, {
    //     text: 'Familias',
    //     class: 'fa-list',
    //     href: '/admin/productdepartments'
    //   }, {
    //     text: 'Sub-Familias',
    //     class: 'fa-outdent',
    //     href: '/admin/productsubdepartments'
    //   }
    // ]

    // const title = this.props.userCompanyConfig.comercialName || this.props.defaultCompanyConfig.comercialName || 'APP'
    const sideMenuClass = this.props.sideMenuVisible ? 'sideMenu' : 'sideMenu hiddenByApp'
    return <div id='sideMenu' className={sideMenuClass}>

      {/* <h3 className='sideMenu-header'>{title.toUpperCase()}</h3> */}
      <User />

      <Search />

      <div className='sideMenu-wrapper col-xs-12'>
        <ul className='sideMenu-items'>
          <li>
            <Link to='/sales'>
              <span className='fa fa-area-chart' />
              Inicio</Link>
          </li>
          <li>
            <Link to='/sales/sale'>
              <span className='fa fa-area-chart' />
              Nueva Venta</Link>
          </li>
          <li>
            <Link to='/sales/proforma'>
              <span className='fa fa-user' />
              Nueva Cotización</Link>
          </li>
          <li>
            <Link to='/sales/presale'>
              <span className='fa fa-user' />
              Nueva Preventa</Link>
          </li>

        </ul>
      </div>

    </div>

  }

}
