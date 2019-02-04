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
    {"id": "Bomba", "text" :"17-Bomba"},
    {"id": "Cafetera", "text" :"18-Cafetera"},
    {"id": "Coladora", "text" :"19-Coladora"},
    {"id": "Calentador", "text" :"20-Calentador"},
    {"id": "Calentador Cera", "text" :"21-Calentador Cera"},
    {"id": "Calen. Chupon", "text" :"22-Calen. Chupon"},
    {"id": "Cámara Enfr.", "text" :"23-Cámara Enfr."},
    {"id": "Carga. Batería", "text" :"24-Carga. Batería"},
    {"id": "Centro. Cocina", "text" :"25-Centro Cocina"},
    {"id": "Centro Lavado", "text" :"26-Centro Lavado"},
    {"id": "Cepilladora", "text" :"27-Cepilladora"},
    {"id": "Cocina gas", "text" :"28-Cocina gas"},
    {"id": "Cocina Elec.", "text" :"29-Cocina Elec."},
    {"id": "Coffee Maker", "text" :"30-Coffe Maker"},
    {"id": "Compresor", "text" :"31-Compresor"},
    {"id": "Desatornillador", "text" :"32-Desatornillador"},
    {"id": "Deshumidificador", "text" :"33-Deshumidificador"},
    {"id": "Dispensador Agua", "text" :"34-Dispensador Agua"},
    {"id": "Dremel", "text" :"35-Dremel"},
    {"id": "Ducha", "text" :"36-Ducha"},
    {"id": "Empacadora", "text" :"37-Empacadora"},
    {"id": "Enfriador", "text" :"38-Enfriador"},
    {"id": "Engrapadora", "text" :"39-Engrapadora"},
    {"id": "Ext. Grasa", "text" :"40-Ext. Grasa"},
    {"id": "Extensión Eléc", "text" :"41-Extensión Eléc"},
    {"id": "Extrac. Jugos", "text" :"42-Extrac. Jugos"},
    {"id": "Freídora", "text" :"43-Freídora"},
    {"id": "Fuente Poder", "text" :"44-Fuente Poder"},
    {"id": "Granizadora", "text" :"45-Granizadora"},
    {"id": "Hidrolavadora", "text" :"46-Hidrolavadora"},
    {"id": "Horno Microondas", "text" :"47-Horno Microondas"},
    {"id": "Horno Convencional", "text" :"48-Horno Convencional"},
    {"id": "Horno Tostador", "text" :"49-Horno Tostador"},
    {"id": "Lámpara", "text" :"50-Lámpara"},
    {"id": "Lavaplatos", "text" :"51-Lavaplatos"},
    {"id": "Lijadora", "text" :"52-Lijadora"},
    {"id": "Máquina hielo", "text" :"53-Máquina hielo"},
    {"id": "Máquina coser", "text" :"54-Máquina coser"},
    {"id": "Moledor café", "text" :"55-Moledor café"},
    {"id": "Olla C/Lento", "text" :"56-Olla C/Lento"},
    {"id": "Olla Vapor", "text" :"57-Olla Vapor"},
    {"id": "Olla Presión", "text" :"58-Olla Presión"},
    {"id": "Pichel", "text" :"59-Pichel"},
    {"id": "Plancha Pelo", "text" :"60-Plancha Pelo"},
    {"id": "Plancha Vapor", "text" :"61-Plancha Vapor"},
    {"id": "Plantilla Eléc", "text" :"62-Plantilla Eléc"},
    {"id": "Extensión Gas", "text" :"63-Extensión Gas"},
    {"id": "Puerta Rerfigerador", "text" :"64-Puerta Refrigerador"},
    {"id": "Reparar Tarjeta", "text" :"65-Reparar Tarjeta"},
    {"id": "Refresquera", "text" :"66-Refresquera"},
    {"id": "Resistencia", "text" :"67-Resistencia"},
    {"id": "Revisar Tazón", "text" :"68-Revisar Tazón"},
    {"id": "Lámpara Electrica", "text" :"69-Lámpara Electrica"},
    {"id": "Sandwichera", "text" :"70-Sandwichera"},
    {"id": "Sartén", "text" :"71-Sartén"},
    {"id": "Secadora Pelo", "text" :"72-Secadora Pelo"},
    {"id": "Taladro", "text" :"73-Taladro"},
    {"id": "Tapa Olla", "text" :"74-Tapa Olla"},
    {"id": "Teléfono", "text" :"75-Teléfono"},
    {"id": "Tijera Eléc", "text" :"76-Tijera Eléc"},
    {"id": "Waflera", "text" :"77-Waflera"},
    {"id": "Ventilador", "text" :"78-Ventilador"},
    {"id": "Otro", "text" :"99-Otro"},

    

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
    {"id": "Toshiba", "text":"9-Toshiba"},
    {"id": "Hitachi", "text":"10-Hitachi"},
    {"id": "Electrolux", "text":"11-Electrolux"},
    {"id": "Ninja", "text":"12-Ninja"},
    {"id": "Monix", "text":"13-Monix"},
    {"id": "Cuisinart", "text":"14-Cuisinart"},
    {"id": "Nutribullet", "text":"15-Nutribullet"},
    {"id": "Kitchen Aid", "text":"16-Kitchen Aid"},
    {"id": "Expert", "text":"17-Expert"},
    {"id": "Philips", "text":"18-Philips"},
    {"id": "Nestle", "text":"19-Nestle"},
    {"id": "Telstar", "text":"20-Telstar"},
    {"id": "Gibson", "text":"21-Gibson"},
    {"id": "Whirlpool", "text":"22-Whirlpool"},
    {"id": "Mabe", "text":"23-Mabe"},
    {"id": "Panasonic", "text":"24-Panasonic"},
    {"id": "Frigidaire", "text":"25-Frigidaire"},
    {"id": "West Bend", "text":"26-West Bend"},
    {"id": "Nostalgia Electrics", "text":"27-Nostalgia Electrics"},
    {"id": "Weston", "text":"28-Weston"},
    {"id": "Nuwave", "text":"29-Nuwave"},
    {"id": "Homedics", "text":"30-Homedics"},
    {"id": "Klip Extreme", "text":"31-Klip Extreme"},
    {"id": "Sony", "text":"32-Sony"},
    {"id": "Haier", "text":"33-Haier"},
    {"id": "Aiwa", "text":"34-Aiwa"},
    {"id": "Hisense", "text":"35-Hisense"},
    {"id": "Nikon", "text":"36-Nikon"},
    {"id": "JBL", "text":"37-JBL"},
    {"id": "Harma Kardon", "text":"38-Harma Kardon"},
    {"id": "Marley", "text":"39-Marley"},
    {"id": "Logitech", "text":"40-Logitech"},
    {"id": "JAM", "text":"41-JAM"},
    {"id": "BOSE", "text":"42-BOSE"},
    {"id": "Marshal", "text":"43-Marshal"},
    {"id": "Kingston", "text":"44-Kingston"},
    {"id": "Maxell", "text":"45-Maxell"},
    {"id": "Motorola", "text":"46-Motorola"},
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
    receiving_employee : 'Receptor',
    updated_by : 'Actualiza por',
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
    is_edit: false,
    is_stock_warranty: false,

}

export default function reducer(state = stateConst, action){

    switch (action.type){

        case 'SET_STOCK_CHECK':
        {
            return{
                ...state,
                is_stock_warranty: action.payload
            }
        }
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
            const is_stock = action.payload.warranty_invoice_number==="STOCK"?true:false
            return {
                ...state,
                work_order: action.payload,
                is_stock_warranty: is_stock
            }
        }
        case 'CLEAR_WORK_ORDER':
        {

            return {
                ...state,
                work_order :  work_order_model,
                fullWidth: false,
                workorders:[],
                table_friendly_orders:[],
                failure_input_dropdown: true,
                article_custom_observation:'',
                observation_input_dropdown: true,
                is_bd_warranty : false,
                cash_advance: 0,
                request_show_receipt: false,
                request_saved: false,
                is_edit: false,
                is_stock_warranty:false,            
                
            }
        }
        case 'WORK_ORDER_CREATED':
        {
            let saved_wo = JSON.parse(JSON.stringify(action.payload.work_order))
            saved_wo.malfunction_details = JSON.parse(action.payload.work_order.malfunction_details)
            saved_wo.observations_list = JSON.parse(action.payload.work_order.observations_list)
            saved_wo.receiving_employee = JSON.parse(action.payload.work_order.receiving_employee)
            saved_wo.client = JSON.parse(action.payload.work_order.client)  
            const is_stock = saved_wo.warranty_invoice_number==="STOCK"?true:false
            return {
                ...state,
                work_order: saved_wo,
                request_show_receipt: true,
                request_saved: true,
                is_stock_warranty: is_stock,
            }
        }

        case 'WORK_ORDER_EDIT_LOADED':
        {
            let saved_wo = JSON.parse(JSON.stringify(action.payload))
            saved_wo.malfunction_details = JSON.parse(action.payload.malfunction_details)
            saved_wo.observations_list = JSON.parse(action.payload.observations_list)
            saved_wo.receiving_employee = JSON.parse(action.payload.receiving_employee)
            saved_wo.client = JSON.parse(action.payload.client)  
            
            const is_stock = saved_wo.warranty_invoice_number==="STOCK"?true:false
            return {
                ...state,
                work_order: saved_wo,
                is_edit: true,
                is_stock_warranty: is_stock,

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