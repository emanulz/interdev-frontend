

const defaultPermissions = {
    add: 'unfetched',
    change: 'unfetched',
    list: 'unfetched',
    delete: 'unfetched'
  }

const article_types = [
    {"id": 0, "text" : "0-Lavadora"},
    {"id": 1, "text" :"1-Licuadora"},
    {"id": 2, "text" :"2-Percolador"},
    {"id": 3, "text" :"3-Refrigeradora"},
    {"id": 4, "text" :"4-Olla Arrocera"},
    {"id": 5, "text" :"5-Microondas"},
    {"id": 6, "text" :"6-Cafetera Eléctrica"},
    {"id": 7, "text" :"7-Moledor de café"},
    {"id": 8, "text" :"8-Plancha"},
    {"id": 9, "text" :"9-Batidora"},
    {"id": 10, "text" :"10-Tostadora"}
]

const article_brands = [
    {"id": 0, "text" : "0-Proctor Silex"},
    {"id": 1, "text" :"1-Oster"},
    {"id": 2, "text" :"2-Samsung"},
    {"id": 3, "text" :"3-Panasonic"},
    {"id": 4, "text" :"4-Atlas"},
    {"id": 5, "text" :"5-LG"},
    {"id": 6, "text" :"6-GE"},
    {"id": 7, "text" :"7-Black&Decker"},
    {"id": 8, "text" :"8-Hamilton Beach"}
]

const article_colors = [
    {"id": 0, "text" : "0-Blanco"},
    {"id": 1, "text" :"1-Negro"},
    {"id": 2, "text" :"2-Gris"},
    {"id": 3, "text" :"3-Inox"},
    {"id": 4, "text" :"4-Rojo"},
]

const article_failures = [
    {"id":0, "text":"0-Cambiar Pin"},
    {"id":1, "text": "1-No enciende"},
    {"id":2, "text":"2-No calienta"},
    {"id":99, "text":"99-Otro"}
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
    article_warranty_bd:'',
    malfunction_details: [],
    observations: ''


}

  
  const stateConst = {
    work_order :  work_order_model,
    fullWidth: false,
    permissions: defaultPermissions,
    workorders:[],
    article_types: article_types,
    article_brands: article_brands,
    article_colors:article_colors,
    article_failures:article_failures,
    article_custom_failure: '',
    failure_input_dropdown: true
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

        case 'CHANGE_MALFUNCTION_INPUT':
        {
            var next_val = true
            if(action.payload === 'text'){
                next_val = false
            }
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
        case 'SET_WORK_ORDER':
        {
            return {
                ...state,
                work_order: action.payload
            }
        }
    }

    return state //default return

}