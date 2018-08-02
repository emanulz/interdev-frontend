import React from 'react'
import {connect} from 'react-redux'
import FormComponent from './form/form.jsx'
import Unauthorized from '../../../../general/unauthorized.jsx'
//import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs'

@connect(store=>{
    return {
        permissions: store.taxpayer.permissions
    }
})
export default class Create extends React.Component {


    render(){
        let content = ''
        switch(this.props.permissions.add){
            case true:
            {
                content= <FormComponent />
                break
            }
            case false:
            {
                content = <Unauthorized/>
                break
            }
            default:
            {
                content = <div/>
                break   
            }
        }

        return <div className="Form">
            {content}
        </div>

    }
}