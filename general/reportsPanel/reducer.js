import { inspect } from 'util';

const stateConst = {
    reports_definitions: {},
    show_detail: undefined,
    report_request: {},
    //options are THIS_MONTH, THIS_DAY, DATE (CAN BE specific day or WHOLE MONTH)
    //finally a date range
    selected_period_type: 'THIS_MONTH',
    report_date: '',
    //determines how wide is the coverage, if in day mode, the report will cover the
    //exact day, if in mode mode, it will cover the whole month that the selected
    //day belongs to
    report_date_range: 'DAY',
    report_start_date: '',
    report_end_date: '',
    custom_actions: [],
    email_report: false,
    target_url: '',

    selected_report_format: [],
  }

export default function reducer(state=stateConst, action){
    switch (action.type){

        case 'TOGGLE_FORMAT_SELECTED':
        {
            let new_formats = [...state.selected_report_format]

            const index = state.selected_report_format.findIndex(a=>a===action.payload)
            
            if(index === -1){
                new_formats.push(action.payload)
            }else{
                new_formats.splice(index, 1)
            }
            
            return {
                ...state,
                selected_report_format: new_formats
            }
        }

        case 'SET_SELECTED_REPORT':
        {
            return {
                ...state,
                show_detail: action.payload,

            }
        }
        case 'REPORTS_DEFINITIONS_FETCHED':
        {

            return {
                ...state,
                reports_definitions: action.payload,
                //show_detail: action.payload.purchases[0],//to be deleted, hardcoded test
            }
        }

        case 'REPORTS_DEFINITIONS_REJECTED':
        {
            return {
                ...state,
                reports_definitions: {},
            }
        }
    }
    return state
}