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
  }
})
export default class SideMenu extends React.Component {

  componentDidMount() {
    document.getElementById('loader').classList.remove('loader')
  }

  // Main Layout
  render() {

    const childApps = [
      {
        text: 'Productos',
        class: 'fa-gift',
        href: '/admin/products'
      }, {
        text: 'Familias',
        class: 'fa-list',
        href: '/admin/productdepartments'
      }, {
        text: 'Sub-Familias',
        class: 'fa-outdent',
        href: '/admin/productsubdepartments'
      }, {
        text: 'Importar',
        class: 'fa-indent',
        href: '/admin/products/importproducts'
      }
    ]

    // const title = this.props.userCompanyConfig.comercialName || this.props.defaultCompanyConfig.comercialName || 'APP'

    return <div id='sideMenu' className='sideMenu'>

      {/* <h3 className='sideMenu-header'>{title.toUpperCase()}</h3> */}
      <User />

      <Search />

      <div className='sideMenu-wrapper col-xs-12'>
        <ul className='sideMenu-items'>
          <li>
            <Link to='/admin'>
              <span className='fa fa-tasks' />
              Administración</Link>
          </li>
          <li>
            <Link to='/admin/users'>
              <span className='fa fa-user' />
              Usuarios</Link>
          </li>
          <li>
            <Link to='/admin/permissions'>
              <span className='fa fa-user' />
              Permisos</Link>
          </li>
          <li>
            <Link to='/admin/clients'>
              <span className='fa fa-users' />
              Clientes</Link>
          </li>
          <li>
            <Link to='/admin/clientcategories'>
              <span className='fa fa-users' />
              Categorías de clientes</Link>
          </li>
          <li>
            <Link to='/admin/senders'>
              <span className='fa fa-user' />
              Emisores</Link>
          </li>
          <li>
            <Link to='/admin/products'>
              <span className='fa fa-gift' />
              Productos</Link>
          </li>
          <li>
            <Link to='/admin/productdepartments'>
              <span className='fa fa-list' />
              Familias de Productos</Link>
          </li>
          <li>
            <Link to='/admin/productsubdepartments'>
              <span className='fa fa-outdent' />
              Sub-Familias de Productos</Link>
          </li>
          <li>
            <Link to='/admin/products/importproducts'>
              <span className='fa fa-indent' />
              Importar Productos</Link>
          </li>
          <li>
            <Link to='/admin/suppliers'>
              <span className='fa fa-truck' />
              Proveedores</Link>
          </li>
          <li>
            <Link to='/admin/warehouses'>
              <span className='fa fa-building' />
              Bodegas</Link>
          </li>
          <ComposedItem mainTittle='Otras Aplicaciones' mainIcon='fa-gift' childItems={childApps} />

        </ul>
      </div>

    </div>

  }

}
