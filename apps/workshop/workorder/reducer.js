import { searchClient } from '../general/clients/actions';
import {createCashAdvance} from '../general/actions'

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
    article_failures:article_failures,
    article_custom_failure: '',
    failure_input_dropdown: true,

    article_observations:article_observations,
    article_custom_observation:'',
    observation_input_dropdown: true,

    is_bd_warranty : false,

    cash_advance: 0

}

export default function reducer(state = stateConst, action){

    switch (action.type){
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
            return {
                ...state,
                workorders: action.payload
            }
        }

        case 'FETCH_WORKORDERS_REJECTED':
        {
            return {
                ...state,
                workorders: []
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
            //console.log("Reducer work order created --> " + inspect(action.payload))
 

            const malfunctions = JSON.parse(action.payload.malfunction_details)
            const observations = JSON.parse(action.payload.observations_list)
            const created_by = JSON.parse(action.payload.receiving_employee)
            const client = JSON.parse(action.payload.client)

            createCashAdvance(action.payload.id, state.cash_advance, action.payload.client, 
                action.payload.created_by)

            //const technician = JSON.parse(action.payload.technician)

            const saved_wo = {
                id:action.payload.id,
                consecutive:action.payload.consecutive,
                is_closed : action.payload.is_closed,
                receiving_employee : created_by,
                technician:action.payload.technician,
                client:client,
                client_id: action.payload.client_id,
                article_type: action.payload.article_type,
                article_brand: action.payload.article_brand,
                article_model: action.payload.article_model,
                article_serial: action.payload.article_serial,
                article_color : action.payload.article_color,
                article_data: action.payload.article_data,
                malfunction_details: malfunctions,
                observations_list:observations,
                observations: action.payload.observations,
                is_warranty:action.payload.is_warranty,
                warranty_number_bd:action.payload.warranty_number_bd,
                warranty_invoice_date: action.payload.warranty_invoice_date,
                warranty_supplier_name:action.payload.warranty_supplier_name,
                warranty_invoice_number:action.payload.warranty_invoice_number,
                warranty_repaired_by:action.payload.warranty_repaired_by
            }
            
            return {
                ...state,
                work_order: saved_wo
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