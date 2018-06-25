import React from 'react'
import alertify from 'alertifyjs'
import {connect} from 'react-redux'
import {checkWorkOrder, cleanWorkOrder, createWorkOrder} from '../../actions'
import { withRouter } from 'react-router-dom'

@connect((store)=>{
    return {
        work_order : store.workorder.work_order,
        user: store.user.user,
        client: store.clients.clientSelected,
        cashadvance: store.workorder.cash_advance,
        request_saved: store.workorder.request_saved,
        is_edit: store.workorder.is_edit,

    }
})
class CreateWorkOrderButtons extends React.Component {

    showReceipt(){
        if(!this.props.request_saved && !this.props.is_edit){
            this.props.dispatch({type: 'CANT_PRINT_UNSAVED'})
            return
        }
        this.props.dispatch({type:'SET_RECEIPT_TO_PRINT', payload: 'reception_receipt'})
        this.props.dispatch({type: 'SHOW_RECEIPT_PANEL'})
    }

    patchWorkOrder(){
        let work_order = JSON.parse(JSON.stringify(cleanWorkOrder(this.props.work_order)))
        work_order.client_id = this.props.client.id
        work_order.cash_advance = this.props.cashadvance

        //check the work_order object before saving it
        const work_order_ok = checkWorkOrder(work_order)
        //stringify array objects before saving
        work_order.observations_list = JSON.stringify(work_order.observations_list)
        work_order.malfunction_details = JSON.stringify(work_order.malfunction_details)

        if(work_order_ok){
            const kwargs = {
                url: `/api/workorders/${work_order.id}/patch_workorder/`,
                method: 'patch',
                item: work_order,
                successMessage: 'Orden de trabajo creada Actualizada',
                errorMessage: 'Hubo un error al actualizar la orden de trabajo, intente de nuevo.',
                dispatchType: 'WORK_ORDER_EDIT_LOADED',
            }
            this.props.dispatch({type:'FETCHING_STARTED'})
            this.props.dispatch(createWorkOrder(kwargs))

        }
    }

    saveWorkOrder(redirect){
        if(this.props.request_saved){
            this.props.dispatch({type: 'ORDER_ALREADY_CREATED'})
            return
        }
        let work_order = JSON.parse(JSON.stringify(cleanWorkOrder(this.props.work_order)))
        work_order.client_id = this.props.client.id
        work_order.cash_advance = this.props.cashadvance
 
        //check the work_order object before saving it
        const work_order_ok = checkWorkOrder(work_order)
        //stringify array objects before saving
        work_order.observations_list = JSON.stringify(work_order.observations_list)
        work_order.malfunction_details = JSON.stringify(work_order.malfunction_details)

        if(work_order_ok){
            const kwargs = {
                url:'/api/workorders/',
                item : work_order,
                method: 'post',
                successMessage: 'Orden de trabajo creada Correctamente',
                errorMessage: 'Hubo un error al crear la orden de trabajo, intente de nuevo.',
                dispatchType: 'WORK_ORDER_CREATED',
            }

            if(redirect){
                kwargs.redirectUrl = '/workshop/workorder/list'
                kwargs.history = this.props.history
            }
            this.props.dispatch({type:'FETCHING_STARTED'})
            this.props.dispatch(createWorkOrder(kwargs))
        }
    }

    


    render(){

        const optional_button = this.props.is_edit
        ? 
            <div className='col-xs-12 col-sm-4'>
                <button onClick={this.patchWorkOrder.bind(this, true)}
                    className='form-buttons-container-save form-control btn-success'>
                    Actualizar Orden
                </button>
            </div>
        :
            <div className='col-xs-12 col-sm-4'>
                <button onClick={this.saveWorkOrder.bind(this, true)}
                    className='form-buttons-container-save form-control btn-success'>
                    Crear Orden de Trabajo
                </button>
            </div>
        const receipt_button = this.props.is_edit
        ? ''
        :
            <div className='col-xs-12 col-sm-4'>
                <button onClick={this.showReceipt.bind(this)}
                className='form-buttons-container-save form-control btn-success'>
                    Mostrar Recibo
                </button>
            </div>
        const buttons = <div className="col-xs-12 row form-buttons-container-row">
            {optional_button}
            {receipt_button}

        </div>

        return <div className='form-buttons-container'>
            {buttons}
        </div>
    }

}
// EXPORT THE CLASS WITH ROUTER
export default withRouter(CreateWorkOrderButtons)
