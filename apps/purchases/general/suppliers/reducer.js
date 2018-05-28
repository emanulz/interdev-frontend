import alertify from 'alertifyjs'

const supplierModel = {
    id: '00000000-0000-0000-0000-000000000000',
    code: '00',
    name: 'Proveedor Sin Seleccionar',
    id_type: '',
    id_num: '',
    address: '',
    phone_number: '',
    cellphone_number: '',
    email: '',
    agent_name:'',
    agent_last_name:'',
    agent_phone_number:'',
    agent_email:'',
    bank_accounts:'',
    sinpe_accounts:'',
    observations:'',
    created:'',
    updated:'',
}

const stateConst = {
    suppliers: [],
    supplierSelected: supplierModel
}

export default function reducer(state=stateConst, action){
    switch(action.type){
        case 'CLEAR_SUPPLIERS_ALL':
        {
            return {
                ...state,
                suppliers:[],
                supplierSelected: supplierModel
            }
        }

        case 'SUPPLIER_SELECTED':
        {
            return {
                ...state,
                supplierSelected:action.payload
            }
        }
        case 'LOADED_PURCHASE':
        {
            const sup = JSON.parse(action.payload.supplier)
            return {
                ...state,
                supplierSelected:sup
            }
        }
        case 'CLEAR_PURCHASE':
        {
            return {
                ...state,
                suppliers: [],
                supplierSelected: supplierModel
            }
        }
        case 'FETCH_SUPPLIERS_FULFILLED':
        {
            return {
                ...state,
                suppliers:action.payload
            }
        }

        case 'FETCH_SUPPLIERS_REJECTED':
        {
            return {
                ...state,
                suppliers:[],
                supplierSelected: supplierModel
            }
        }

        
    }
    return state
}