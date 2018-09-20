import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    installedApps: store.config.installed_apps,
    permissions: store.permissions.permissions
  }
})
export default class Body extends React.Component {

  componentDidMount() {
    document.getElementById('loader').remove()
  }

  render() {
    const workshopLink = this.props.installedApps.WorkshopAppInstalled && this.props.permissions.access_workshop
      ? <li><a className='landing-roundBtn' href='/workshop'>Taller <i className='fa fa-wrench' /></a></li>
      : ''
    const restaurantLink = this.props.installedApps.RestaurantAppInstalled && this.props.permissions.access_restaurant
      ? <li><a className='landing-roundBtn' href='/restaurant'>Restaurante <i className='fa fa-cutlery' /></a></li>
      : ''
    const creditsLink = this.props.installedApps.CreditsAppInstalled && this.props.permissions.access_credits
      ? <li><a className='landing-roundBtn' href='/credits'>Crédito y cobro <i className='fa fa-credit-card' /></a></li>
      : ''
    const payablesLink = this.props.installedApps.PayablesAppInstalled && this.props.permissions.access_payables
      ? <li><a className='landing-roundBtn' href='/payables'>Por Pagar <i className='fa fa-money' /></a></li>
      : ''
    const purchasesLink = this.props.installedApps.PurchaseAppInstalled && this.props.permissions.access_purchases
      ? <li><a className='landing-roundBtn' href='/purchases'>Compras <i className='fa fa-truck' /></a></li>
      : ''
    const presalesLink = this.props.installedApps.PresalesAppInstalled && this.props.permissions.access_presales
      ? <li><a className='landing-roundBtn' href='/seller'>Preventa <i className='fa fa-shopping-basket' /></a></li>
      : ''
    const inventoriesLink = this.props.installedApps.InventoriesAppInstalled && this.props.permissions.access_inventories
      ? <li><a className='landing-roundBtn' href='/inventories'>Inventarios <i className='fa fa-building' /></a></li>
      : ''
    const returnsLink = this.props.installedApps.ReturnsAppInstalled && this.props.permissions.access_returns
      ? <li><a className='landing-roundBtn' href='/returns'>Devoluciones <i className='fa fa-rotate-left' /></a></li>
      : ''
    const adminLink = this.props.installedApps.AdministrationAppInstalled && this.props.permissions.access_administration
      ? <li><a className='landing-roundBtn' href='/admin'>Administración <i className='fa fa-tasks' /></a></li>
      : ''
    const salesLink = this.props.installedApps.SalesAppInstalled && this.props.permissions.access_sales
      ? <li><a className='landing-roundBtn' href='/sales'>Caja <i className='fa fa-shopping-cart' /></a></li>
      : ''
    return <div className='col-xs-12 row landing'>
      <div className='col-xs-10 col-sm-8 col-xs-offset-1 col-sm-offset-2 landing-container'>
        <div className='landing-container-header'>
          <hr />
          <h3>Aplicaciones disponibles</h3>
          <hr />
        </div>
        <ul className='buttons-container'>
          {restaurantLink}

          {adminLink}
          {salesLink}
          {presalesLink}

          {inventoriesLink}
          {creditsLink}
          {returnsLink}

          {workshopLink}
          {purchasesLink}
          {payablesLink}
        </ul>

      </div>

    </div>

  }

}
