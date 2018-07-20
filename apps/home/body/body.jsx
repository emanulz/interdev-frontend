import React from 'react'

export default class Body extends React.Component {

  componentDidMount() {
    document.getElementById('loader').remove()
  }

  render() {
    return <div className='col-xs-12 row landing'>
      <div className='col-xs-10 col-sm-8 col-xs-offset-1 col-sm-offset-2 landing-container'>
        {/* <h1>Bienvenido</h1> */}
        <hr />
        <h3>Aplicaciones disponibles</h3>
        <hr />

        <ul className='buttons-container'>
          <li><a className='landing-roundBtn' href='/admin'>Administración <i className='fa fa-tasks' /></a></li>
          <li><a className='landing-roundBtn' href='/sales'>Caja <i className='fa fa-shopping-cart' /></a></li>
          <li><a className='landing-roundBtn' href='/seller'>Preventa <i className='fa fa-shopping-basket' /></a></li>
        </ul>
        <ul className='buttons-container'>
          <li><a className='landing-roundBtn' href='/inventories'>Inventarios <i className='fa fa-building' /></a></li>
          <li><a className='landing-roundBtn' href='/credits'>Crédito y cobro <i className='fa fa-credit-card' /></a></li>
          <li><a className='landing-roundBtn' href='/returns'>Devoluciones <i className='fa fa-rotate-left' /></a></li>
        </ul>
        <ul className='buttons-container'>
          <li><a className='landing-roundBtn' href='/purchases'>Compras <i className='fa fa-truck' /></a></li>
          <li><a className='landing-roundBtn' href='/payables'>Por Pagar <i className='fa fa-money' /></a></li>
        </ul>

      </div>

    </div>

  }

}
