import React from 'react'
import {connect} from 'react-redux'

@connect(store=>{
    return{
        
    }
})
export default class Totals extends React.Component {

    render (){
        return <div className='totals'>
            <div className='totals-data-row'>
                <div className='totals-data-row-label' >Descuento ₡:</div>
                <input className='totals-data-row-input' type='text'/>
            </div>
            
            <div className='totals-data-row'>
                <div className='totals-data-row-label' >Impuesto ₡:</div>
                <input className='totals-data-row-input' type='text'/>
            </div>
            <div className='totals-data-row'>
                <div className='totals-data-row-label' >Total:</div>
                <div className='totals-data-row-value'>555</div>
            </div>
        </div>
    }
}