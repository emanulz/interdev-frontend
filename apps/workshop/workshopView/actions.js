import {createLaborMovement, createCashAdvance, patchLaborMovement, patchCashAdvanceMovement,
    patchUsedPartMovement, createUsedPart, createWorkshopInventoryMovement} from '../general/actions'
import axios from 'axios'
import {saveLog} from '../../../utils/api'
let inspect = require('util-inspect')

export function createPartRequest(work_order_id, employee, amount, product, id_move_workshop, id_move_origin){
    console.log("Creating part request")
    const url = '/api/partrequest/'
    const logCode = 'WORKORDER_PART_REQUEST_CREATED'
    const logDescription = 'Part request for work order --> ' +work_order_id
    const logModel = 'PART_REQUEST'
    const old = {noPrevious: 'Initial creation'}

    const data = {
        work_order_id:work_order_id,
        employee: employee, 
        amount: amount,
        product: product,
        id_movement_workshop: id_move_workshop,
        id_movement_origin: id_move_origin
    }
    return new Promise((resolve, reject)=>{
        axios({
            method: 'post',
            url:url,
            data:data
        }).then((response)=>{
            saveLog(logCode, logModel, old, data, logDescription, employee)
            resolve(response.data)
        }).catch(err=>{
            console.log(inspect(err))
            if(err.response){
                console.log(err.response.data)
            }
            alertify.alert('Error', `Error creando requisión de parte para orden de trabajo ${work_order_id}`)
            reject(err)
        })
    })
}

export function deleteInventoryTransactions(part_request, user){
    console.log('Delete part request')
    const url_movements = '/api/inventorymovements/'
    const url_warehouses = '/api/warehouses/'
    const logCodeCreate = 'WORKSHOP_PART_REQUEST'
    const descriptionCreate = 'WORKSHOP_CREATE_PART_REQUEST'
    
    const workshop_warehouse_id = "4a25f16d-0f1a-4e9e-95b0-a464c085a20c"
    const main_warehouse_id = "9d85cecc-feb1-4710-9a19-0a187580e15e"
    const warehouse_promises = [axios.get(`${url_warehouses}${main_warehouse_id}`),
                                axios.get(`${url_warehouses}${workshop_warehouse_id}`)]
    const user_string = JSON.stringify(user)
    return new Promise((resolve, reject)=>{
        Promise.all(warehouse_promises).then(results=>{
            const warehouse_data = [results[0].data, results[1].data]
            let promises = createWorkshopInventoryMovement(part_request.work_order_id, part_request.qty,'OUT_WORKSHOP',
                                            part_request.element, user_string, warehouse_data[0], warehouse_data[1])
            Promise.all(promises).then(()=>{
                resolve(part_request)
            })
        })
    })


}

export function saveInventoryTransactions(work_order_id, parts_request_list, user){
    console.log('Parts request transactions save')
    const url_movements = '/api/inventorymovements/'
    const url_warehouses = '/api/warehouses/'
    const logCodeCreate = 'WORKSHOP_PART_REQUEST'
    const descriptionCreate = 'WORKSHOP_CREATE_PART_REQUEST'
    
    const workshop_warehouse_id = "4a25f16d-0f1a-4e9e-95b0-a464c085a20c"
    const main_warehouse_id = "9d85cecc-feb1-4710-9a19-0a187580e15e"
    const warehouse_promises = [axios.get(`${url_warehouses}${main_warehouse_id}`),
                                axios.get(`${url_warehouses}${workshop_warehouse_id}`)]
    const user_string = JSON.stringify(user)
    let promises_save_inv = []
    let promises_save_part_req = []
    return new Promise((resolve, reject)=>{
        Promise.all(warehouse_promises).then((results)=>{
            const warehouse_data = [results[0].data, results[1].data]
            for (let part of parts_request_list){
                if(part.saved === false){
                    //do not allow patch
                    promises_save_inv = promises_save_inv.concat(createWorkshopInventoryMovement(work_order_id, part.qty, "IN_WORKSHOP", part.element, user,
                                                                        warehouse_data[0], warehouse_data[1]))
                }
            }
            Promise.all(promises_save_inv).then((results)=>{
                let pairs = []          
                let keys = []
                results.forEach(a=>{
                    if(keys.indexOf(a.stamp) === -1){
                        keys.push(a.stamp)
                    }
                })
                keys.forEach(a=>{
                    pairs.push(results.filter(b=>b.stamp===a))
                })
                pairs.forEach(item =>{
                    let main
                    let workshop
                    if(item[0].target_warehouse === 'MAIN'){
                        main = item[0]
                        workshop = item[1]
                    }else{
                        main = item[1]
                        workshop = item[0]
                    }
                    promises_save_part_req.push(
                        createPartRequest(work_order_id, user_string, main.data.amount,
                                        main.data.product, workshop.data.warehouse_id, main.data.warehouse_id)
                    )
                })
                resolve ([
                    {promises:promises_save_part_req, dispatch:'PARTS_REQUEST_CREATED'}
                ])
            })
        })
    })

}


export function saveUsedPartTransactions(work_order_id, used_list, used_list_old, user){
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

export function saveCashAdvanceTransactions(work_order_id, cash_list, cash_list_old, user, client){
    console.log("Cash advance saver method")

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