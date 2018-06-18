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
    activeSupplier: supplierModel,
    search_key: ''
}

export default function reducer(state=stateConst, action){
    switch(action.type){
        case 'SET_ACTIVE_SUPPLIER':
        {
            return {
                ...state,
                activeSupplier: action.payload
            }
        }

        case 'CLEAR_PROVIDER_SEARCH_KEY':
        {
            return {
                ...state,
                search_key: ''
            }
        }

        case 'PROVIDER_SEARCH_KEY_UPDATED':
        {
            return {
                ...state,
                search_key: action.payload
            }
        }

    }

    return state
}