export function makeTableFriendly(data, header){
    const cloned_orders = JSON.parse(JSON.stringify(data))
    const pretty_orders = cloned_orders.map((item, index)=>{
        const pretty = {
            'date': item[0],
            'sale_subtotal': item[1],
            'sale_tax': item[2],
            'sale_total': item[3],
            'purchase_subtotal': item[4],
            'purchase_tax': item[5],
            'purchase_total': item[6]
        }
        return pretty
    })

    return pretty_orders
    
}