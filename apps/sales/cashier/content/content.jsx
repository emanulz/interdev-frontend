/*
 * Module dependencies
 */
import React from 'react'
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs'
import Cash from './cash.jsx'
import Card from './card.jsx'
import Transfer from './transfer.jsx'
import {connect} from 'react-redux'
@connect((store) => {
  return {
    fullWidth: store.cashier.fullWidth,
    registerClosure: store.registerClosure.registerClosure
  }
})
export default class Main extends React.Component {

  toggleWidth () {
    this.props.dispatch({type: 'TOGGLE_CASHIER_FULL_WIDTH', payload: ''})
  }

  // Main Layout
  render() {
    const contentClass = this.props.fullWidth ? 'cashier-content fullWidth' : 'cashier-content'

    const registerClosure = this.props.registerClosure
    const tittle = registerClosure == null || registerClosure == false ? 'Apertura de Caja' : 'Cierre de Caja'

    return <div className={contentClass}>
      <div className='cashier-content-tittle'>
        {tittle}
      </div>
      <div>
        <Tabs defaultTab='one'>
          <TabList>
            <Tab className='oneThree' tabFor='one'>Efectivo</Tab>
            <Tab className='oneThree' tabFor='two'>Tarjetas</Tab>
            <Tab className='oneThree' tabFor='three'>Transferencias</Tab>
          </TabList>

          <TabPanel tabId='one'>
            <Cash />
          </TabPanel>

          <TabPanel tabId='two'>
            <Card />
          </TabPanel>

          <TabPanel tabId='three'>
            <Transfer />
          </TabPanel>
        </Tabs>
      </div>
    </div>

  }

}
