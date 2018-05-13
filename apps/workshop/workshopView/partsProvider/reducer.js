
const stateConst = {
    products:{},
    searchKey:''
}

export default function reducer(state=stateConst, action){


    switch(action.type){
        case 'FETCH_PRODUCTS_REJECTED':
        {
            return {
                ...state,
                products:{}
            }
        }

        case 'FETCH_PRODUCTS_FULFILLED':
        {
            return {
                ...state,
                products: action.payload
            }
        }

        case 'UPDATE_SEARCH_KEY':
        {
            return {
                ...state,
                searchKey: action.payload
            }
        }

    }

    return state
}