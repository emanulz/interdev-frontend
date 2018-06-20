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
    {"id": "Tostadora", "text" :"10-Tostadora"},
    {"id": "Abanico", "text" :"11-Abanico"},
    {"id": "Abrelatas", "text" :"12-Abrelatas"},
    {"id": "Afilador Cuch", "text" :"13-Afilador Cuch"},
    {"id": "Aspiradora", "text" :"14-Aspiradora"},
    {"id": "Bascula Elec", "text" :"15-Bascula Elec"},
    {"id": "Base Pichel", "text" :"16-Base Pichel"},
    {"id": "Batidora", "text" :"17-Batidora"},
    {"id": "Bomba", "text" :"18-Bomba"},
    {"id": "Cafetera", "text" :"19-Cafetera"},
    {"id": "Coladora", "text" :"20-Coladora"},
    {"id": "Calentador", "text" :"21-Calentador"},
    {"id": "Calentador Cera", "text" :"22-Calentador Cera"},
    {"id": "Calen. Chupon", "text" :"23-Calen. Chupon"},
    {"id": "Cámara Enfr.", "text" :"24-Cámara Enfr."},
    {"id": "Carga. Batería", "text" :"25-Carga. Batería"},
    {"id": "Centro. Cocina", "text" :"26-Centro Cocina"},
    {"id": "Centro Lavado", "text" :"27-Centro Lavado"},
    {"id": "Cepilladora", "text" :"28-Cepilladora"},
    {"id": "Cocina gas", "text" :"29-Cocina gas"},
    {"id": "Cocina Elec.", "text" :"30-Cocina Elec."},
    {"id": "Coffee Maker", "text" :"31-Coffe Maker"},
    {"id": "Compresor", "text" :"32-Compresor"},
    {"id": "Desatornillador", "text" :"33-Desatornillador"},
    {"id": "Deshumidificador", "text" :"34-Deshumidificador"},
    {"id": "Dispensador Agua", "text" :"35-Dispensador Agua"},
    {"id": "Dremel", "text" :"36-Dremel"},
    {"id": "Ducha", "text" :"37-Ducha"},
    {"id": "Empacadora", "text" :"38-Empacadora"},
    {"id": "Enfriador", "text" :"39-Enfriador"},
    {"id": "Engrapadora", "text" :"40-Engrapadora"},
    {"id": "Ext. Grasa", "text" :"41-Ext. Grasa"},
    {"id": "Extensión Eléc", "text" :"42-Extensión Eléc"},
    {"id": "Extrac. Jugos", "text" :"43-Extrac. Jugos"},
    {"id": "Freídora", "text" :"44-Freídora"},
    {"id": "Fuente Poder", "text" :"45-Fuente Poder"},
    {"id": "Granizadora", "text" :"46-Granizadora"},
    {"id": "Hidrolavadora", "text" :"47-Hidrolavadora"},
    {"id": "Horno Microondas", "text" :"48-Horno Microondas"},
    {"id": "Horno Convencional", "text" :"49-Horno Convencional"},
    {"id": "Horno Tostador", "text" :"50-Horno Tostador"},
    {"id": "Lámpara", "text" :"51-Lámpara"},
    {"id": "Lavaplatos", "text" :"52-Lavaplatos"},
    {"id": "Lijadora", "text" :"53-Lijadora"},
    {"id": "Máquina hielo", "text" :"54-Máquina hielo"},
    {"id": "Máquina coser", "text" :"55-Máquina coser"},
    {"id": "Moledor café", "text" :"56-Moledor café"},
    {"id": "Olla C/Lento", "text" :"57-Olla C/Lento"},
    {"id": "Olla Vapor", "text" :"58-Olla Vapor"},
    {"id": "Olla Presión", "text" :"59-Olla Presión"},
    {"id": "Pichel", "text" :"60-Pichel"},
    {"id": "Plancha", "text" :"61-Plancha"},
    {"id": "Plancha Pelo", "text" :"62-Plancha Pelo"},
    {"id": "Plancha Vapor", "text" :"63-Plancha Vapor"},
    {"id": "Plantilla Eléc", "text" :"64-Plantilla Eléc"},
    {"id": "Extensión Gas", "text" :"65-Extensión Gas"},
    {"id": "Extensión Eléc", "text" :"66-Extensión Eléc"},
    {"id": "Puerta Rerfigerador", "text" :"67-Puerta Refrigerador"},
    {"id": "Refrigeradora", "text" :"68-Refrigeradora"},
    {"id": "Reparar Tarjeta", "text" :"69-Reparar Tarjeta"},
    {"id": "Refresquera", "text" :"70-Refresquera"},
    {"id": "Resistencia", "text" :"71-Resistencia"},
    {"id": "Revisar Tazón", "text" :"72-Revisar Tazón"},
    {"id": "Lámpara Electrica", "text" :"73-Lámpara Electrica"},
    {"id": "Sandwichera", "text" :"74-Sandwichera"},
    {"id": "Sartén", "text" :"75-Sartén"},
    {"id": "Secadora Pelo", "text" :"76-Secadora Pelo"},
    {"id": "Taladro", "text" :"77-Taladro"},
    {"id": "Tapa Olla", "text" :"78-Tapa Olla"},
    {"id": "Teléfono", "text" :"79-Teléfono"},
    {"id": "Tijera Eléc", "text" :"80-Tijera Eléc"},
    {"id": "Waflera", "text" :"81-Waflera"},
    {"id": "Ventilador", "text" :"82-Ventilador"},
    {"id": "Otro", "text" :"10-Otro"},

    

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
    {"id":'Switch Malo', "text": "2-Switch Malo"},
    {"id":'No calienta', "text":"3-No calienta"},
    {"id":'No pasa Agua', "text": "4-No pasa Agua"},
    {"id":'Se sale Agua', "text": "5-Se sale Agua"},
    {"id":'Directo', "text": "6-Directo"},
    {"id":'Golpea Tanque', "text": "7-Golpea Tanque"},
    {"id":'Calienta Mucho', "text": "8-Calienta Mucho"},
    {"id":'No tira automático', "text": "9-No tira automático"},
    {"id":'Trabado', "text": "10-Trabado"},
    {"id":'Otro', "text":"99-Otro"}
]

const article_observations = [
    {"id":"Completo", "text":"0-Completo"},
    {"id":"Rayado", "text":"1-Rayado"},
    {"id":"Presupuestar", "text":"2-Presupuestar"},
    {"id":"Teflón Malo", "text":"3-Teflón Malo"},
    {"id":"Trae Cable", "text":"3-Trae Cable"},
    {"id":"Frasco", "text":"3-Frasco"},
    {"id":"Tazón", "text":"3-Tazón"},
    {"id":"Tapa", "text":"3-Tapa"},
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