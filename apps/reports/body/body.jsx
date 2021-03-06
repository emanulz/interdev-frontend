import React from 'react'

export default class Body extends React.Component {

  componentDidMount() {
    document.getElementById('loader').remove()
  }

  render() {
    return <div className='col-xs-12 row landing'>
      <div className='col-xs-10 col-sm-8 col-xs-offset-1 col-sm-offset-2 landing-container'>
        <h1>Bienvenido</h1>
        <hr />
        <h3>Elija una opcion para iniciar</h3>

        <ul className='buttons-container'>
          <li><a className='btn btn-default btn-lg landing-btn' href='/admin'>Administración</a></li>
          <li><a className='btn btn-default btn-lg landing-btn' href='/sales'>Ventas</a></li>
          <li><a className='btn btn-default btn-lg landing-btn' href='/buys'>Compras</a></li>
        </ul>
        <ul className='buttons-container'>
          <li><a className='btn btn-default btn-lg landing-btn' href='/inventories'>Inventarios</a></li>
          <li><a className='btn btn-default btn-lg landing-btn' href='/reports'>Reportes</a></li>
          <li><a className='btn btn-default btn-lg landing-btn' href='/permissions'>Permisos</a></li>
        </ul>

      </div>

    </div>

  }

}
