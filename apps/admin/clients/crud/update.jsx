/*
 * Module dependencies
 */
import React from 'react'
import Form from './form/form.jsx'
import Form2 from './form/form2.jsx'

import Unauthorized from '../../../../general/unauthorized.jsx'
import {connect} from 'react-redux'
import {setNextPrevItem} from '../../../../utils/api'
import {Link} from 'react-router-dom'
import UpdateButtons from './form/updateButtons.jsx'
import ItemsBar from '../../layout/itemsBar/itemsBar.jsx'
import {toggleItemsBar} from '../../layout/itemsBar/actions'
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs'

@connect((store) => {
  return {
    permissions: store.clientsAdmin.permissions,
    client: store.clientsAdmin.clientActive,
    nextClient: store.clientsAdmin.nextClient,
    previousClient: store.clientsAdmin.previousClient,
    clients: store.clientsAdmin.clients,
    config: store.config.globalConf
  }
})
export default class Update extends React.Component {

  componentDidMount() {
    this.props.dispatch({type: 'CLEAR_NEXT_PREV_CLIENT', payload: ''})
  }

  componentWillUpdate(nextProps) {

    const code = this.props.location.pathname.split('/').pop()

    if (nextProps.nextClient == 0 && nextProps.previousClient == 0 && nextProps.clients.length) {

      const kwargs = {
        items: [
          ...nextProps.clients
        ],
        codeField: 'code',
        code: code,
        dispatchType: 'SET_NEXT_PREV_CLIENT'
      }

      this.props.dispatch(setNextPrevItem(kwargs))

    }
  }

  toggleBar() {
    toggleItemsBar()
  }

  // Main Layout
  render() {

    let content = ''

    const code = this.props.location.pathname.split('/').pop()

    switch (this.props.permissions.change) {
      case true:
      {
        if (this.props.config.usesClientPriceTable) {
          content = <div className='heigh100'>
            <Tabs>
              <TabList>
                <Tab className='oneTwo' tabFor='one'>Cliente</Tab>
                <Tab className='oneTwo' tabFor='two'>Precios</Tab>
              </TabList>

              <TabPanel tabId='one'>
                <Form key={`${code}1`} update />
                <UpdateButtons />
              </TabPanel>

              <TabPanel tabId='two'>
                <Form2 key={`${code}2`} update />
              </TabPanel>
            </Tabs>
          </div>

        } else {
          content = <div className='heigh100'>
            <Form key={code} update location={this.props.location} />
            <UpdateButtons />
          </div>
        }

        break
      } // case

      case false:
      {
        content = <Unauthorized />
        break
      } // case
      default:
      {
        content = <div>FETCHING</div>
        break
      } // case
    }

    return <div className='create heigh100'>
      <div className='create-edit-header'>
        <h1>EDITAR CLIENTE {code}</h1>
        <Link to={`/admin/clients/edit/${this.props.previousClient}`}>
          <span className={`previous fa fa-chevron-circle-left`} />
        </Link>
        <Link to={`/admin/clients/edit/${this.props.nextClient}`}>
          <span className='next fa fa-chevron-circle-right' />
        </Link>
        <span onClick={this.toggleBar.bind(this)} className='list fa fa-list' />
      </div>

      {content}

      <ItemsBar items={this.props.clients} tittle='Lista de Clientes' codeField='code' descriptionField='name'
        descriptionField2='last_name' editPath='/admin/clients/edit/' />
    </div>

  }

}
