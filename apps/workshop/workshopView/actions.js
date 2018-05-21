import {createLaborMovement, createCashAdvance, patchLaborMovement, patchCashAdvanceMovement,
    patchUsedPartMovement, createUsedPart} from '../general/actions'
import axios from 'axios'
import {saveLog} from '../../../utils/api'
let inspect = require('util-inspect')

export function saveInventoryTransactions(work_order_id, parts_request_list, user){
    console.log('Parts request transactions save')
    const url_movements = '/api/inventorymovements/'
    const url_warehouses = '/api/warehouses/'
    const logCodeCreate = 'WORKSHOP_REQUEST'
    const descriptionCreate = 'WORKSHOP_CREATE'

    const workshop_warehouse_id = "044273d4-43fb-4dad-87bf-c2c4e3d7b727"
    const main_warehouse_id = "17f9c37c-bf6a-4d43-acea-7d4b2d0f5116"
    const warehouse_promises = [axios.get(`${url_warehouses}${main_warehouse_id}`),
                                axios.get(`${url_warehouses}${workshop_warehouse_id}`)]

    Promise.all(warehouse_promises).then(results=>{
        let promises_save = []
        console.log('Results warehouse data --> ' + inspect(results.data))
        for (part of parts_request_list){
            if(part.saved === false){
                //do not allow patch
                const user_string = JSON.stringify(user)
                
            }
        }
        return promises_save
    })


}

export function saveUsedPartTransactions(work_order_id, used_list, used_list_old,
                                        user){

        const url = '/api/usedparts/'
        const logCodeCreate = 'USED_PART_CREATE'
        const logCodeUpdate = 'USED_PART_UPDATE'
        const descriptionCreate = 'USED_PART_CREATE'
        const descriptionUpdate = 'USED_PART_UPDATE'
    
        let promises_save = []
        let promises_patch = []
        for (let part of used_list){
            if(part.saved === false){
                if(part.element.work_order_id !== undefined && part.element.work_order_id !== ''){
                    const index_old = used_list_old.findIndex(a=>a.element.id === part.element.id)
                    promises_patch.push(
                        patchUsedPartMovement(used_list_old[index_old], part, user)
                    )
                }else{
                    const user_string = JSON.stringify(user)
                    promises_save.push(
                        createUsedPart(work_order_id, part.element.amount, part.element.description, user_string)
                                                                )
                }
            }
        }
        return [
            {promises: promises_save, dispatch:'USED_PART_MOVEMENTS_CREATED'}, 
            {promises: promises_patch, dispatch: 'USED_PART_MOVEMENTS_PATCHED'}
        ]
    }

export function saveCashAdvanceTransactions(work_order_id, cash_list, cash_list_old, 
                                            user, client, dispatcher){
    console.log("Cash advance saver method")
    const url = '/api/cashadvances/'
    const logCodeCreate = 'CASH_ADVANCE_CREATE'
    const logCodeUpdate = 'CASH_ADVANCE_UPDATE'
    const descriptionCreate = 'CASH_ADVANCE_CREATE'
    const descriptionUpdate = 'CASH_ADVANCE_UPDATE'

    let promises_save = []
    let promises_patch = []

    for (let advance of cash_list){
        if(advance.saved === false){
            if(advance.element.work_order_id !== undefined && advance.element.work_order_id !== ''){
                console.log('patch advance')
                const index_old = cash_list_old.findIndex(a=>a.element.id === advance.element.id)
                promises_patch.push(
                    patchCashAdvanceMovement(cash_list_old[index_old], advance, user)
                )
            }else{
                const user_string = JSON.stringify(user)
                promises_save.push(
                    createCashAdvance(work_order_id, advance.element.amount, JSON.stringify(client),
                                        JSON.stringify(user), advance.element.description, '' )
                )
            }
        }
    }
    return [
        {promises: promises_save, dispatch:'CASH_ADVANCE_MOVEMENTS_CREATED'}, 
        {promises: promises_patch, dispatch: 'CASH_ADVANCE_MOVEMENTS_PATCHED'}
    ]
}

//work_order_id, advance_amount, client, user, advance_description, sale_id

export function saveLaborTransactions(work_order_id, labor_list, labor_list_old, user, dispatcher){
    const url = '/api/labor/'
    const logCodeCreate = 'LABOR_CREATE'
    const logCodeUpdate = 'LABOR_UPDATE'
    const descriptionCreate = 'Creación nueva entrada mano de obra'
    const descriptionUpdate = 'Actualización entrada mano de obra'

    let promises_save = []
    let promises_patch = []
    //if a labor object already has an id, it already exists on the db and must be patched
    for (let labor of labor_list){
        if(labor.saved===false){//only saved if the items has been changed
            if(labor.element.work_order_id !== undefined && labor.element.work_order_id !== ''){
                //patch item
                //find index in labor old
                const index_old = labor_list_old.findIndex(a=>a.element.id === labor.element.id)
                promises_patch.push(
                    patchLaborMovement(labor_list_old[index_old], labor, user)
                )

            }else{
                //create new item
                const user_string = JSON.stringify(user)
                promises_save.push(
                    createLaborMovement(work_order_id, labor.element.amount,
                                        labor.element.description, user_string)
                )
            }
        }
    }

    return [
        {promises: promises_save, dispatch:'LABOR_MOVEMENTS_CREATED'}, 
        {promises: promises_patch, dispatch:'LABOR_MOVEMENTS_PATCHED'}
    ]
}

export function openCloseWorkOrder(kwargs){
    const work_order_id = kwargs.work_order_id
    const new_status = kwargs.new_status
    const old_order = kwargs.old_order
    const new_order = kwargs.new_order

    const Kwargs = {
        work_order_id:work_order_id,
        new_status:new_status,
        old_order: old_order,
        new_order: new_order,
        user: kwargs.user
    }
    return workOrderStatusChanges(Kwargs)

}

export function setPaidWorkOrder(kwargs){
    const work_order_id = kwargs.work_order_id
    const paid_status = kwargs.paid_status
    const old_order = kwargs.old
    const new_order = kwargs.new

    const Kwargs = {
        work_order_id:work_order_id,
        paid_status:paid_status,
        old_order: old_order,
        new_order: new_order,
        user:kwargs.user
    }
    return workOrderStatusChanges(Kwargs)

}

function workOrderStatusChanges(kwargs){

    const work_order_id = kwargs.work_order_id
    const new_status = kwargs.new_status
    const paid_status = kwargs.paid_status
    const old_order = kwargs.old_order
    const new_order = kwargs.new_order
    const user = kwargs.user

    const url = `/api/workorders/${work_order_id}/`
    const logModel= 'WORK_ORDER'

    let logCode=''
    let logDescription = ''
    let description = ''

    let patch_data = {}
    if(new_status!==undefined){
        logCode = 'WORK_ORDER_OPEN_PATCH'
        logDescription = `Work order status changed to ${new_status?'CERADA':'ABIERTA'}`
        description = `Work order status changed to ${new_status?'CERADA':'ABIERTA'}`
        patch_data.is_closed = new_status
    }else{
        logCode = 'WORK_ORDER_PAID_PATCH'
        logDescription = `Work order paid changed to ${paid_status?'PAGADA':'PENDIENTE'}`
        description = `Work order status changed to ${paid_status?'PAGADA':'PENDIENTE'}`
        patch_data.paid = paid_status
    }
    return new Promise((resolve, reject)=>{
        axios({
            method: 'patch',
            url:url,
            data:patch_data
        }).then(response=>{
            console.log("Saved")
            saveLog(logCode, logModel, old_order, new_order, logDescription, user)
            console.log("About to resolve")
            resolve(response.data)
        }).catch(err=>{
            console.log(err)
            if(err.response){
                //console.log(err.response.data)
            }
            const message = new_status? `Error cerrando orden de trabajo ${work_order_id}`:`Error actualizando estado de pago de orden${work_order_id}`
            alertify.alert('Error', message)
            reject(err)   
        })
    })

}