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

    }
})
class CreateWorkOrderButtons extends React.Component {

    showReceipt(){
        this.props.dispatch({type: 'SHOW_RECEIPT_PANEL'})
    }

    saveWorkOrder(redirect){
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
                successMessage: 'Orden de trabajo creada Correctamente',
                errorMessage: 'Hubo un error al crear la orden de trabajo, intente de nuevo.',
                dispatchType: 'CLEAR_WORK_ORDER',
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
        const buttons = <div className="col-xs-12 row form-buttons-container-row">
            <div className='col-xs-12 col-sm-4'>
                <button onClick={this.saveWorkOrder.bind(this, true)}
                className='form-buttons-container-save form-control btn-success'>
                    Crear Orden de Trabajo
                </button>
            </div>
            <div className='col-xs-12 col-sm-4'>
                <button onClick={this.showReceipt.bind(this)}
                className='form-buttons-container-save form-control btn-success'>
                    Mostrar Recibo
                </button>
            </div>

        </div>

        return <div className='form-buttons-container'>
            {buttons}
        </div>
    }

}
// EXPORT THE CLASS WITH ROUTER
export default withRouter(CreateWorkOrderButtons)
