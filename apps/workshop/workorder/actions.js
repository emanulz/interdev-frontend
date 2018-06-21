import {formatDate} from '../../../utils/formatDate'
import alertify from 'alertifyjs'

import axios from 'axios'

// ------------------------------------------------------------------------------------------
// CONFIG DEFAULT AXIOS
// ------------------------------------------------------------------------------------------

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'



export function createWorkOrder(kwargs){

    return function(dispatch){
        axios({
            method: kwargs.method,
            url: kwargs.url,
            data: kwargs['item'],
        }).then(response=>{
            alertify.alert('Completo', kwargs.successMessage)
            .set('onok', function(){

            })
            dispatch({type: 'FETCHING_DONE'})
            dispatch({type: kwargs.dispatchType, payload: response.data})
        }).catch(err=>{
            console.log(err)
            if(err.response){
                console.log(err.response.data)
            }
            dispatch({type: 'FETCHING_DONE'})
            alertify.alert('Error', kwargs.errorMessage)
        })
    }
}

export function checkWorkOrder(workorder){

    //enforce article type and brand to identify the item
    if(workorder.article_type===''){
        alertify.alert('Error', 'Se debe seleccionar el tipo de artículo')
        return false
    }

    if(workorder.article_brand ===''){
        alertify.alert('Error', 'Se debe seleccionar la marca del artículo')
        return false       
    }

    //at least a malfunction must be indicated
    if(workorder.malfunction_details.length < 1){
        alertify.alert('Error', 'Se debe indicar al menos una falla')
        return false
    }

    //at least an observation of the article state needs to be included
    if(workorder.observations_list.length < 1){
        alertify.alert('Error', 'Se debe indicar al menos un detalle sobre la condición del artículo')
        return false
    }

    //check the client object, needs at least a phone
    const client = workorder.client

    if(client.name === 'Cliente'){
        alertify.alert('Error', 'Se debe seleccionar un cliente')
        return false
    }
    // if(!(client.phone_number !== '' || client.cellphone_number !=='')){
    //     alertify.alert('Error', 'El cliente debe poseer al menos un número de teléfono')
    //     return false
    // }

    return true
}

//removes unset bits from the properties so that the backend handles the properties with defaults
export function cleanWorkOrder(workorder){
    if(workorder.is_warranty === false){
        delete workorder.warranty_invoice_date
    }
    
    return workorder
}

export function checkCashAdvance(advance){
    
    let OK = true
    let money_advance_valid = parseFloat(advance) ? true : false
    
    if(money_advance_valid){
        return OK
    }else{
        return !OK
    }


}

export function makeOrdersTableFriendly(orders){
    const cloned_orders = JSON.parse(JSON.stringify(orders))
    const pretty_orders = cloned_orders.map((order, index)=>{
        const client = JSON.parse(order.client)
        const pretty = {
            id:order.id,
            consecutive:order.consecutive,
            editIngress: order.consecutive,
            is_closed: order.is_closed,
            paid: order.paid,
            client_name : `${client.name} ${client.last_name}`,
            article_brand: order.article_brand,
            article_type: order.article_type,
            created: formatDate(order.created),
            repaired_by: formatDate(order.warranty_repaired_by),
            is_warranty: order.is_warranty,
            is_bd_warranty: order.warranty_number_bd ===''?false:true,

        }
        return pretty
    })

    return pretty_orders
    
}