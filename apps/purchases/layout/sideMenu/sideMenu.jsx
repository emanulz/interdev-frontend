/*
 * Module dependencies
 */
import React from 'react'
import Search from './components/search/search.jsx'
import User from './components/user/user.jsx'
import ComposedItem from './components/items/composed.jsx'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    sideMenuVisible: store.layout.sideMenuVisible,
    globalConf: store.config.globalConf
  }
})
export default class SideMenu extends React.Component {

  componentDidMount() {
    document.getElementById('loader').classList.remove('loader')
  }

  // Main Layout
  render() {

    const childs_cross = [
      {
        text: "Precios Producto",
        class: 'fa-gift',
        href: '/purchases/cross/prices-prod'
      },
      {
        text: "Proveedores Producto",
        class: 'fa-gift',
        href: '/purchases/cross/sups-prod'
      },
      {
        text: "Productos Proveedor",
        class: 'fa-gift',
        href: '/purchases/cross/prods-sup'
      },
      {
        text: "Compras Proveedor",
        class: 'fa-gift',
        href: '/purchases/cross/purchases-sup'
      }
    ]

    const childOrders = []

    if (this.props.globalConf.CanCreateRequests) {
      childOrders.push(
        {
          text: 'Pedidos',
          class: 'fa-gift',
          href: '/purchases/requests'
        }
      )
    }
    if (this.props.globalConf.CanCreateOrders) {
      childOrders.push(
        {
          text: 'Ordenes',
          class: 'fa-gift',
          href: '/purchases/orders'
        }
      )
    }

    const ordersComponent = this.props.globalConf.CanCreateOrders || this.props.globalConf.CanCreateRequests
      ? <ComposedItem mainTittle='Ordendes de Compra' mainIcon='fa-gift' childItems={childOrders} />
      : <div />

    // const title = this.props.userCompanyConfig.comercialName || this.props.defaultCompanyConfig.comercialName || 'APP'
    const sideMenuClass = this.props.sideMenuVisible ? 'sideMenu' : 'sideMenu hiddenByApp'
    return <div id='sideMenu' className={sideMenuClass}>
      <User />

      <Search />

      <div className='sideMenu-wrapper col-xs-12'>
        <ul className='sideMenu-items'>
          <li>
            <Link to='/purchases'>
              <span className='fa fa-area-chart' />
              Inicio</Link>
          </li>
          {ordersComponent}
          <li>
            <Link to='/purchases/add'>
              <span className='fa fa-file' />
              Ingresar Factura</Link>
          </li>
          <li>
            <Link to='/purchases/xml_add'>
              <span className='fa fa-file' />
              Ingresar Factura XML</Link>
          </li>
          <ComposedItem mainTittle="Referencia Cruzada" mainIcon='fa-database'
            childItems={childs_cross}/>
          <li>
            <Link to='/purchases/completelist'>
              <span className='fa fa-list-alt' />
              Listado Facturas Cerradas</Link>
          </li>
          <li>
            <Link to='/purchases/incompletelist'>
              <span className='fa fa-list-alt' />
              Listado Facturas Pendientes</Link>
          </li>
          <li>
            <Link to='/purchases/reports'>
              <span className='fa fa-list-alt' />
              <span>Reportes</span>
            </Link>
          </li>
        </ul>
      </div>

    </div>

  }

}
