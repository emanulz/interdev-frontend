import alertify from 'alertifyjs'
import axios from 'axios'

let inspect = require('util-inspect')

// ------------------------------------------------------------------------------------------
// CONFIG DEFAULT AXIOS
// ------------------------------------------------------------------------------------------

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

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
            console.log("Cash advance created response --> " + inspect(response.data))
            saveLog(logCode, logModel, cash_old, advance_data, logDescription, user)
            resolve(response)   
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
export function createCashAdvance(work_order_id, advance_amount, client, user){

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
        description: JSON.stringify({'work_order_id':work_order_id})
    }

    return new Promise((resolve, reject)=>{
        axios({
            method: 'post',
            url:url,
            data: advance_data
        }).then((response)=>{
            saveLog(logCode, logModel, cash_old, advance_data, logDescription, user)
            resolve(response)
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