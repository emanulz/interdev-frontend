
const stateConst = {
    product_insight:null,
    product_code: '',
    records_limit: 80,
    records_to_fetch: 20,
    target_supplier: '',
    price_chart_visible: true,
    supplier_code: '',
    supplier_insight: null, 
    last_year_insights: true,
    start_date: '',
    end_date: '',


}

export default function reducer(state=stateConst, action){

    switch(action.type){
        case 'SUPPLIER_INSIGHT_SUCCESS':
        {
            return {
                ...state,
                supplier_insight: action.payload
            }
        }
        case 'SET_SUPPLIER_CODE':
        {
            return {
                ...state,
                supplier_code: action.payload
            }
        }
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
        case 'SET_CROSS_START_DATE':
        {
            return {
                ...state,
                start_date: action.payload
            }
        }
        case 'SET_CROSS_END_DATE':
        {
            return {
                ...state,
                end_date: action.payload
            }
        }
        case 'TOGGLE_LAST_YEAR_FLAG':
        {
            const new_state = !state.last_year_insights
            return{
                ...state,
                last_year_insights: new_state
            }
        }
    }

    return state


}