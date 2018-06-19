import React from 'react'
import {connect} from 'react-redux'
import {formatDate} from '../../../../../../utils/formatDate'

@connect(store=>{
    return {
        work_order: store.workshopview.work_order,
        work_order_creation: store.workorder.work_order,
        transactions: store.transactionsList,
    }
})
export default class ReceiptData extends React.Component {

    render(){
        const use_create_work_order = this.props.work_order.id === "000000" ? true : false
        const order = use_create_work_order? this.props.work_order_creation: this.props.work_order
        const date =  formatDate(order.created)

        const client = order.client ? `${order.client.code} - ${order.client.name} ${order.client.last_name}`
        :'00-Cliente Contado'

        const id = order.consecutive ? order.consecutive : '0001'
        const base_class = 'compact-receipt-data-field'

        let order_elements = this.buildOrderTypeData(order)

        return <div className='compact-receipt-data'>
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

            {this.buildArticleInfo(order)}

            <div className='compact-receipt-separator'>
                <span/>
                    <h2>Observaciones</h2>
                <span/>
            </div>
            {this.buildObservations(order)}
            <div className='compact-receipt-separator'>
                <span/>
                    <h2>Fallas</h2>
                <span/>
            </div>
            {this.buildArticleMalfunctions(order)}
            <div className='compact-receipt-separator'>
                <span/>
                    <h2>Adelantos </h2>
                <span/>
                
            </div>
            {this.buildArticleCashAdvances(use_create_work_order, order)}
        </div>
    }

    buildArticleCashAdvances(use_create_work_order, work_order){
        const base_class = 'compact-receipt-data-field'
        if(use_create_work_order){
            return <div className={base_class+"-cashadvance"} key={'-1'} >
            {`${"Adelanto en recepción"} ₡ ${parseFloat(work_order.cash_advance).formatMoney(2, ',', '.')}`}
        </div>
        }else{
            const cash_advances = this.props.transactions.cashAdvanceList.map((a, index)=>{
                return <div className={base_class+"-cashadvance"} key={index} >
                    {`${a.element.description} ₡ ${parseFloat(a.element.amount).formatMoney(2, ',', '.')}`}
                </div>
            })
            return cash_advances
        }

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
        return <div className={base_class} >
                <span className={base_class + "-label"}>{label+':'}</span>
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
        const base_class='compact-receipt-data-field'
        const type ='Tipo Reparación:'
        if(order.is_warranty){
            if(order.warranty_number_bd !== undefined && order.warranty_number_bd !== ''){
                return <div>
                    <div className={base_class} >
                        <span className={base_class + "-label"}>{type}</span>
                        <span className={base_class + "-value"}>{'Garantía B&D'}</span>
                    </div>
                    <div className={base_class} >
                        <span className={base_class + "-label"}>{type}</span>
                        <span className={base_class + "-value"}>{order.warranty_number_bd}</span>
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