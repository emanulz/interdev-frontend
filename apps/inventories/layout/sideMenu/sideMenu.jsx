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
    useFileTransfer: store.config.globalConf.canDoFileTransfer,
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
    
    let makeFileTransferMenu = ''
    let loadFileTransferMenu = ''
    if(this.props.useFileTransfer){
      makeFileTransferMenu = <li>
        <Link to='/inventories/makeFileTransfer'>
          <span className='fa fa-file' />
          Crear Transferencia</Link>
      </li>

      loadFileTransferMenu = <li>
        <Link to='/inventories/loadFileTransfer'>
          <span className='fa fa-file' />
          Cargar Transferencia</Link>
      </li>

    }
    return <div id='sideMenu' className={sideMenuClass}>

      {/* <h3 className='sideMenu-header'>{title.toUpperCase()}</h3> */}
      <User />

      <Search />

      


      <div className='sideMenu-wrapper col-xs-12'>
        <ul className='sideMenu-items'>
          {/* <li>
            <Link to='/inventories'>
              <span className='fa fa-area-chart' />
              Inicio</Link>
          </li> */}
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
            <Link to='/inventories/physical'>
              <span className='fa fa-user' />
              Toma Física</Link>
          </li>
          <li>
            <Link to='/inventories/takemovements'>
              <span className='fa fa-user' />
              Movimientos Toma Física</Link>
          </li>
          <li>
            <Link to='/inventories/checktakemovements'>
              <span className='fa fa-user' />
              Consulta Mov Toma Física</Link>
          </li>
          <li>
            <Link to='/inventories/warehouses'>
              <span className='fa fa-building' />
              Bodegas</Link>
          </li>
          {makeFileTransferMenu}
          {loadFileTransferMenu}
          <li>
            <Link to='/inventories/filetransferslist'>
              <span className='fa fa-file' />
              Listado Transferencias</Link>
          </li>
          <li>
            <Link to='/inventories/masstransfer/output'>
              <span className='fa fa-arrow-left' />
              Crear Salida Masiva</Link>
          </li>
          <li>
            <Link to='/inventories/masstransfer/input'>
              <span className='fa fa-arrow-right' />
              Crear Ingreso Masivo</Link>
          </li>
          <li>
            <Link to='/inventories/masstransfer/transfer'>
              <span className='fa fa-arrows-h' />
              Crear Transferencia Masiva</Link>
          </li>
          <li>
            <Link to='/inventories/massloadlist/input'>
              <span className='fa fa-arrow-right' />
              Listado Ingresos Masivos</Link>
          </li>
          <li>
            <Link to='/inventories/massloadlist/output'>
              <span className='fa fa-arrow-left' />
              Listado Salidas Masivas</Link>
          </li>
          <li>
            <Link to='/inventories/massloadlist/transfer'>
              <span className='fa fa-arrows-h' />
              Listado Transferencias Masivas</Link>
          </li>

        </ul>
      </div>

    </div>

  }

}
