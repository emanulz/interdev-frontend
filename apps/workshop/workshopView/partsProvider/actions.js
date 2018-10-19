// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import axios from 'axios'
// ------------------------------------------------------------------------------------------
// CONFIG DEFAULT AXIOS
// ------------------------------------------------------------------------------------------

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

let inspect = require('util-inspect')
const uuidv1 = require('uuid/v1')
import alertify from 'alertifyjs'

function validateProductInventory(warehouse, item, amount, parts_in_cart){
    //validate if a fractioned amount was request on a product that does not allow it
    console.log(item)
    const isInteger = amount % 1 == 0 ? true: false
    const errors = {OK:true, message:''}

    if(!isInteger){ //if the number is a float, check if the product allows for fractioned
        if(!item.fractioned){
            errors.OK = false
            errors.message= 'El producto no permite candtidades fracionadas.\n'
        }
    }

    //check product inventory
    const inventory = JSON.parse(item.inventory_existent)
    const inventory_sales_warehouse = parseFloat(inventory[warehouse])

    //check if there are any other single lines in the cart of the same item, if the item
    //is not saved, it is not reflected on the product inventory yet
    let temp_in_cart = 0
    for(let part of parts_in_cart){
        //console.log("PART --> " + inspect(part))
        if(part.element.id === item.id && part.saved != true){
            temp_in_cart += parseFloat(part.qty)
        }
    }
    if(item.inventory_enabled && inventory_sales_warehouse - temp_in_cart < amount){
        errors.OK = false
        errors.message += `No hay suficiente producto en bodega, Existencias = ${inventory_sales_warehouse} menos ${temp_in_cart} en el carrito\n`
    }
 
    return errors
}

export function productSearchDoubleClick(item, dispatch, warehouse) {
    const sales_warehouse = this.sales_warehouse
    const parts_request =  this.parts_requests
    axios.get(`/api/products/${item}`).then(function(response) {
        const validation = validateProductInventory(sales_warehouse, response.data, 1, parts_request)
        if(validation.OK){
            dispatch(partAlreadyInTransactionsList(1, response.data, null))
            dispatch({type: 'productSearch_TOGGLE_SEARCH_PANEL', payload: response.data})
        }else{
            dispatch({type: 'PRODUCT_CART_ADD_VALIDATION', payload:validation.message})
        }

    }).catch(function(error) {
        alertify.alert('ERROR', `Error al obtener el valor del API, por favor intente de nuevo o comuníquese con el
        administrador del sistema con el siguiete error: ${error}`)
    })
  }

export function searchProduct(search_key, model, namespace, amount_requested, partsRequestList, sales_warehouse){
    const data = {
        model: model,
        max_results: 15,
        search_key: `!${search_key}`
    }

    return function(dispatch){
        axios({
            method: 'post',
            url: '/api/search/search/',
            data: data
        }).then(response=>{
            if(response.data.length == 1){
                const validation = validateProductInventory(sales_warehouse, response.data[0], amount_requested, partsRequestList)
                if(validation.OK){
                    dispatch(partAlreadyInTransactionsList(amount_requested, response.data[0], partsRequestList))
                    dispatch({type:"FETCHING_DONE"})
                }else{
                    dispatch({type: 'PRODUCT_CART_ADD_VALIDATION', payload:validation.message})
                }
            }else if(response.data.length>1){
                dispatch({type:`${namespace}_TOGGLE_SEARCH_PANEL`})
                dispatch({type:"FETCHING_DONE"})
            }else{
                alertify.alert('AVISO', `No se encontrarón productos con ese código`)
                console.log("No results")
            }
        }).catch(err=>{
            alertify.alert('ERROR', `Ocurrió un error en la búsqueda, Error: ${err}`)
            console.log(err)
            if (err.response) {
              console.log(err.response.data)
            }
            dispatch({type: 'FETCHING_DONE', payload: ''})
        })
    }
}

export function updateQty(qty, itemsList, target_uuid, sales_warehouse){
    const index = itemsList.findIndex(item=>item.uuid == target_uuid)
    //validate there is enough inventory in the warehouse
    const validation = validateProductInventory(sales_warehouse, itemsList[index].element, qty-itemsList[index].qty, itemsList)
    if(!validation.OK){ //abort on invalid amount
        return {type: 'PRODUCT_CART_ADD_VALIDATION', payload:validation.message}
    }
    
    const qtyNumber = parseFloat(qty)
     const res = {
         type: 'UPDATE_PARTS_LIST',
         payload: {item:updatePartInTransactionList(itemsList,index, qtyNumber),
                    index: index }
    }
    return res
}

export function buildInformativeMov(description){
    console.log("Creating informative mov")
    return {
        type: 'ADD_TO_INFORMATIVE_LIST',
        payload:{
            uuid: uuidv1(),
            element: {'amount': 0, 'description': description, 'subTotal': 0},
            qty: 1,
            type:'INFORMATIVE_MOVEMENT',
            priceToUse: 0,
            subTotal: 0,
            saved: false
        }
    }
}

export function buildUsedPartRequest(amount, description){
    const subTotal  = calculateUsedPartSubTotal(amount)
    return {
        type:'ADD_TO_USED_PART_LIST',
        payload:{
            uuid: uuidv1(),
            element: {'amount':amount, 'description': description, 'subTotal': subTotal},
            qty: 1,
            type: 'USED_PART',
            priceToUse: amount,
            subTotal: subTotal,
            saved: false
        }
    }
}

//build a cash advance request
export function buildCashAdvanceRequest(amount, description){
    const subTotal = calculateAdvanceSubTotal(amount)
    return{
        type:'ADD_TO_CASH_ADVANCE_LIST',
        payload:{
            uuid: uuidv1(),
            element:{'amount': amount, 'description':description, 'subTotal': subTotal},
            qty: 1,
            type:'CASH_ADVANCE',
            priceToUse: amount,
            subTotal: subTotal,
            saved: false
        }
    }
}

export function buildLaborRequest(amount, description){
    const sub = calculateLaborSubTotal(amount)
    return{
        type:'ADD_TO_LABOR_LIST',
        payload:{
            uuid: uuidv1(),
            element:{'amount': amount, 'description':description},
            qty: 1,
            type:'LABOR',
            priceToUse: amount,
            subTotal: sub,
            saved: false,
        }
    }
}

export function updateLaborCashAdvanceUsedPartInfoRow(item, e, list){

    
        let val = e.target.value
        console.log(e.target.name)
        //check if the property is amount, if it is it must parse to float
        if(e.target.name ==='amount'){
            const val2 = parseFloat(e.target.value)
            if(isNaN(val2)){
                return {type: 'INVALID_NUMERIC_VALUE'}
            }
        }

        const index = list.findIndex(a=>a.uuid === item.uuid)
        switch(item.type)
        {
            case 'LABOR':
            {
                const newItem = JSON.parse(JSON.stringify(item))
                newItem.saved = false
                newItem.element[e.target.name] = val
                newItem.priceToUse = newItem.element.amount
                newItem.subTotal = calculateLaborSubTotal(newItem.element.amount)
                return {type:'LABOR_UPDATED', payload:{'item':newItem, 'index':index}}
            }
    
            case 'CASH_ADVANCE':
            {
                const newItem = JSON.parse(JSON.stringify(item))
                newItem.saved = false
                newItem.element[e.target.name] = val
                newItem.priceToUse = newItem.element.amount
                newItem.subTotal= calculateAdvanceSubTotal(newItem.element.amount)
                return {type:'CASH_ADVANCE_UPDATED', payload:{'item':newItem, 'index':index}}
            }

            case 'USED_PART':
            {
                const newItem = JSON.parse(JSON.stringify(item))
                newItem.saved = false
                newItem.element[e.target.name] = val
                newItem.priceToUse = newItem.element.amount
                newItem.subTotal = calculateUsedPartSubTotal(newItem.element.amount)
                return {type:'USED_PART_UPDATED', payload:{'item':newItem, 'index':index}}

            }

            case 'INFORMATIVE_MOVEMENT':
            {
                const newItem = JSON.parse(JSON.stringify(item))
                newItem.saved = false
                newItem.element[e.target.name] =  val
                return {type: 'INFORMATIVE_MOVEMENT_UPDATED', payload:{'item': newItem, 'index': index}}
            }
    
        }
    }

//handles an user search of a part from the search bar
export function userPartSearchRequest(parts, code, qty, partsRequestList){

    //find the specific part inside the parts collection 
    const targetPartIndex = parts.findIndex(part =>{
        return part.code == code || part.barcode == code
    })
    
    const next_action = (targetPartIndex == -1) ?
    {
        type: 'PART_NOT_FOUND'
    }
    : partAlreadyInTransactionsList(code, qty, parts, partsRequestList, targetPartIndex)
    
    return next_action
}

function partAlreadyInTransactionsList(qty, part, partsRequestList){
    //check if there is enough inventory
    const subTotal = calculatePartSubtotal(part, qty)
    
    const next_action = {type: 'ADD_TO_PARTS_LIST',
                        payload:{
                            uuid: uuidv1(),
                            element:part,
                            qty: qty,
                            type:'PART_REQUEST',
                            subTotal: subTotal,
                            priceToUse: part.sell_price1,
                            saved: false

                            }
                        }
    return next_action
}

function updatePartInTransactionList(partsRequestList, indexInPartsRequestList, new_qty){
    //console.log(inspect(partsRequestList))
    //for now, this function will only calculate the new quantity required
    const originalItem = partsRequestList[indexInPartsRequestList]
    return {
        uuid: originalItem.uuid,
        element: originalItem.element,
        qty: new_qty,
        type:originalItem.type,
        subTotal: calculatePartSubtotal(originalItem.element, new_qty),
        priceToUse: originalItem.priceToUse,
        saved: false

    }
}


function calculateLaborSubTotal(cost, qty){
    const amount = qty ? qty : 1
    return cost*amount
}

function calculateAdvanceSubTotal(cost, qty){
    const amount = qty ? qty : 1
    return cost*amount
}

function calculateUsedPartSubTotal(cost, qty){
    const amount=qty ? qty : 1
    return cost*amount
}

//calculates a simple subtotal based only in the price and qty
function calculatePartSubtotal(part, qty){
    return part.sell_price1 * qty
}

