import {createLaborMovement, createCashAdvance} from '../general/actions'
let inspect = require('util-inspect')

export function saveCashAdvanceTransactions(work_order_id, cash_list, user, client, dispatcher){
    console.log("Cash advance saver method")
    const url = '/api/cashadvances/'
    const logCodeCreate = 'CASH_ADVANCE_CREATE'
    const logCodeUpdate = 'CASH_ADVANCE_UPDATE'
    const descriptionCreate = 'CASH_ADVANCE_CREATE'
    const descriptionUpdate = 'CASH_ADVANCE_UPDATE'

    let promises = []

    for (let advance of cash_list){
        if(advance.saved === false){
            if(advance.element.work_order_id !== undefined && advance.element.work_order_id !== ''){
                console.log('patch advance')
            }else{
                const user_string = JSON.stringify(user)
                promises.push(
                    createCashAdvance(work_order_id, advance.element.amount, JSON.stringify(client),
                                        JSON.stringify(user), advance.element.description, '' )
                )
            }
        }
    }

    if(promises.length>0){
        Promise.all(promises).then(values=>{
            dispatcher({type:'CASH_ADVANCE_MOVEMENTS_CREATED', payload:values})
        })
    }
    return
}

//work_order_id, advance_amount, client, user, advance_description, sale_id

export function saveLaborTransactions(work_order_id, labor_list, user, dispatcher){
    console.log("Labor saver method")
    const url = '/api/labor/'
    const logCodeCreate = 'LABOR_CREATE'
    const logCodeUpdate = 'LABOR_UPDATE'
    const descriptionCreate = 'Creación nueva entrada mano de obra'
    const descriptionUpdate = 'Actualización entrada mano de obra'


    let promises = []
    //if a labor object already has an id, it already exists on the db and must be patched
    for (let labor of labor_list){
        if(labor.saved===false){//only saved if the items has been changed
            if(labor.element.work_order_id !== undefined && labor.element.work_order_id !== ''){
                //patch item
                console.log("Patch existent Labor")
            }else{
                //create new item
                const user_string = JSON.stringify(user)
                promises.push(
                    createLaborMovement(work_order_id, labor.element.amount,
                                        labor.element.description, user_string)
                )
            }
        }
    }
    if(promises.length>0){
        Promise.all(promises).then(values=>{
            dispatcher({type:'LABOR_MOVEMENTS_CREATED', payload:values})
        })
    }
    return
}