import alertify from 'alertifyjs'
import axios from 'axios'
const uuidv1 = require('uuid/v1')

import {saveLog, getItemDispatch} from '../../../utils/api'

let inspect = require('util-inspect')

// ------------------------------------------------------------------------------------------
// CONFIG DEFAULT AXIOS
// ------------------------------------------------------------------------------------------

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'


export function loadLaborTransactions(work_order_id, dispatcher){
    dispatcher({type: 'FETCHING_STARTED', payload:''})
    const lookUpField = 'work_order_id'
    const base_url ='/api/labor/'
    const lookUpValue = work_order_id
    const dispatchOKType = 'LABOR_LOADED'
    const dispatchErrorType = 'ERROR_LOADING_LABOR'

    const target_url = `${base_url}?${lookUpField}=${lookUpValue}`

    axios.get(target_url).then(response=>{
        dispatcher({type:dispatchOKType, payload:response.data})
        dispatcher({type:'FETCHING_DONE'})
    }).catch(err=>{
        if(err){
            alertify.alert('ERROR', `Error al solicitar mano de obra para la
            orden de trabajo${work_order_id} :${err}`)
            dispatcher({type:dispatchErrorType, payload:err})            
        }
    })
}

export function loadCashAdvances(work_order_id, dispatcher){
    dispatcher({type:'FETCHING_STARTED', payload:''})
    //load cash advances for the work order
   
    const lookUpField = 'work_order_id'
    const base_url ='/api/cashadvances/'
    const lookUpValue = work_order_id
    const dispatchOKType = 'CASH_ADVANCES_LOADED'
    const dispatchErrorType = 'ERROR_LOADING_CASH_ADVANCES'

    const target_url = `${base_url}?${lookUpField}=${lookUpValue}`
    axios.get(target_url).then(response =>{
        dispatcher({type:dispatchOKType, payload:response.data})
        dispatcher({type:'FETCHING_DONE'})
    }).catch(err=>{
        if(err){
            alertify.alert('ERROR', `Error al solicitar los adelantos de dinero para la
            orden de trabajo${work_order_id} :${err}`)
            dispatcher({type:dispatchErrorType, payload:err})
        }
    })

}
export function loadUsedPartsTransactions(work_order_id, dispatcher){
    dispatcher({type: 'FETCHING_STARTED', payload:''})
    const lookUpField = 'work_order_id'
    const base_url ='/api/usedparts/'
    const lookUpValue = work_order_id
    const dispatchOKType = 'USED_PARTS_LOADED'
    const dispatchErrorType = 'ERROR_LOADING_USED_PART'

    const target_url = `${base_url}?${lookUpField}=${lookUpValue}`

    axios.get(target_url).then(response=>{
        dispatcher({type:dispatchOKType, payload:response.data})
        dispatcher({type:'FETCHING_DONE'})
    }).catch(err=>{
        if(err){
            alertify.alert('ERROR', `Error al solicitar partes usadas para la
            orden de trabajo${work_order_id} :${err}`)
            dispatcher({type:dispatchErrorType, payload:err})            
        }
    })
}

export function loadPartRequestTransactions(work_order_id, dispatcher){
    dispatcher({type: 'FETCHING_STARTED', payload:''})
    const lookUpField = 'work_order_id'
    const base_url ='/api/partrequest/'
    const lookUpValue = work_order_id
    const dispatchOKType = 'PARTS_REQUEST_LOADED'
    const dispatchErrorType = 'ERROR_LOADING_PARTS_REQUEST'

    const target_url = `${base_url}?${lookUpField}=${lookUpValue}`

    axios.get(target_url).then(response=>{
        dispatcher({type:dispatchOKType, payload:response.data})
        dispatcher({type:'FETCHING_DONE'})
    }).catch(err=>{
        if(err){
            alertify.alert('ERROR', `Error al solicitar requisiciones de parte para la
            orden de trabajo${work_order_id} :${err}`)
            dispatcher({type:dispatchErrorType, payload:err})            
        }
    })
}
export function patchCashAdvanceMovement(cash_old, cash_new, user){
    const url = `/api/cashadvances/${cash_old.element.id}/`
    const logCode = 'WORK_ORDER_CASH_ADVANCE_PATCH'
    const logDescription = 'Cash advance patched for work order --> ' + cash_new.work_order_id
    const logModel = 'CASH ADVANCE'
    let description = 'Cash advance updated'

    const data = {
        description:cash_new.element.description,
        amount:cash_new.element.amount
    }

    return new Promise((resolve, reject)=>{
        axios({
            method: 'patch',
            url:url,
            data:data
        }).then(response=>{
            saveLog(logCode, logModel, cash_old.element, cash_new.element, logDescription, user)
            resolve(response.data)
        }).catch(err=>{
            console.log(inspect(err))
            if(err.response){
                console.log(err.response.data)
            }
            alertify.alert('Error',`Error actualizando movimiento de adelanto de dinero para orden de trabajo ${labor_old.element.id}`)
            reject(err)            
        })
    })
}

export function patchUsedPartMovement(part_old, part_new, user){
    const url = `/api/usedparts/${part_old.element.id}/`
    const logCode = 'WORK_ORDER_USED_PART_PATCH'
    const logDescription = 'Used part patched for work order --> ' + cash_new.work_order_id
    const logModel = 'USED PART'
    let description = 'Used part updated'

    const data = {
        description:part_new.element.description,
        amount:part_new.element.amount
    }

    return new Promise((resolve, reject)=>{
        axios({
            method: 'patch',
            url:url,
            data:data
        }).then(response=>{
            saveLog(logCode, logModel, cash_old.element, cash_new.element, logDescription, user)
            resolve(response.data)
        }).catch(err=>{
            console.log(inspect(err))
            if(err.response){
                console.log(err.response.data)
            }
            alertify.alert('Error',`Error actualizando movimiento de parte usada para orden de trabajo ${part_old.element.id}`)
            reject(err)            
        })
    })
}

export function patchLaborMovement(labor_old, new_labor, user){
    const url = `/api/labor/${labor_old.element.id}/`
    const logCode = 'WORK_ORDER_LABOR_PATCH'
    const logDescription = 'Labor patched for work order --> ' + new_labor.work_order_id
    const logModel = 'LABOR'
    let description = 'Labor updated'

    const data = {
        description:new_labor.element.description,
        amount:new_labor.element.amount
    }

    return new Promise((resolve, reject)=>{
        axios({
            method: 'patch',
            url:url,
            data:data
        }).then((response)=>{
            saveLog(logCode, logModel, labor_old.element, new_labor.element, logDescription, user)
            resolve(response.data)
        }).catch(err=>{
            console.log(inspect(err))
            if(err.response){
                console.log(err.response.data)
            }
            alertify.alert('Error',`Error actualizando movimiento de mano de obra para orden de trabajo ${labor_old.element.id}`)
            reject(err)
        })
    })

}

export function createLaborMovement(work_order_id, labor_amount, description, user){
    const url ='/api/labor/'
    const logCode = 'WORK_ORDER_LABOR_CREATE'
    const logDescription = 'Labor added for work order --> ' + work_order_id
    const logModel = 'LABOR'
    const  labor_old = {noPrevious:'Initial creation'}

    const labor_data = {
        work_order_id: work_order_id,
        employee: user,
        amount:labor_amount,
        description:description
    }

    return new Promise((resolve, reject)=>{
        axios({
            method: 'post',
            url:url,
            data:labor_data
        }).then((response)=>{
            saveLog(logCode, logModel, labor_old, labor_data, logDescription, user)
            console.log("NEW LABOR ABOUT TO RESOLVE")
            resolve(response.data)   
        }).catch((err)=>{
            console.log(inspect(err))
            if(err.response){
                console.log(err.response.data)
            }
            alertify.alert('Error', `Error creando movimiento de mano de obra para orden de trabajo ${work_order_id}`)
            reject(err)
        })
    })
}

//creates a cash advance movement for a given work_order_id
export function createCashAdvance(work_order_id, advance_amount, client, user, advance_description, sale_id){

    const url = '/api/cashadvances/'
    const logCode = 'WORKORDER_CASH_ADVANCE_CREATE'
    const logDescription = 'Cash advance for work order--> ' + work_order_id
    const logModel = 'CASH_ADVANCE'
    const cash_old = {noPrevious:'Initial creation'}

    const advance_data = {
        client: client,
        client_id: client.id,
        user: user,
        amount: advance_amount,
        description: advance_description,
    }
    if(work_order_id !=='' && work_order_id !== undefined){
        advance_data.work_order_id = work_order_id
    }
    if(sale_id !=='' && sale_id !== undefined){
        advance_data.sale_id = sale_id
    }

    return new Promise((resolve, reject)=>{
        axios({
            method: 'post',
            url:url,
            data: advance_data
        }).then((response)=>{
            saveLog(logCode, logModel, cash_old, advance_data, logDescription, user)
            resolve(response.data)
        }).catch((err)=>{
            console.log(inspect(err))
            if(err.response){
                console.log(err.response.data)
            }
            alertify.alert('Error', `Error creando adelanto para orden de trabajo ${work_order_id}`)
            reject(err)
        })
    })

    
}

export function creationPromise(url, data, work_order_id, stamp, target_warehouse){

    const logCode ='WORK_ORDER_PART_MOVEMENT'
    const logDescription = 'Part movement added for work order --> ' + work_order_id
    const logModel = "INVENTORY_MOVEMENT"
    const old = {noPrevious:'Initial Creation'}
    let promise = new Promise((resolve, reject)=>{
        axios({
            method: 'post',
            url: url,
            data:data
        }).then((response)=>{
            saveLog(logCode, logModel, old, data, logDescription, data.user)
            resolve({data:response.data,stamp:stamp, target_warehouse:target_warehouse})
        }).catch(err=>{
            console.log(inspect(err))
            if(err.response){
                console.log(err.response.data)
            }
            alertify.alert('Error', `Error creando movimiento de inventario para orden de trabajo ${work_order_id}`)
            reject(err)
        })
    })

    return promise
}

export function createWorkshopInventoryMovement(work_order_id, part_amount, direction, part, user,
                                                main_warehouse, workshop_warehouse){                                       
    const in_type = "INPUT"
    const out_type = "OUTPUT"
    
    const creator = `wo_${work_order_id}`
    let promises_array = []
    const url = '/api/inventorymovements/'
    const user_string = JSON.stringify(user)
    const part_string = JSON.stringify(part)

    //console.log(inspect(part))

    const stamp = uuidv1()
    switch(direction)
    {
        case 'IN_WORKSHOP':
        {
            //create a promise for the extraction from  the main warehouse
            const data_in = {
                movement_type: out_type,
                user: user_string,
                amount: part_amount,
                product_id: part.id,
                product: part_string,
                description: 'Movimiento de Taller',
                warehouse: JSON.stringify(main_warehouse),
                warehouse_id: main_warehouse.id,
                id_generator: `wo_${work_order_id}`

            }
            promises_array.push(creationPromise(url, data_in, work_order_id, stamp, 'MAIN'))
            //create a promise for the ingress in the workshop warehouse
            const data_out = JSON.parse(JSON.stringify(data_in))
            data_out.movement_type = in_type
            data_out.warehouse = JSON.stringify(workshop_warehouse)
            data_out.warehouse_id = workshop_warehouse.id

            promises_array.push(creationPromise(url, data_out, work_order_id,stamp,'WORKSHOP'))
            console.log("CREATION PROMISES --> " + inspect(promises_array.length))
            return  promises_array
        }
        case 'OUT_WORKSHOP':
        {
            //create a promise for the extraction from  the main warehouse
            const data_in = {
                movement_type: in_type,
                user: user_string,
                amount: part_amount,
                product_id: part.id,
                product: part_string,
                description: 'Movimiento de Taller',
                warehouse: JSON.stringify(main_warehouse),
                warehouse_id: main_warehouse.id
            }
            promises_array.push(creationPromise(url, data_in, work_order_id, stamp, 'MAIN'))
            //create a promise for the ingress in the workshop warehouse
            const data_out = JSON.parse(JSON.stringify(data_in))
            data_out.movement_type = out_type
            data_out.warehouse = JSON.stringify(workshop_warehouse)
            data_out.warehouse_id = workshop_warehouse.id

            promises_array.push(creationPromise(url, data_out, work_order_id, stamp, 'WORKSHOP'))
            return promises_array
        }
        default:
        {
            console.log("INVALID MOVEMENT")
        }
    }

}

export function createUsedPart(work_order_id, part_amount, description, user){

    const url = '/api/usedparts/'
    const logCode = 'WORKORDER_USED_PART_CREATE'
    const logDescription = 'Used part for work order--> ' + work_order_id
    const logModel = 'USED_PART'
    const part_old = {noPrevious:'Initial creation'}

    const part_data = {
        work_order_id: work_order_id,
        employee: user,
        amount:part_amount,
        description:description
    }

    return new Promise((resolve, reject)=>{
        axios({
            method: 'post',
            url:url,
            data: part_data
        }).then((response)=>{
            saveLog(logCode, logModel, part_old, part_data, logDescription, user)
            resolve(response.data)
        }).catch((err)=>{
            console.log(inspect(err))
            if(err.response){
                console.log(err.response.data)
            }
            alertify.alert('Error', `Error creando parte usada para orden de trabajo ${work_order_id}`)
            reject(err)
        })
    })
}