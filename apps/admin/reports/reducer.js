import {makeTableFriendly} from './actions.js'

// const defaultDepartment = {
//     consecutive: 0,
//     id: "0000",
//     identifier: "GG",
//     name: 'Por defecto',

// }

const defaultDepartment = "0000"
const defaultSubDepartment = "0000"

const defaultWarehouse = "0000"

const stateConst = {
    reportData: [],
    reportHeader: [],
    reportPrettyData: [],
    start_date: '',
    end_date: '',
    selected_section: 'downloadables',
    departments: [],
    subDepartments: [],
    selectedDepartment: defaultDepartment,
    selectedSubDepartment: defaultSubDepartment,
    warehouses: [],
    selectedWarehouse: defaultWarehouse,
    report_records: [],
    report_type_filter: 'ALL',
    report_request_panel_visible: false,
    report_to_generate: 'General Ventas', //constrols the type of report that will be queued for generation
    refetch_reports: false,
    notify_emails: '',
    resend_email_panel_visible: false,
    mailing_target: {},
    mail_body: '',
    mail_subject: '',
    uses_commision_report: false
  }
  

export default function reducer(state=stateConst, action){
    switch(action.type) {
        
        case 'USES_COMISSION_SUCCESFUL':
        {
            console.log("Action payload --> ", action)
            return {
                ...state,
                uses_commision_report: action.payload
            }
        }

        case 'MAILING_REPORTS_SUCCESSFUL':
        {
            return {
                ...state,
                mailing_target: {},
                mail_body: '',
                mail_subject: '',
                resend_email_panel_visible: false
            }
        }

        case 'SET_MAILING_TARGET':
        {
            return {
                ...state,
                mailing_target: action.payload
            }
        }

        case 'CLEAR_MAILING':
        {
            return {
                ...state,
                mailing_target: {},
                mail_body: '',
                mail_subject: ''
            }
        }

        case 'SET_MAIL_BODY':
        {
            return {
                ...state,
                mail_body: action.payload
            }
        }

        case 'SET_MAIL_SUBJECT':
        {
            return {
                ...state,
                mail_subject: action.payload
            }
        }

        case 'TOGGLE_REPORT_MAILING_PANEL':
        {
            const next_status = !state.resend_email_panel_visible
            return {
                ...state,
                resend_email_panel_visible: next_status
            }
        }

        case 'SET_NOTIFY_EMAILS':
        {
            return {
                ...state,
                notify_emails: action.payload
            }
        }

        case 'SET_REPORT_TYPE_TO_QUEUE': 
        {
            return {
                ...state,
                report_to_generate: action.payload
            }
        }

        case 'NEW_REPORT_QUEUED':
        {
            return {
                ...state,
                report_request_panel_visible: false,
                refetch_reports: true,
                notify_emails: ''
            }
        }

        case 'TOGGLE_REPORT_REQUEST_PANEL':
        {
            let b = !state.report_request_panel_visible
            return {
                ...state,
                report_request_panel_visible: b
            }
        }

        case 'FETCH_REPORT_RECORDS_FULFILLED':
        {

            return {
                ...state,
                report_records: action.payload,
                refetch_reports: false

            }
        }

        case 'FETCH_REPORT_RECORDS_REJECTED':
        {
            return {
                ...state,
                report_records: []
            }
        }

        case 'REPORTS_WAREHOUSES_SUCCEDED':
        {
            return {
                ...state,
                warehouses: action.payload
            }
        }

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

        case 'FETCH_PRODUCT_SUBDEPARTMENTS_FULFILLED':
            {
                return {
                    ...state,
                    subDepartments: action.payload
                }
            }
            case 'FETCH_PRODUCT_SUBDEPARTMENTS_REJECTED':
            {
                console.log("Sub deps received --> ", action.payload);
                return {
                    ...state,
                    subDepartments: []
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