import alertify from 'alertifyjs'
let inspect = require('util-inspect')

export function updateLaborOrCashAdvanceRow(item, e, list){

    const index = list.findIndex(a=>a.uuid === item.uuid)
    switch(item.type)
    {
        case 'LABOR':
        {
            console.log("UPDATE LABOR LINE")
            const newItem = JSON.parse(JSON.stringify(item))
            newItem.saved = false
            newItem.element.description = e.target.value
            return {type:'LABOR_UPDATED', payload:{'item':newItem, 'index':index}}
        }

        case 'CASH_ADVANCE':
        {
            console.log('UPDATE CAHS ADVANCE LINE')
            const newItem = JSON.parse(JSON.stringify(item))
            newItem.saved = false
            newItem.element.description = e.target.value
            return {type:'CASH_ADVANCE_UPDATED', payload:{'item':newItem, 'index':index}}
        }

    }
}
