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
}

export default function reducer(state=stateConst, action){

    switch (action.type){

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
            // const saved_wo = {
            //     id:action.payload.id,
            //     consecutive:action.payload.consecutive,
            //     is_closed : action.payload.is_closed,
            //     receiving_employee : created_by,
            //     technician:action.payload.technician,
            //     client:loaded_client,
            //     client_id: action.payload.client_id,
            //     article_type: action.payload.article_type,
            //     article_brand: action.payload.article_brand,
            //     article_model: action.payload.article_model,
            //     article_serial: action.payload.article_serial,
            //     article_color : action.payload.article_color,
            //     article_data: action.payload.article_data,
            //     malfunction_details: malfunctions,
            //     observations_list:observations,
            //     observations: action.payload.observations,
            //     is_warranty:action.payload.is_warranty,
            //     warranty_number_bd:action.payload.warranty_number_bd,
            //     warranty_invoice_date: action.payload.warranty_invoice_date,
            //     warranty_supplier_name:action.payload.warranty_supplier_name,
            //     warranty_invoice_number:action.payload.warranty_invoice_number,
            //     warranty_repaired_by:action.payload.warranty_repaired_by,
            //     created: action.payload.created,
            //     updated: action.payload.updated
            // }

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
