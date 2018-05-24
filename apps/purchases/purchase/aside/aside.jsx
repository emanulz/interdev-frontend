import React from 'react'
import {connect} from 'react-redux'

//components
import Supplier from '../../general/suppliers/suppliers.jsx'
import Totals from '../../general/totals/totals.jsx'
import PurchaseButtons from '../../general/purchaseButtons/purchaseButtons.jsx'

@connect(store=>{
    return{
        fullWidth: store.purchase.fullWidth,
    }
})
export default class Aside extends React.Component {


    toggleWidth () {
        this.props.dispatch({type: 'TOGGLE_FULL_WIDTH', payload: ''})
      }

      render(){
        const asideClass = this.props.fullWidth ? 'purchase-aside collapsed' : 'purchase-aside'
        const asideContainerClass = this.props.fullWidth ? 'purchase-aside-content collapsed' : 'purchase-aside-content'
        return <div className={asideClass} >
            <div className={asideContainerClass} >
                <Supplier/>
                <Totals/>
                <PurchaseButtons/>
            </div>
        </div>
    }
}