import React from 'react'
import {connect} from 'react-redux'

@connect(store=>{
    return {
        work_order: store.workorder.work_order,
        company: store.config.company
        
    }
})

export default class Header extends React.Component {
    
    render(){
        const headerText =  'Recibo Orden de Trabajo'
        const headerName = this.props.company.comercialName || 'Nombre de la Empresa'
        const headerName2 = this.props.company.legalName || 'Nombre legal Empresa'

        const tels =  this.props.company.telephones || '506-9999/506-8888'
        const telsText = tels.split('/').length > 1 ? `Tels: ${tels}` : `Tel: ${tels}`

        const idType = this.props.company.idType || ''
        const id = this.props.company.id || 'PERSON'
        const idText = idType == 'JURIDI' ? `Céd Jurid No ${id}` : `Céd No ${id}`


        return <div>
            <div className='compact-receipt-header'>
                <div className='compact-receipt-header-info'>
                    <h2>{headerName}</h2>
                    <h3>{headerName2}</h3>
                    <h3>{idText}</h3>
                    <h3>{this.props.company.address1 || 'Dirección 1'}</h3>
                    <h3>{this.props.company.address2 || 'Dirección 2'}</h3>
                    <h3>{this.props.company.country || 'País'}</h3>
                    <h3>{telsText}</h3>
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