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
    useFileTransfer: store.config.globalConf.canDoFileTransfer,
    isAlchemist: store.config.globalConf.isAlchemist,
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
    

    let transmutation = ''
    if(this.props.isAlchemist){
      const childReports = [
        {
          text: 'Listado Recetas',
          class: 'fa-list',
          href: '/inventories/recipes'
        }, {
          text: 'Acerca',
          class: 'fa-gift',
          href: '/inventories/recipesabout'
        }
      ]
      transmutation = <ComposedItem mainTittle='Transformaciones' mainIcon='fa fa-tasks' childItems={childReports} />
    }

    const mass_movs_lists = [
      {
        text: 'Listado Ingresos Masivos',
        class: 'fa fa-arrow-right',
        href: '/inventories/massloadlist/input'
      }, {
        text: 'Crear Ingreso Masivo',
        class: 'fa fa-arrow-right',
        href: '/inventories/masstransfer/input'
      },
      
      {
        text: 'Listado Salidas Masivas',
        class: 'fa fa-arrow-left',
        href: '/inventories/massloadlist/output'
      },{
        text: 'Crear Salida Masiva',
        class: 'fa fa-arrow-left',
        href: '/inventories/masstransfer/output'
      }, 
      
      {
        text: 'Listado Transf. Masivas',
        class: 'fa fa-arrows-h',
        href: '/inventories/massloadlist/transfer'
      }, {
        text: 'Crear Transf. Masiva',
        class: 'fa fa-arrows-h',
        href: '/inventories/masstransfer/transfer'
      }
    ]
    const mass_movs_menu = <ComposedItem mainTittle='Movimientos en masa' mainIcon='fa fa-tasks' childItems={mass_movs_lists} />

    const physical_take_items = [
      {
        text: 'Toma Física',
        class: 'fa fa-user',
        href: '/inventories/physical'
      }, {
        text: 'Movimientos Toma Física',
        class: 'fa fa-user',
        href: '/inventories/takemovements'
      }, {
        text: 'Consulta Mov Toma Física',
        class: 'fa fa-user',
        href: '/inventories/checktakemovements'
      }
    ]
    const physical_take_menu = <ComposedItem mainTittle='Toma física' mainIcon='fa fa-tasks' childItems={physical_take_items} />

    let transfer_menu = ''
    if(this.props.useFileTransfer){
      const inv_transfer_items = [
              {
          text: 'Crear Transferencia',
          class: 'fa fa-file',
          href: '/inventories/makeFileTransfer'
        }, {
          text: 'Cargar Transferencia',
          class: 'fa fa-file',
          href: '/inventories/loadFileTransfer'
        }, {
          text: 'Listado Transferencias',
          class: 'fa fa-file',
          href: '/inventories/filetransferslist'
        }
      ]

      transfer_menu = <ComposedItem mainTittle='Transferir Inventario' mainIcon='fa fa-tasks' childItems={inv_transfer_items} />
    }

    return <div id='sideMenu' className={sideMenuClass}>

      <User />

      <Search />

      
      <div className='sideMenu-wrapper col-xs-12'>
        <ul className='sideMenu-items'>

          {transmutation}
          <li>
            <Link to='/inventories/movements'>
              <span className='fa fa-exchange' />
              Movimientos Manuales</Link>
          </li>
          <li>
            <Link to='/inventories/tracking'>
              <span className='fa fa-list-ol' />
              Histórico por producto</Link>
          </li>


          <li>
            <Link to='/inventories/warehouses'>
              <span className='fa fa-building' />
              Bodegas</Link>
          </li>

          {physical_take_menu}
          {mass_movs_menu}
          {transfer_menu}

        </ul>
      </div>

    </div>

  }

}
