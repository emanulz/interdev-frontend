import React from 'react'
import {connect} from 'react-redux'
const Mousetrap = require('mousetrap')

import Profile from './components/profile.jsx'
import SetUser  from './components/setUser.jsx'
import PinAction from './components/actionComponent.jsx'

@connect(store =>{
    return {
        isVisible: store.pin.isVisible,
        selectedCase: store.pin.selectedCase
    }
})
export default class PinPanel extends React.Component {

    componentWillMount() {

        Mousetrap.bind('esc', e=>{

            if(e.preventDefault){
                e.preventDefault()
            }else{
                e.returnValue = false
            }

            this.props.dispatch({type: 'HIDE_PIN_PANEL'})
        })

    }

    componentWillReceiveProps(nextProps){
        if(nextProps.isVisible && this.props.isVisible===false){
            //focus on the code input
            document.getElementById('pin-pin').focus()
        }
    }

    hidePanel(){
        this.props.dispatch({type: 'HIDE_PIN_PANEL'})
    }

    render(){
        
        const isVisible = this.props.isVisible
            ? 'pin-panel is-visible'
            : 'pin-panel'

        
        return <div className={isVisible}>

            <div className="pin-panel-main">
                <div className="pin-panel-header">
                    {this.props.selectedCase.headerText}
                    <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
                
                </div>

                <Profile />
                <div className="pin-area-container">
                
                    <SetUser />
                    <PinAction />
                
                </div>
            </div>
        </div>

    }
}