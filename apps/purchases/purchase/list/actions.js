import {formatDate} from '../../../../utils/formatDate'

export function makeTableFriendly(purchases){
    const pay_map = {
        'CASH': 'Efectivo',
        'CARD': 'Tarjeta',
        'CRED': 'Crédito'
    }
    const prettyPurchases = purchases.map((p, i)=>{
        let supplier = undefined
        try{
            supplier = JSON.parse(p.supplier)
        }
        catch(err) {
            supplier = ''
        }
        
        const pretty = {
            id: p.id,
            consecutive: p.consecutive,
            supplier_name: supplier.name ? supplier.name : 'Pendiente Ingreso',
            payed: p.balance > 0.1 ? false : true,
            pay_type: pay_map[p.pay_type],
            invoice_date: p.invoice_date,
            invoice_number: p.invoice_number,
            purchase_total: p.purchase_total
        }
        return pretty
    })
    return prettyPurchases
}