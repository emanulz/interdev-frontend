import React from 'react'
import {connect} from 'react-redux'

@connect(store=>{
    return {
    }
})
export default class Home extends React.Component {


    componentWillMount() {
        this.props.dispatch({type: 'HOME_PANEL_MOUNTED', payload: ''})
    }

    render() {
        return <div className='Main heigh100' >
            Cuentas por Pagar Home!
        </div>
    }

}