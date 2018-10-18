import React from 'react'
import {connect} from 'react-redux'

@connect(store=>{
    return {
        
    }
})
export default class SaleInfo extends React.Component {
    componentWillMount(){

    }

    componentWillReceiveProps(nextProps){

    }

    render(){
        return <div className='saleInfo'>
            <div className="saleInfo-data">
                <div className='saleInfo-data-row'>
                    <div className="saleInfo-data-row-inline">
                        <h3>Venta: </h3>
                        {'20'}
                    </div>
                </div>
                <div className='saleInfo-data-row'>
                    <div className="saleInfo-data-row-inline">
                        <h3>Consecutivo: </h3>
                        {'00100001010000000040'}
                    </div>
                </div>
                <div className='saleInfo-data-row'>
                    <div className="saleInfo-data-row-inline">
                        <h3>Total: </h3>
                        {'$'+'00100001010000000040'}
                    </div>
                </div>
            </div>
        </div>
    }
}

