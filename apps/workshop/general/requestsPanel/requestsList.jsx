import React from 'react'
import {connect} from 'react-redux'
import {formatDateTimeAmPm} from '../../../../utils/formatDate.js'
import alertify from 'alertifyjs'

@connect(store => {
    return{
        isVisible: store.requestPanel.isVisible,
        requestsGroups: store.requestPanel.requestsGroups,
        requestList: store.transactionsList.partsRequestList,
    }
})
export default class RequestsGroupPanel extends React.Component {

    componentWillMount() {
        this.props.dispatch({type: 'CLEAR_REQUESTS_GROUP'})
    }

    hidePanel(){
        this.props.dispatch({type: 'HIDE_REQUESTS_PANEL'})
    }

    showPartRequestPrintPanel(requestConsecutive, e){
        parts_requests = this.props.requestList
    }

    printPartRequestGroup(consecutive, e){
        this.props.dispatch({type:'SET_SELECTED_GROUP', payload:consecutive})
        this.props.dispatch({type:'SET_RECEIPT_TO_PRINT', payload: 'part_request_receipt'})
        this.props.dispatch({type:'SHOW_RECEIPT_PANEL'})

    }

    render(){
        const isVisible = (this.props.isVisible)
        ? 'partsrequest-panel is-visible'
        : 'partsrequest-panel'
        const filteredRequests = this.props.requestsGroups.filter(a=>{

            const index = this.props.requestList.findIndex(b=>b.part_request_group == a.consecutive)
            return index == -1 ? false:true

        })
        const itemsToRender = filteredRequests.map(a=>{
            //check if there is at least one part request associated with this group

            const consecutive = a.consecutive
            const user = JSON.parse(a.user)
            return <tr key={consecutive}>
                <td className='loadRow' onClick={this.printPartRequestGroup.bind(this, a.consecutive)} className='fa fa-print'> </td>
                <td>{consecutive}</td>
                <td>{user.first_name} {user.last_name}</td>
                <td>{`${formatDateTimeAmPm(a.created)}`}</td>
            </tr>
        })
        return <div className={isVisible}>
            <div className='partsrequest-panel-header'>
                IMPRIMIR REQUISICIONES DE PARTES
                <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
            </div>
            <div className='partsrequest-panel-container'>
                <div className='col-xs-12'>
                <table className='table'>
                    <thead>
                    <tr>
                        <td>Imprimir</td>
                        <td>#</td>
                        <td>Responsable</td>
                        <td>Fecha</td>
                    </tr>
                    </thead>
                    <tbody>
                    {itemsToRender}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    }

}