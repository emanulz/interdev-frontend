import React from 'react'
import {connect} from 'react-redux'

import Profile from './components/profile.jsx'
import SetUser from './components/setUser.jsx'
import SendSideBar from './components/newBillSideBar.jsx'

@connect((store) => {
  return {
    panelVisible: store.newBill.isVisible,
    presaleType: store.newBill.presale_type,
    tables: store.tables.tables,
    tableActive: store.tables.tableActive}
})
export default class NewBillPanel extends React.Component {

  hidePanel() {

    this.props.dispatch({type: 'HIDE_NEW_BILL_PANEL', newBillload: -1})
  }

  render() {

    const tableSelected = this.props.tables.find(table => table.id == this.props.tableActive)
    const tableName = tableSelected ? tableSelected.indentifier : ''

    const isVisible = (this.props.panelVisible)
      ? 'newBill-panel is-visible'
      : 'newBill-panel'

    return <div className={isVisible}>

      <div className='newBill-panel-main'>
        <div className='newBill-panel-header'>
          Crear Cuenta en {tableName}
          <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
        </div>

        {/* <Profile /> */}

        <div className='newBill-area-container'>

          {/* <SetUser /> */}

          <SendSideBar />

        </div>

      </div>

    </div>

  }

}
