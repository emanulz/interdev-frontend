import React from 'react'
import {connect} from 'react-redux'

@connect(store =>{
    return{
        requestsGroups: store.requestPanel.requestsGroups,
        requestList: store.transactionsList.partsRequestList,  
        selectedGroup: store.requestPanel.selectedGroup,    
    }
})
export default class PartRequestData extends React.Component {
    render(){
        const filtered_requests = this.props.requestList.filter(a=>a.part_request_group == this.props.selectedGroup)
        const items = filtered_requests.map((item) => {
      
            return <div className='compact-invoice-table-body-item' key={item.element.id}>
              <div className='compact-invoice-table-body-item-description'>
                {item.element.description}
              </div>
              <div className='compact-invoice-table-body-item-data'>
                <div className='compact-invoice-table-body-item-data-qty'>
                  {item.qty}
                </div>
                <div className='compact-invoice-table-body-item-data-code'>
                  {item.element.code}
                </div>
                <div className='compact-invoice-table-body-item-data-total'>
                  ₡ {parseFloat(item.element.sell_price1).formatMoney(2, ',', '.')}
                </div>
              </div>
            </div>
          })

          return <div className='compact-invoice-table'>
          <div className='compact-invoice-table-header'>
            <div className='compact-invoice-table-header-qty'>Cant</div>
            <div className='compact-invoice-table-header-code'>Código</div>
            <div className='compact-invoice-table-header-total'>Precio IVI</div>
          </div>
          <div className='compact-invoice-table-body'>
            {items}
          </div>
    
        </div>          

    }
}