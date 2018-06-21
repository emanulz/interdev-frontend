let inspect = require('util-inspect')

const defaultPermissions = {
    add: 'unfetched',
    change: 'unfetched',
    list: 'unfetched',
    delete: 'unfetched'
  }

const work_order_model = {
    id:'000000',
    consecutive:'',
    is_closed : false,
    receiving_employee : 'Receiving Employee',
    technician:'Technician',
    client:'Client',
    client_id:'client id',
    article_type: '',
    article_brand: '',
    article_model: '',
    article_serial: '',
    article_color : '',
    article_data: '',
    malfunction_details: [],
    observations_list:[],
    observations: 'No observations',
    is_warranty:false,
    warranty_number_bd:'',
    warranty_invoice_date:'',
    warranty_supplier_name:'',
    warranty_invoice_number:'',
    warranty_repaired_by:''

}

const stateConst = {
    permissions: defaultPermissions,
    showPrices: true,
    showPartsTransactions : true,
    showLaborTransactions: true,
    showCashAdvanceTransactions: true,
    work_order: work_order_model,
    workshop_warehouse: '',
    sales_warehouse:'',
    blackdecker_warehouse: '',
}

export default function reducer(state=stateConst, action){

    switch (action.type){

        case 'CLEAR_WORKSHOPVIEW_WORKORDER':
        {
            return {
                ...state,
                work_order: work_order_model
            }
        }

        case 'SET_BLACKDECKER_WAREHOUSE':
        {
            return {
                ...state,
                blackdecker_warehouse: action.payload
            }
        }

        case 'CLEAR_BLACKDECKER_WAREHOUSE':
        {
            return {
                ...state,
                blackdecker_warehouse: ''
            }
        }

        case 'SET_WORKSHOP_WAREHOUSE':
        {
            return {
                ...state,
                workshop_warehouse: action.payload
            }
        }

        case 'CLEAR_WORKSHOP_WAREHOUSE':
        {
            return {
                ...state,
                workshop_warehouse: ''
            }
        }

        case 'SET_SALES_WAREHOUSE':
        {
            return {
                ...state,
                sales_warehouse: action.payload
            }
        }
        case 'CLEAR_SALES_WAREHOUSE':
        {
            return {
                ...state,
                sales_warehouse: ''
            }
        }

        case 'SET_WORK_ORDER_VIEW_SIMPLE':
        {
            const work_order = action.payload
            const malfunctions = JSON.parse(work_order.malfunction_details)
            const observations = JSON.parse(work_order.observations_list)
            const created_by = JSON.parse(work_order.receiving_employee)
            const loaded_client = JSON.parse(work_order.client)
            let saved_wo = JSON.parse(JSON.stringify(work_order))
            saved_wo.malfunction_details = malfunctions
            saved_wo.observations_list = observations
            saved_wo.receiving_employee = created_by
            saved_wo.client = loaded_client

            return {
                ...state, 
                work_order: saved_wo
            }
        }
        case 'SET_WORK_ORDER_VIEW':
        {
            const work_order = action.payload.work_order
            
            const malfunctions = JSON.parse(work_order.malfunction_details)
            const observations = JSON.parse(work_order.observations_list)
            const created_by = JSON.parse(work_order.receiving_employee)
            const loaded_client = JSON.parse(work_order.client)
            let saved_wo = JSON.parse(JSON.stringify(work_order))
            saved_wo.malfunction_details = malfunctions
            saved_wo.observations_list = observations
            saved_wo.receiving_employee = created_by
            saved_wo.client = loaded_client
            return {
                ...state, 
                work_order: saved_wo
            }

        }

        case 'FETCH_USER_WORKSHOPVIEW_PERMISSIONS_FULLFILLED':
        {
            return{
                ...state,
                permissions: action.payload
            }
        }
        case 'FETCH_USER_WORKSHOPVIEW_PERMISSIONS_REJECTED':
        {
            return{
                ...state,
                permissions: defaultPermissions
            }
        }
        default:{

        }
    }

    return state

}
