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
    taxPayer: store.userProfile.taxPayer,
    config: store.config.globalConf,
    user: store.user.user
  }
})
export default class SideMenu extends React.Component {

  componentDidMount() {
    document.getElementById('loader').classList.remove('loader')
  }

  // Main Layout
  render() {

    const childInvoicing = [
      {
        text: 'Facturas Electrónicas',
        class: 'fa-gift',
        href: '/admin/invoicing/invoices'
      }, {
        text: 'Tiquetes Electrónicos',
        class: 'fa-list',
        href: '/admin/invoicing/tickets'
      }, {
        text: 'N. de Crédito Electrónicas',
        class: 'fa-outdent',
        href: '/admin/invoicing/creditnotes'
      }
    ]
    if (this.props.config.useDebitNotes) {
      childInvoicing.push(
        {
          text: 'N. de Débito Electrónicas',
          class: 'fa-outdent',
          href: '/admin/invoicing/debitnotes'
        }
      )
    }
    const acceptPurchases = {
      text: 'Aceptar Compras',
      class: 'fa-upload',
      href: '/admin/invoicing/purchases'
    }
    childInvoicing.push(acceptPurchases)
    if (this.props.user.is_staff) {
      childInvoicing.push(
        {
          text: 'Reintento Masivo',
          class: 'fa-retweet',
          href: '/admin/invoicing/massiveretry'
        }
      )
    }

    const childPresales = [
      {
        text: 'Listado de preventas',
        class: 'fa-gift',
        href: '/admin/presales'
      }, {
        text: 'Proformas',
        class: 'fa-envelope-open',
        href: '/admin/presales/quoting'
      }, {
        text: 'Reservas',
        class: 'fa-cubes',
        href: '/admin/presales/reserves'
      }, {
        text: 'Apartados',
        class: 'fa-cubes',
        href: '/admin/presales/nsreserves'
      }, {
        text: 'Cuentas Restaurante',
        class: 'fa-cutlery',
        href: '/admin/presales/restaurant'
      }
    ]

    const childSales = [
      {
        text: 'Listado de Ventas',
        class: 'fa-gift',
        href: '/admin/sales'
      },{
        text: 'Cierres de Caja',
        class: 'fa-gift',
        href: '/admin/registerclosures'
      },{
        text: 'Vendedores',
        class: 'fa-gift',
        href: '/admin/salesclerks'
      }
    ]

    const childProducts = [
      {
        text: 'Productos',
        class: 'fa-database',
        href: '/admin/products'
      }, {
        text: 'Familias de Productos',
        class: 'fa-tag',
        href: '/admin/productdepartments'
      }, {
        text: 'Sub-Familias de Productos',
        class: 'fa-tags',
        href: '/admin/productsubdepartments'
      }, {
        text: 'Bodegas',
        class: 'fa-building',
        href: '/admin/warehouses'
      }, {
        text: 'Proveedores',
        class: 'fa-truck',
        href: '/admin/suppliers'
      }, {
        text: 'Importar',
        class: 'fa-indent',
        href: '/admin/products/importproducts'
      }
    ]

    const childAdmin = [
      {
        text: 'usuarios',
        class: 'fa-user-circle',
        href: '/admin/users'
      }, {
        text: 'Permisos',
        class: 'fa-sitemap',
        href: '/admin/permissions'
      }, {
        text: 'Contribuyente',
        class: 'fa-user',
        href: '/admin/taxpayers'
      }
    ]

    const chilClients = [
      {
        text: 'Clientes',
        class: 'fa-street-view',
        href: '/admin/clients'
      }, {
        text: 'Categorías de Clientes',
        class: 'fa-tasks',
        href: '/admin/clientcategories'
      }, {
        text: 'Adelantos de Efectivo',
        class: 'fa-money',
        href: '/admin/cashadvances'
      }
    ]

    // const title = this.props.userCompanyConfig.comercialName || this.props.defaultCompanyConfig.comercialName || 'APP'
    const eInvoicingComponent = this.props.taxPayer.is_digital_invoicing_active
      ? <ComposedItem mainTittle='Facturación Electrónica' mainIcon='fa-gift' childItems={childInvoicing} />
      : <div />
    return <div id='sideMenu' className='sideMenu'>

      {/* <h3 className='sideMenu-header'>{title.toUpperCase()}</h3> */}
      <User />

      <Search />

      <div className='sideMenu-wrapper col-xs-12'>
        <ul className='sideMenu-items'>
          <li>
            <Link to='/admin/reports'>
              <span className='fa fa-tasks' />
              Reportes Generales</Link>
          </li>
          <ComposedItem mainTittle='Productos' mainIcon='fa-database' childItems={childProducts} />
          <ComposedItem mainTittle='Clientes' mainIcon='fa-street-view' childItems={chilClients} />
          {/* <li>
            <Link to='/admin/users'>
              <span className='fa fa-user-circle' />
              Usuarios</Link>
          </li>
          <li>
            <Link to='/admin/permissions'>
              <span className='fa fa-sitemap' />
              Permisos</Link>
          </li> */}
          <ComposedItem mainTittle='Ventas' mainIcon='fa-list-ol' childItems={childSales} />
          <ComposedItem mainTittle='Preventas' mainIcon='fa-list-ul' childItems={childPresales} />
          {/* <ComposedItem mainTittle='Facturación Electrónica' mainIcon='fa-gift' childItems={childInvoicing} /> */}
          {eInvoicingComponent}
          <ComposedItem mainTittle='Administración' mainIcon='fa-tachometer' childItems={childAdmin} />
          {/* <li>
            <Link to='/admin/products'>
              <span className='fa fa-database' />
              Productos</Link>
          </li> */}
          {/* <li>
            <Link to='/admin/clients'>
              <span className='fa fa-street-view' />
              Clientes</Link>
          </li> */}
          {/* <li>
            <Link to='/admin/taxpayers'>
              <span className='fa fa-user' />
              Contribuyentes</Link>
          </li> */}
          {/* <li>
            <Link to='/admin/clientcategories'>
              <span className='fa fa-tasks' />
              Categorías de clientes</Link>
          </li> */}
          {/* <li>
            <Link to='/admin/senders'>
              <span className='fa fa-user' />
              Emisores</Link>
          </li> */}
          {/* <li>
            <Link to='/admin/productdepartments'>
              <span className='fa fa-tag' />
              Familias de Productos</Link>
          </li>
          <li>
            <Link to='/admin/productsubdepartments'>
              <span className='fa fa-tags' />
              Sub-Familias de Productos</Link>
          </li> */}
          {/* <li>
            <Link to='/admin/products/importproducts'>
              <span className='fa fa-indent' />
              Importar Productos</Link>
          </li> */}
          {/* <li>
            <Link to='/admin/suppliers'>
              <span className='fa fa-truck' />
              Proveedores</Link>
          </li>
          <li>
            <Link to='/admin/warehouses'>
              <span className='fa fa-building' />
              Bodegas</Link>
          </li> */}
          {/* <ComposedItem mainTittle='Otras Aplicaciones' mainIcon='fa-gift' childItems={childApps} /> */}

        </ul>
      </div>

    </div>

  }

}
