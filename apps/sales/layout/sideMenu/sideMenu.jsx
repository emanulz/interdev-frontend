/*
 * Module dependencies
 */
import React from 'react'
import alertify from 'alertifyjs'
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

  clearSalesChache() {
    // ALERTIFY CONFIRM
    alertify.confirm('LIMPIAR CONFIGURACIONES', `¿Desea limpiar las configuraciones almacenadas en caché y recargar la página? Esto debe hacerse 
    solo en caso de comportamiento irregular del sistema o por recomendación de los administradores.`,
    function() {
      localStorage.clear()
      location.reload()
    }, function() {
      return true
    }).set('labels', {
      ok: 'LIMPIAR',
      cancel: 'CANCELAR'
    })
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
              <span className='fa fa-money' />
              Caja</Link>
          </li>
          {/* <li>
            <Link to='/sales/sale'>
              <span className='fa fa-area-chart' />
              Nueva Venta</Link>
          </li> */}
          <li>
            <Link to='/sales/cashier'>
              <span className='fa fa-print' />
              Abrir/Cerrar Caja</Link>
          </li>
          <li>
            <Link to='/sales/singlemovements'>
              <span className='fa fa-exchange' />
              Entradas/Salidas Manuales</Link>
          </li>
          <li>
            <Link to='/sales/movements'>
              <span className='fa fa-list-ol' />
              Movimientos</Link>
          </li>
          <li onClick={this.clearSalesChache.bind(this)}>
            <a>
              <span className='fa fa-refresh' />
              Limpiar Caché De La Caja
            </a>
          </li>

        </ul>
      </div>

    </div>

  }

}
