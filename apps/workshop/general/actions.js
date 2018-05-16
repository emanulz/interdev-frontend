import alertify from 'alertifyjs'
import axios from 'axios'

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

export function patchLaborMovement(old_labor, new_labor, description, user){
    
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
        cost:labor_amount,
        description:description
    }

    return new Promise((resolve, reject)=>{
        axios({
            method: 'post',
            url:url,
            data:labor_data
        }).then((response)=>{
            saveLog(logCode, logModel, labor_old, labor_data, logDescription, user)
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
export function createCashAdvance(work_order_id, advance_amount, client, user, advance_description, id_work_order, sale_id){

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
    if(id_work_order!=='' && id_work_order!== undefined){
        advance_data.work_order_id = id_work_order
    }
    if(sale_id !=='' && id_work_order !== undefined){
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
            alertify.alert('Error', `Error creando adelanto para orden de trabajo ${id_work_order}`)
            reject(err)
        })
    })

    
}