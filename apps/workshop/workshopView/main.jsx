import React from 'react'
import {connect} from 'react-redux'
import Client from '../general/clients/clients.jsx'
import PartsProvider from './partsProvider/main.jsx'
import TransactionsList from './transactionsList/main.jsx'

@connect((store)=>{
    return{
        
    }
})

export default class WorkshopView extends React.Component {

    componentWillMount(){}


    componentWillUpdate(){}

    render(){
        return <div className="workshop-view-container" >
            <div className="form-container">
                <div className="row first ">

                    <div className="col-sm-6 first">
                        <PartsProvider/>
                        <TransactionsList/>
                    </div>

                    <div className="col-sm-6 second">
                        <PartsProvider/>
                    </div>
                    
                </div>

            </div>           
        </div>
    }
}
