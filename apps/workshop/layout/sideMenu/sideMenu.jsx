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
            <Link to='/workshop'>
              <span className='fa fa-area-chart' />
              Inicio</Link>
          </li>
          <li>
            <Link to='/workshop/workorder/add'>
              <span className='fa fa-wrench' />
              Nueva Orden de Trabajo</Link>
          </li>
          <li>
            <Link to='/workshop/workorder/list'>
              <span className='fa fa-list-alt' />
              Órdenes de trabajo</Link>
          </li>
          <li>
            <Link to='/workshop/workorder/listinternal'>
              <span className='fa fa-list-alt' />
              Garantías Internas</Link>
          </li>
          <li>
            <Link to='/workshop/workorder/listbd'>
              <span className='fa fa-list-alt' />
              {'Garantías Black&Decker'}</Link>
          </li>
          <li>
            <Link to='/workshop/workorder/listnr'>
              <span className='fa fa-list-alt' />
              Cerradas Sin Reparación</Link>
          </li>
        </ul>
      </div>

    </div>

  }

}
