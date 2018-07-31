import React from 'react'
import {connect} from 'react-redux'
import PurchasesVrsSales from './reports/sales_vrs_purchases.jsx'

export default class GeneralReports extends React.Component {

    render(){
       return <PurchasesVrsSales />
    }
}