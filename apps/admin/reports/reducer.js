import {makeTableFriendly} from './actions.js'

const stateConst = {
    reportData: [],
    reportHeader: [],
    reportPrettyData: [],
    start_date: '',
    end_date: '',
    selected_section: 'purchases_sales'
  }
  

export default function reducer(state=stateConst, action){
    switch(action.type) {
        
        case 'SET_SECTION':
        {
            return {
                ...state,
                selected_section: action.payload
            }
        }

        case 'SET_START_DATE': 
        {
            return {
                ...state,
                start_date: action.payload
            }
        }
        case 'SET_END_DATE':
        {
            return {
                ...state,
                end_date: action.payload
            }
        }
        case 'PURCHASES_VRS_SALES_FETCHED':
        {
            const data = JSON.parse(JSON.stringify(action.payload))
            const header = data.shift()
            const pretty = makeTableFriendly(data, header)
            return {
                ...state,
                reportData: data,
                reportHeader: header,
                reportPrettyData: pretty,
            }
        }

        case 'PURCHASES_VRS_SALES_REJECTED':
        {
            return {
                ...state,
                reportData: [],
                reportHeader: [],
                reportPrettyData: [],

            }
        }
    }

    return state
}