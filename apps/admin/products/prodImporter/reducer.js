const stateConst = {
    products: [],
    products_old: [],
    cat_data: [],
    inv_data: [],
    joint_data: []
}

export default function reducer(state=stateConst, action) {
    switch(action.type) {

        case 'CLEAR_PRODUCTS_IMPORT':
        {
            return {
                ...state,
                products: [],
            }
        }

        case 'PRODUCTS_FETCH_FULFILLED_IMPORT':
        {
            const old = JSON.parse(JSON.stringify(action.payload))
            return {
                ...state,
                products: action.payload,
                products_old: old,
            }
        }

        case 'SET_JOINT_DATA':
        {
            return {
                ...state,
                joint_data: action.payload
            }
        }

        case 'CLEAR_JOINT_DATA':
        {
            return {
                ...state,
                joint_data: []
            }
        }

        case 'SET_CAT_DATA':
        {
            return {
                ...state,
                cat_data: action.payload
            }
        }

        case 'CLEAR_CAT_DATA':
        {
            return {
                ...state,
                cat_data: []
            }
        }

        case 'SET_INV_DATA':
        {
            return {
                ...state,
                inv_data: action.payload
            }
        }

        case 'CLEAR_INV_DATA':
        {
            return {
                ...state,
                inv_data: []
            }
        }
        
        
    }

    return state
}