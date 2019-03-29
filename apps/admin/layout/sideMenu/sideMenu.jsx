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
    user: store.user.user,
    installedApps: store.config.installed_apps,
    
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
      }
    ]

    if (this.props.config.useQuoting) {
      childPresales.push(
        {
          text: 'Proformas',
          class: 'fa-envelope-open',
          href: '/admin/presales/quoting'
        }
      )
    }

    if (this.props.config.useReserves) {
      childPresales.push(
        {
          text: 'Reservas',
          class: 'fa-cubes',
          href: '/admin/presales/reserves'
        }
      )
    }

    if (this.props.config.useNSReserves) {
      childPresales.push(
        {
          text: 'Apartados',
          class: 'fa-cubes',
          href: '/admin/presales/nsreserves'
        }
      )
    }

    if (this.props.installedApps.RestaurantAppInstalled) {
      childPresales.push(
        {
          text: 'Cuentas Restaurante',
          class: 'fa-cutlery',
          href: '/admin/presales/restaurant'
        }
      )
    }

    const childSales = [
      {
        text: 'Listado de Ventas',
        class: 'fa-gift',
        href: '/admin/sales'
      }, {
        text: 'Cierres de Caja',
        class: 'fa-gift',
        href: '/admin/registerclosures'
      }
    ]

    if (this.props.config.tracksPerEmployeeSales) {
      childSales.push(
        {
          text: 'Vendedores',
          class: 'fa-gift',
          href: '/admin/salesclerks'
        }
      )
    }

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
      }, {
        text: 'Vouchers',
        class: 'fa-money',
        href: '/admin/vouchers'
      }
    ]

    //create the helpers menu only if there are any enabled
    let collections_menu = ''
    const helpModelsInUse = this.props.config.helpModelsInUse
    console.log("help models in use --> ", helpModelsInUse)
    if(helpModelsInUse != '' && helpModelsInUse != undefined){
      const collection_names = helpModelsInUse.split(',')
      if(collection_names.length>0){
        const collection_childs = []
        for(let item of collection_names){
          if(item == ''){
            continue
          }
          const item_capitalized =  item.charAt(0).toUpperCase() + item.slice(1)

          collection_childs.push({
            text: item_capitalized,
            class: 'fa-truck',
            href: `/admin/helpers/${item.trim()}`
          })
        }
        if(collection_childs.length>0){
          collections_menu = <ComposedItem mainTittle='Colecciones' mainIcon='fa-database' childItems={collection_childs} />
        }
        
        //build the root component of the category
      }
      // const childCollections = [
      //   {
      //     text: 'Marcas',
      //     class: 'fa-truck',
      //     href: '/admin/helpers/marcas'
      //   }, {
      //     text: 'Colores',
      //     class: 'fa-truck',
      //     href: '/admin/helpers/colores'
      //   }, {
      //     text: 'Aparatos',
      //     class: 'fa-truck',
      //     href: '/admin/helpers/aparatos'
      //   }, {
      //     text: 'Desperfectos',
      //     class: 'fa-truck',
      //     href: '/admin/helpers/desperfectos'
      //   }
      // ]
    }

    

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
  
          <ComposedItem mainTittle='Ventas' mainIcon='fa-list-ol' childItems={childSales} />
          <ComposedItem mainTittle='Preventas' mainIcon='fa-list-ul' childItems={childPresales} />
          
          {eInvoicingComponent}
          <ComposedItem mainTittle='Administración' mainIcon='fa-tachometer' childItems={childAdmin} />
          {collections_menu}
        </ul>
      </div>

    </div>

  }

}
