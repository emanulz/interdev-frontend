import React from 'react'
import {connect} from 'react-redux'

@connect(store =>{
    return {
        user: store.pin.user, 
        profile: store.pin.profile,
        selectedCase: store.pin.selectedCase
    }
})
export default class PinAction extends React.Component {

    
    callActionMethod(){
        
        //check if the case has already kwargs, if not create a kwarg object
        let kwargs = {}
        if(this.props.selectedCase.kwargs){
            kwargs = this.props.selectedCase.kwargs
        }

        if(this.props.selectedCase.insert_user){
            kwargs['user_id'] = this.props.user.id 
        }

        //dispatch the method passing on the kwargs
        this.props.selectedCase.method(kwargs)
        this.props.dispatch({type: 'CLEAR_PIN_USER'})
        this.props.dispatch({type: 'CLEAR_PIN_USER_PROFILE'})
        this.props.dispatch({type:'HIDE_PIN_PANEL'})
    }

    render(){

        const user_selected = this.props.profile.id ? false:true
        console.log("User selected ", user_selected)
        const actionHeader = this.props.selectedCase.actionHeader
            ? this.props.selectedCase.actionHeader
            : 'Acción'

        const actionDescription = this.props.selectedCase.actionDescription
            ? this.props.selectedCase.actionDescription
            : 'Ejecutar acción?'

        const dispatchButtonIcon = this.props.selectedCase.dispatchButtonIcon
            ? <span><i className={this.props.selectedCase.dispatchButtonIcon}/></span>
            : ''
        return  <div className="pin-side-body">
        
            <div className="pin-side-body-header">
                <span>{actionHeader}</span>
            </div>        

            <div className="pin-side-body-content">
                <p>{actionDescription}</p>
                <button
                    disabled={user_selected}
                    className='btn btn-default tag-button' onClick={this.callActionMethod.bind(this)}>
                    {this.props.selectedCase.dispatchButtonText}
                    {dispatchButtonIcon}
                </button>
            </div>

        </div>
    }
}