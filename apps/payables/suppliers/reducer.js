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
    activeSupplier: supplierModel,
    activeSupplierOld: supplierModel,
}

export default function reducer(state=stateConst, action) {
    switch(action.type) {
        case 'CLEAR_SUPPLIERS_ALL':
        {
            return {
                ...state,
                suppliers:[],
            }
        }
        case 'SET_SUPPLIER':
        {
            return {
                ...state,
                activeSupplier: action.payload
            }
        }
        case 'SET_SUPPLIER_OLD':
        {
            return {
                ...state,
                activeSupplierOld: action.payload
            }
        }
        case 'CLEAR_ACTIVE_SUPPLIER':
        {
            return {
                ...state,
                activeSupplier:supplierModel,
                activeSupplierOld: supplierModel,

            }
        }

        case 'FETCH_SUPPLIERS_FULFILLED':
        {
            return {
                ...state,
                suppliers:action.payload,
            }
        }
        case 'FETCH_SUPPLIERS_REJECTED':
        {
            return {
                ...state,
                suppliers:[],

            }
        }
    }

    return state
}