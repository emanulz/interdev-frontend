import React from 'react'
import {connect} from 'react-redux'

import Select2 from 'react-select2-wrapper'


@connect(store=>{
    return {
        activeSupplier: store.suppliers.activeSupplier,
        supplierActivePurchasesWithDebt: store.unpaidPurchases.supplierActivePurchasesWithDebt
    }
})
export default class MakePayment extends React.Component {
    componentWillMount() {
        //clear the selected supplier
        this.props.dispatch({type:'CLEAR_ACTIVE_SUPPLIER'})
    }

    buildTableContent() {
        let key_val = 0
        const h_c = 'makePayment-grid-content-header'
        const b_c = 'makePayment-grid-content-body'

        const header_labels = ['Fact #', 'Fecha', 'Total', 'Deuda', 'Completa', 'Otro', 'Monto']

        const header = header_labels.map(item=>{
            let a = <div className={h_c} key={key_val} >{item}</div>
            key_val +=1
            return a
        })

        return header
    }

    render(){
        const old_debt = 5000
        const payment = 2000
        const new_debt = 3000

        return <div className='makePayment' >
                <div className='makePayment-grid'>
                    <div className="makePayment-grid-header">
                        <h1>Registrar Pago a Compras</h1>
                    </div>

                    <div className="makePayment-grid-sup">
                        <Select2
                            //data={clientsSelect}
                            //onSelect={this.selectClient.bind(this)}
                            //value={this.props.client.id}
                            className='form-control'
                            //onUnselect={this.unselectClient.bind(this)}
                            options={{
                            placeholder: 'Elija un proveedor...',
                            allowClear: true
                            }}
                        />
                    </div>

                    <div className="makePayment-grid-summary">
                        <div className="makePayment-grid-summary-left">
                            <div>Saldo Anterior:</div>
                            <div>Este Abono:</div>
                            <div>Saldo:</div>
                        </div>

                        <div className="makePayment-grid-summary-middle">
                            <div>{`₡ ${old_debt.formatMoney(2, ',', '.')}`}</div>
                            <div>{`₡ ${payment.formatMoney(2, ',', '.')}`}</div>
                            <div>{`₡ ${new_debt.formatMoney(2, ',', '.')}`}</div>
                        </div>

                        <div className="makePayment-grid-summary-right">
                            <button className='form-control'>
                                Registrar
                            </button>
                        </div>

                    </div>

                    <div className="makePayment-grid-content">
                    
                        {this.buildTableContent()}

                    </div>
                </div>
        </div>
    }
}