/*
 * Module dependencies
 */
import React from 'react'

// import Client from '../../general/clients/clients.jsx'
import Notes from '../../../sales/general/extras/notes.jsx'
import Totals from '../../../sales/general/totals/totals.jsx'
// import ButtonsExtras from '../buttons/buttonsExtras.jsx'
import MainButtons from '../buttons/buttonsMain.jsx'
import Currency from '../../../sales/general/currency/currency.jsx'
// import PriceList from '../../general/priceList/priceList.jsx'
import {connect} from 'react-redux'
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs'
import {getItemDispatch} from '../../../../utils/api.js'
import {getProjectActivities} from '../../../admin/projects/actions.js'
import Supplier from '../../general/suppliers/suppliers.jsx'
import Select2 from 'react-select2-wrapper'

@connect((store) => {
  return {
    fullWidth: store.order.fullWidth,
    total: store.cart.cartTotal,
    currencySymbol: store.currency.symbolSelected,
    projects: store.order.projects,
    activities: store.order.activities,
    project: store.order.projectSelected,
    activity: store.order.activitySelected
  }
})
export default class Aside extends React.Component {

  toggleWidth () {
    this.props.dispatch({type: 'TOGGLE_FULL_WIDTH', payload: ''})
  }

  componentWillMount() {
    // HERE DISPATCH THE FETCH ACTIVE PROJECTS
    const projectKwargs = {
      url: '/api/projects/?is_active=True',
      successType: 'FETCH_ORDER_PROJECTS_FULFILLED',
      errorType: 'FETCH_ORDER_PROJECTS_REJECTED'
    }
    this.props.dispatch(getItemDispatch(projectKwargs))
  }

  setProjectActive(ev) {
    const value = ev.target.value
    this.props.dispatch({type: 'SET_ORDER_PROJECT', payload: value})
  }

  setActivityActive(ev) {
    const value = ev.target.value
    this.props.dispatch({type: 'SET_ORDER_ACTIVITY', payload: value})
  }

  componentDidUpdate(oldProps) {
    if (oldProps.project != this.props.project) {
      this.props.dispatch(getProjectActivities(`/api/projects/getRelatedActivities/?id_number=${this.props.project}`))
    }
  }

  // Main Layout
  render () {
    const symbol = this.props.currencySymbol
    const asideClass = this.props.fullWidth ? 'order-aside collapsed' : 'order-aside'
    const asideContainerClass = this.props.fullWidth ? 'order-aside-content collapsed' : 'order-aside-content'

    const sortedProjects = this.props.projects.sort((a, b) => {
      return a.id - b.id
    })
    const projectsData = sortedProjects.map(project => {
      return {text: `${project.id} - ${project.name}`, id: project.id}
    })
    const sortedActivities = this.props.activities.sort((a, b) => {
      return a.id - b.id
    })
    const activitiesData = sortedActivities.map(activity => {
      return {text: `${activity.id} - ${activity.name}`, id: activity.id}
    })
    return <div className={asideClass}>
      <div className={asideContainerClass}>
        {/* <div className='order-aside-arrow'>
          <div className='order-aside-arrow-container' onClick={this.toggleWidth.bind(this)}>
            <i className='fa fa-chevron-right' />
          </div>
        </div> */}
        <Tabs defaultTab='one'>
          <TabList>
            <Tab className='oneTwo' tabFor='one'>General</Tab>
            <Tab className='oneTwo' tabFor='two'>Extras</Tab>
            <TabPanel tabId='one'>
              <h1>NUEVA ORDEN DE COMPRA:</h1>
              {/* <Client /> */}
              {/* <PriceList /> */}
              <Supplier />
              <div className='order-aside-project'>
                <h2>Proyecto:</h2>
                <Select2
                  name='project'
                  data={projectsData}
                  value={this.props.project}
                  className='form-control'
                  onSelect={this.setProjectActive.bind(this)}
                  options={{
                    placeholder: 'Elija un Proyecto...',
                    noResultsText: 'Sin elementos'
                  }}
                />
              </div>

              <div className='order-aside-project'>
                <h2>Actividad:</h2>
                <Select2
                  name='activity'
                  data={activitiesData}
                  value={this.props.activity}
                  className='form-control'
                  onSelect={this.setActivityActive.bind(this)}
                  options={{
                    placeholder: 'Elija una Actividad...',
                    noResultsText: 'Sin elementos'
                  }}
                />
              </div>
              <Currency />
              <Totals key='sales' />
              <MainButtons />
            </TabPanel>

            <TabPanel tabId='two'>
              <Notes />
              {/* <ButtonsExtras /> */}
            </TabPanel>
          </TabList>
        </Tabs>
        {/* <Client />
        <PriceList />
        <Currency />
        <Totals />
        <Notes />
        <Buttons /> */}
      </div>
      {/* <Buttons /> */}
      <div className='order-aside-total' >
        {symbol} {this.props.total.formatMoney()}
        <i className='fa fa-chevron-right' onClick={this.toggleWidth.bind(this)} />
      </div>
    </div>
  }

}
