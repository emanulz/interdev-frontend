import { saveItem } from '../../../utils/api'

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
    if(!(client.phone_number !== '' || client.cellphone_number !=='')){
        alertify.alert('Error', 'El cliente debe poseer al menos un número de teléfono')
        return false
    }

    return true
}

//removes unset bits from the properties so that the backend handles the properties with defaults
export function cleanWorkOrder(workorder){
    if(!cleanWorkOrder.is_warranty){
        delete workorder.warranty_invoice_date
        delete workorder.warranty_repaired_by
    }

    return workorder
}

export function checkCashAdvance(advance){
    
    let OK = true
    if(advance ===''){return OK}
    let money_advance_valid = parseFloat(advance) ? true : false
    
    if(money_advance_valid){
        return OK
    }else{
        return !OK
    }


}

//creates a cash advance movement for a given work_order_id
export function createCashAdvance(work_order_id, advance_amount){

}