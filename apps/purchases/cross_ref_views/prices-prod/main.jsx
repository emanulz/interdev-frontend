import React from 'react'
import {connect} from 'react-redux'
import {getSingleItemDispatch} from '../../../../utils/api.js'
import General_Chart from '../general_chart/main.jsx'

@connect(store=>{
    return {
        records_limit: store.cross_ref.cross_actions.records_limit,
        records_to_fetch: store.cross_ref.cross_actions.records_to_fetch,
        product_code: store.cross_ref.cross_actions.product_code,
        product_insight: store.cross_ref.cross_actions.product_insight,
    }
})
export default class Prices_Prod extends React.Component {
    

    fetchProductInsight(e){
        console.log("Fetch product insight")
        if(this.props.product_code ===''){
            this.props.dispatch({type: 'PRODUCT_CODE_NOT_SET'})
            return
        }
        const kwargs = {
            url: `/api/cross_reference/getProductInsight/?product_code=${this.props.product_code}&${this.props.records_to_fetch}`,
            successType: 'PRODUCT_INSIGHT_SUCCESS',
            errorType: 'PRODUCT_INSIGHT_REJECTED',

        }

        this.props.dispatch(getSingleItemDispatch(kwargs))
    }

    setFilters(source, e){
        console.log("Source --> ", source)
        console.log("Event value --> ", e.target.value)
        switch(source){
            case 'product_code':
            {
                console.log("Set product code")
                this.props.dispatch({type:'SET_PRODUCT_CODE', payload: e.target.value})
                break
            }
            case 'records_limit':{
                console.log("Setting limit of records")
                const new_limit = parseInt(e.target.value)
                if (isNaN(new_limit)){
                    this.props.dispatch({type:'IS_NAN', payload: e.target.value})
                    return
                }

                if(new_limit>this.props.records_limit){
                    this.props.dispatch({type:'TOO_MANY_RECORDS', payload: new_limit})
                }

                this.props.dispatch({type:'SET_RECORDS_TO_FECTH', payload: new_limit})
                
                break
            }
            default:
            {
                console.log("Action not supported")
            }
        }
    }


    buildPriceChart(){
        const data = this.props.product_insight
        if(data === null){
            return {}
        }
        const labels = data.price_series.cost.map(item=>{
            return item.date
        })

        //build all the price related data sets
        const cost_set_values = data.price_series.cost.map(item=>{
            return item.cost
        })

        const price1_set_values = data.price_series.price1.map(item=>{
            return item.price1
        })

        const price2_set_values = data.price_series.price2.map(item=>{
            return item.price2
        })

        const price3_set_values = data.price_series.price3.map(item=>{
            return item.price3
        })

        return {
            labels: labels,
            datasets: [
                {
                    label: 'Costo',
                    data: cost_set_values
                },
                {
                    label: 'Precio 1',
                    data: price1_set_values
                },
                {
                    label: 'Precio 2',
                    data: price2_set_values
                },
                {
                    label: 'Precio 3',
                    data: price3_set_values
                }
            ]
        }
    }

    render(){

        const prices_chart_data = this.buildPriceChart()
        return <div>
            <div className='cross-header'>
                <h1>Información de precios</h1>
                <label>Código producto</label>
                <input name='product-code' onChange={this.setFilters.bind(this, 'product_code')}
                value={this.props.product_code}
                type='text' className='form-control' 
                />
                
                <label>Cantidad registros</label>
                <input name='product-code' onChange={this.setFilters.bind(this, 'records_limit')}
                type='text' className='form-control'
                value={this.props.records_to_fetch} 
                 />

                <button onClick={this.fetchProductInsight.bind(this, false)}
                className='form-control btn-primary'>
                    Obtener Datos
                </button>
            </div>

            <General_Chart chart_data={prices_chart_data}/>
        </div>
    }
}