import React from 'react'
import {connect} from 'react-redux'
import {formatDateTime } from '../../../../../../utils/formatDate'

@connect(store =>{
    return{
        requestList: store.transactionsList.partsRequestList,  
        laborList: store.transactionsList.laborList,
        work_order: store.workshopview.work_order,
    }
})

export default class WarrantyBodyBD extends React.Component{

    render(){
        const wo = this.props.work_order
        const date = formatDateTime(new Date())
        const client = wo.client ? `${wo.client.code} - ${wo.client.name} ${wo.client.last_name}`
        :'00-Cliente Contado'

        const id = wo.consecutive ? wo.consecutive : '0001'
        const base_class = 'compact-warrantyBD-data-field'

        let order_elements =  this.buildOrderTypeData(wo)

        return <div className ='compact-warrantyBD'>
            <div className={base_class}>
                <span className={base_class + "-label"}>Fecha:</span>
                <span className={base_class + "-value"}>{date}</span>
            </div>
            <div className={base_class}>
                <span className={base_class + "-label"}>Orden:</span>
                <span className={base_class + "-value"}>{id}</span>
            </div>
            <div className={base_class} >
                <span className={base_class + "-label"}>Cliente:</span>
                <span className={base_class + "-value"}>{client}</span>
            </div>
            {order_elements}

            <div className='compact-receipt-separator'>
                <span/>
                    <h2>Artículo</h2>
                <span/>
            </div>
            {this.buildArticleInfo(wo)}

            <div className='compact-receipt-separator'>
                <span/>
                    <h2>Observaciones</h2>
                <span/>
            </div>

            {this.buildObservations(wo)}
            <div className='compact-receipt-separator'>
                <span/>
                    <h2>Fallas</h2>
                <span/>
            </div>
            {this.buildArticleMalfunctions(wo)}

            <div className='compact-receipt-separator'>
                <span/>
                    <h2>Requisiciones</h2>
                <span/>
            </div>
            {this.buildPartRequestInfo()}

            <div className='compact-receipt-separator'>
                <span/>
                    <h2>Mano de Obra</h2>
                <span/>
            </div>

            {this.buildLaborInfo()}

            <div className='compact-receipt-separator'>
                <span/>
                    <h2>Final de Boleta</h2>
                <span/>
            </div>

        </div>
    }

    buildObservations(order){
        const base_class='compact-receipt-data-field'
        const observations = order.observations_list.map((a, index)=>{
            return <div key={index} className={base_class+'-observation'} >
                {a.value}
            </div>
        })
        return <div>
            {observations}
        </div>
    }

    buildLaborInfo(){
        const base_class='compact-receipt-data-field'
        const labor_items = this.props.laborList.map(a=>{
            return this.buildSimpleDataRow(base_class, '', a.element.description)
        })
        return <div>
            {labor_items}
        </div>
    }

    buildPartRequestInfo(){

        const items = this.props.requestList.map((item) => {
      
            return <div className='compact-invoice-table-body-item' key={item.id}>
              <div className='compact-invoice-table-body-item-description'>
                {item.element.description}
              </div>
              <div className='compact-invoice-table-body-item-data'>
                <div className='compact-invoice-table-body-item-data-qty'>
                  {item.qty}
                </div>
                <div className='compact-invoice-table-body-item-data-code'>
                  {item.element.code}
                </div>
              </div>
            </div>
          })

          return <div className='compact-invoice-table'>
          <div className='compact-invoice-table-header'>
            <div className='compact-invoice-table-header-qty'>Cant</div>
            <div className='compact-invoice-table-header-code'>Código</div>
          </div>
          <div className='compact-invoice-table-body'>
            {items}
          </div>
    
        </div>

    }

    buildArticleInfo(order){

        const base_class='compact-receipt-data-field'
        return <div>
            {this.buildSimpleDataRow(base_class, 'Marca', order.article_brand)}
            {this.buildSimpleDataRow(base_class, 'Tipo', order.article_type)}
            {this.buildSimpleDataRow(base_class, 'Color', order.article_color)}
            {this.buildSimpleDataRow(base_class, 'Modelo', order.article_model)}
            {this.buildSimpleDataRow(base_class, 'Núm. Serie', order.article_serial)}
        </div>
    }

    buildSimpleDataRow(base_class, label, value){
        if(value === undefined || value == ''){return ''}
        const join_char = label==''?'':':'
        return <div className={base_class} >
                <span className={base_class + "-label"}>{label+join_char}</span>
                <span className={base_class + "-value"}>{value}</span>
            </div>
    }

    buildArticleMalfunctions(order){
        const base_class='compact-receipt-data-field'
        const observations = order.malfunction_details.map((a, index)=>{
            return <div key={index} className={base_class+'-malfunction'} >
                {a.value}
            </div>
        })
        return <div>
            {observations}
        </div>
    }


    buildOrderTypeData(order){
        const base_class='compact-warrantyBD-data-field'
        const type ='Tipo Reparación:'
        if(order.is_warranty){
            if(order.warranty_number_bd !== undefined && order.warranty_number_bd !== ''){
                return <div>
                    <div className={base_class} >
                        <span className={base_class + "-label"}>{type}</span>
                        <span className={base_class + "-value"}>{'Garantía B&D'}</span>
                    </div>
                    <div className={base_class} >
                        <span className={base_class + "-label"}>{'# Garantía B&D'}</span>
                        <span className={base_class + "-value"}>{order.warranty_number_bd}</span>
                    </div>
                    <div className={base_class} >
                        <span className={base_class + "-label"}>{'Distribuidor'}</span>
                        <span className={base_class + "-value"}>{order.warranty_supplier_name}</span>
                    </div>
                    <div className={base_class} >
                        <span className={base_class + "-label"}>{'Fecha Factura'}</span>
                        <span className={base_class + "-value"}>{order.warranty_invoice_date}</span>
                    </div>
                    <div className={base_class} >
                        <span className={base_class + "-label"}>{'# Factura Venta'}</span>
                        <span className={base_class + "-value"}>{order.warranty_invoice_number}</span>
                    </div>

                </div>
            }else{
                return <div className={base_class} >
                    <span className={base_class + "-label"}>{type}</span>
                    <span className={base_class + "-value"}>Garantía</span>
                </div>
            }
        }
        return <div className={base_class} >
            <span className={base_class + "-label"}>Tipo:</span>
            <span className={base_class + "-value"}>Ordinaria</span>
        </div>
    }

}