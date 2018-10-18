import React from 'react'
import {connect} from 'react-redux'

import Content from './content/content.jsx'
import Aside from './aside/aside.jsx'
import Currency from '../../../general/currency/currency.jsx'
import {getSingleItemDispatch} from '../../../utils/api.js'

@connect((store) => {
    return {
    }
  })
export default class NotesBuilder extends React.Component {


    componentWillMount(){
        console.log("Sale number ", this.props.match.params.sale)
        
        this.props.dispatch({type: 'FETCHING_STARTED'})
        this.props.dispatch({type: 'SET_SALE_CONSECUTIVE', payload: this.props.match.params.sale})

        //dispatch the fetching of the sale and electronic doc objects
        const sale_kwargs = {
            url: `/api/saleslist/?consecutive=${this.props.match.params.sale}`,
            successType: 'FETCH_SALE_DATA_FULFILLED',
            errorType: 'FETCH_SALE_DATA_REJECTED'
        }
        this.props.dispatch(getSingleItemDispatch(sale_kwargs))

        const elec_kwargs = {
            url: `/api/saleslist/?consecutive=${this.props.match.params.sale}`,
            successType: 'FETCH_SALE_DATA_FULFILLED',
            errorType: 'FETCH_SALE_DATA_REJECTED'
        }
    }

    render() {
        return <div className='sale'>
            <Currency />
            <Content />
            <Aside /> 
        </div>
    }
}