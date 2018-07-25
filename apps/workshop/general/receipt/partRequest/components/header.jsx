import React from 'react'
import {connect} from 'react-redux'

@connect(store=>{
    return {
        company: store.config.company,
        selectedGroup: store.requestPanel.selectedGroup,
        work_order: store.workshopview.work_order,
    }
})

export default class Header extends React.Component {

    render(){
        const headerText =  `Requisicion # ${this.props.selectedGroup}`
        const headerName = this.props.company.comercial_name || 'Nombre de la Empresa'
        const headerName2 = this.props.company.legal_name || 'Nombre legal Empresa'

        const tels =  this.props.company.telephones || '506-9999/506-8888'
        const telsText = tels.split('/').length > 1 ? `Tels: ${tels}` : `Tel: ${tels}`

        return <div>
            <div className='compact-receipt-header'>
                <div className='compact-receipt-header-info'>
                    <h2>{headerName}</h2>
                    <h3>{headerName2}</h3>
                    <h3>{this.props.company.address1 || 'Dirección 1'}</h3>
                    <h3>{this.props.company.address2 || 'Dirección 2'}</h3>
                    <h3>{this.props.company.country || 'País'}</h3>
                    <h3>{telsText}</h3>
                    <h2>{`Orden de Trabajo # ${this.props.work_order.consecutive}`}</h2>
                </div>
            </div>

            <div className='compact-receipt-separator'>
                <span/>
                    <h1>{headerText}</h1>
                <span/>

            </div>
        </div>
    }
}