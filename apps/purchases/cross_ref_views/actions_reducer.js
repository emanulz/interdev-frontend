
const stateConst = {
    product_insight:null,
    product_code: '',
    records_limit: 80,
    records_to_fetch: 20,
    target_supplier: '',
    price_chart_visible: true

}

export default function reducer(state=stateConst, action){

    switch(action.type){
        case 'PRODUCT_INSIGHT_SUCCESS':
        {
            return {
                ...state,
                product_insight: action.payload
            }
        }
        case 'SET_PRODUCT_CODE':
        {
            return {
                ...state,
                product_code: action.payload
            }
        }
        case 'SET_RECORDS_TO_FECTH':
        {
            return {
                ...state,
                records_to_fetch: action.payload 
            }
        }
        case 'TOGGLE_PRICE_CHART':
        {
            const next_state = !state.price_chart_visible
            return {
                ...state,
                price_chart_visible: next_state
            }
        }
    }

    return state


}