import { searchClient } from '../general/clients/actions';
import {createCashAdvance} from '../general/actions'
import {makeOrdersTableFriendly} from './actions'

let inspect = require('util-inspect')

const defaultPermissions = {
    add: 'unfetched',
    change: 'unfetched',
    list: 'unfetched',
    delete: 'unfetched'
  }

const article_types = [
    {"id": "Lavadora", "text" : "0-Lavadora"},
    {"id": "Licuadora", "text" :"1-Licuadora"},
    {"id": "Percolador", "text" :"2-Percolador"},
    {"id": "Refrigeradora", "text" :"3-Refrigeradora"},
    {"id": "Olla Arrocera", "text" :"4-Olla Arrocera"},
    {"id": "Microondas", "text" :"5-Microondas"},
    {"id": "Cafetera Eléctrica", "text" :"6-Cafetera Eléctrica"},
    {"id": "Moledor de café", "text" :"7-Moledor de café"},
    {"id": "Plancha", "text" :"8-Plancha"},
    {"id": "Batidora", "text" :"9-Batidora"},
    {"id": "Tostadora", "text" :"10-Tostadora"}
]

const article_brands = [
    {"id": "Proctor Silex", "text" : "0-Proctor Silex"},
    {"id": "Oster", "text" :"1-Oster"},
    {"id": "Samsung", "text" :"2-Samsung"},
    {"id": "Panasonic", "text" :"3-Panasonic"},
    {"id": "Atlas", "text" :"4-Atlas"},
    {"id": "LG", "text" :"5-LG"},
    {"id": "GE", "text" :"6-GE"},
    {"id": "Black&Decker", "text" :"7-Black&Decker"},
    {"id": "Hamilton Beach", "text" :"8-Hamilton Beach"},
    {"id": "Otra", "text":"99-Otra"}
]

const article_colors = [
    {"id": "Blanco", "text" : "0-Blanco"},
    {"id": "Negro", "text" :"1-Negro"},
    {"id": "Gris", "text" :"2-Gris"},
    {"id": "Inox", "text" :"3-Inox"},
    {"id": "Rojo", "text" :"4-Rojo"},
    {"id": "Otro", "text":"99-Otro"}
]

const article_failures = [
    {"id":'Cambiar Pin', "text":"0-Cambiar Pin"},
    {"id":'No enciende', "text": "1-No enciende"},
    {"id":'No calienta', "text":"2-No calienta"},
    {"id":'Otro', "text":"99-Otro"}
]

const article_observations = [
    {"id":"Completo", "text":"0-Completo"},
    {"id":"Rayado", "text":"1-Rayado"},
    {"id":"Presupuestar", "text":"2-Presupuestar"},
    {"id":"Teflón Malo", "text":"3-Teflón Malo"},
    {"id":"Otra", "text":"99-Otra"}
]

const work_order_model = {
    id:'',
    consecutive:'',
    is_closed : false,
    receiving_employee : 'Receiving Employee',
    technician:'Technician',
    client:'Client',
    client_id:'client id',
    article_type: '',
    article_brand: '',
    article_model: '',
    article_serial: '',
    article_color : '',
    article_data: '',
    malfunction_details: [],
    observations_list:[],
    observations: 'No observations',
    is_warranty:false,
    warranty_number_bd:'',
    warranty_invoice_date:'',
    warranty_supplier_name:'',
    warranty_invoice_number:'',
    warranty_repaired_by:''

}

const stateConst = {
    work_order :  work_order_model,
    fullWidth: false,
    permissions: defaultPermissions,
    article_types: article_types,
    article_brands: article_brands,
    article_colors:article_colors,
    workorders:[],
    table_friendly_orders:[],
    article_failures:article_failures,
    article_custom_failure: '',
    failure_input_dropdown: true,

    article_observations:article_observations,
    article_custom_observation:'',
    observation_input_dropdown: true,
    is_bd_warranty : false,

    cash_advance: 0,
    request_show_receipt: false,
    request_saved: false,

}

export default function reducer(state = stateConst, action){

    switch (action.type){
        case 'DISABLE_RECEIPT_REQUEST':
        {
            return{
                ...state,
                request_show_receipt: false
            }
        }

        case 'TOGGLE_FULL_WIDTH':
        {
            const width = !state.fullWidth
            return {
                ...state,
                fullWidth: width
            }
        }

        case 'FETCH_USER_WORKSHOP_PERMISSIONS_FULLFILLED':
        {
            return{
                ...state,
                permissions: action.payload
            }
        }
        case 'FETCH_USER_WORKSHOP_PERMISSIONS_REJECTED':
        {
            return{
                ...state,
                permissions: defaultPermissions
            }
        }

        case 'FETCH_WORKORDERS_FULFILLED':
        {
            const new_table_friendly = makeOrdersTableFriendly(action.payload)
            return {
                ...state,
                workorders: action.payload,
                table_friendly_orders: new_table_friendly
            }
        }

        case 'FETCH_WORKORDERS_REJECTED':
        {
            return {
                ...state,
                workorders: [],
                table_friendly_orders: []
            }
        }

        case 'CHANGE_OBSERVATION_INPUT':
        {
            let next_val = state.observation_input_dropdown ? false:true
            return {
                ...state,
                observation_input_dropdown : next_val
            }
        }

        case 'CHANGE_MALFUNCTION_INPUT':
        {
            let next_val = state.failure_input_dropdown ? false : true
            return {
                ...state,
                failure_input_dropdown: next_val
            }
        }
        case 'UPDATE_CUSTOM_MALFUNCTION_INPUT':
        {

            return {
                ...state,
                article_custom_failure: action.payload
            }
        }
        case 'UPDATE_CUSTOM_OBSERVATION_INPUT':
        {

            return {
                ...state,
                article_custom_observation: action.payload
            }
        }
        case 'CHANGE_OBSERVATION_INPUT':
        {
            var next_val = true
            if(action.payload ==='text'){
                next_val = false
            }
            return {
                ...state,
                observation_input_dropdown: next_val
            }
        }
        case 'SET_WORK_ORDER':
        {
            return {
                ...state,
                work_order: action.payload
            }
        }
        case 'CLEAR_WORK_ORDER':
        {
            const clean_order = stateConst
            clean_order.malfunction_details = []
            clean_order.observations_list = []
            return {
                ...state,
                
            }
        }
        case 'WORK_ORDER_CREATED':
        {
            let saved_wo = JSON.parse(JSON.stringify(action.payload.work_order))
            saved_wo.malfunction_details = JSON.parse(action.payload.work_order.malfunction_details)
            saved_wo.observations_list = JSON.parse(action.payload.work_order.observations_list)
            saved_wo.receiving_employee = JSON.parse(action.payload.work_order.receiving_employee)
            saved_wo.client = JSON.parse(action.payload.work_order.client)  
            
            return {
                ...state,
                work_order: saved_wo,
                request_show_receipt: true,
                request_saved: true
            }
        }
        case 'CASH_ADVANCE_UPDATED':
        {
            return {
                ...state,
                cash_advance:action.payload
            }
        }

        case 'CASH_ADVANCE_CLEAR':
        {
            return {
                ...state,
                cash_advance:stateConst.cash_advance
            }
        }
    }

    return state //default return

}