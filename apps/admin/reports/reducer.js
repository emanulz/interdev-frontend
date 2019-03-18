import {makeTableFriendly} from './actions.js'

// const defaultDepartment = {
//     consecutive: 0,
//     id: "0000",
//     identifier: "GG",
//     name: 'Por defecto',

// }

const defaultDepartment = "0000"


const stateConst = {
    reportData: [],
    reportHeader: [],
    reportPrettyData: [],
    start_date: '',
    end_date: '',
    selected_section: 'purchases_sales',
    departments: [],
    selectedDepartment: defaultDepartment
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

        case 'FETCH_PRODUCT_DEPARTMENTS_FULFILLED':
        {
            return {
                ...state,
                departments: action.payload
            }
        }
        case 'FETCH_PRODUCT_DEPARTMENTS_REJECTED':
        {
            return {
                ...state,
                departments: []
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