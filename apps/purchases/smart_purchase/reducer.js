
const stateConst = {
    currentStep: "a",
    fullWidth: false,
    files: [],
    selectedFile: null,
    documents_data: [], //holds the information of the electronic documents
    document_data_selected: null,
    force_reprocess: false,
    show_sup_link_confirmation: true,
    to_link_supplier: null,
    invoice_to_link: null,
    products_linked: [],
    products_to_link: []
}

export default function reducer(state=stateConst, action) {

    switch(action.type) {
        
        case 'SET_INVOICE_TO_LINK':
        {
            let item_data = null
            if(action.payload.length === 1){
                item_data = action.payload[0]
            }
            return {
                ...state,
                invoice_to_link: item_data

            }
        }

        case 'GO_TO_STEP':
        {
            return {
                ...state,
                currentStep: action.payload
            }
        }

        case 'SET_TO_LINK_SUPPLIER':
        {
            return {
                ...state, 
                to_link_supplier: action.payload,
                show_sup_link_confirmation: true
            }
        }

        case 'CLEAR_TO_LINK_SUPPLIER':
        {
            return {
                ...state,
                to_link_supplier: null
            }
        }

        case 'TOGGLE_SUP_LINK_CONFIRMATION':
        {
            return {
                ...state,
                show_sup_link_confirmation: !state.show_sup_link_confirmation
            }
        }

        case 'HACIENDA_RECEPTION_STARTED':
        {
            return {
                ...state,
                force_reprocess: true
            }
        }

        case 'NEW_SUPPLIER_CREATED':
        {
            return {
                ...state,
                force_reprocess: true
            }
        }

        case 'SUPPLIER_LINKED':
        {
            return {
                ...state,
                force_reprocess: true
            }
        }

        case 'FORCE_REPROCESS_FIRED':
        {
            return {
                ...state,
                force_reprocess: false
            }
        }
        case 'SMART_PURCHASE_PROCESSED':
        {

            //if this is a reprocess, update the selected doc data
            let current_selected = state.document_data_selected
            if(state.document_data_selected !== null){
                let selected_doc_index = action.payload.findIndex(item=>{
                    return item.file_name === current_selected.file_name
                }) 
                current_selected = action.payload[selected_doc_index]

            }

            return {
                ...state,
                documents_data: action.payload,
                force_reprocess: false,
                document_data_selected: current_selected
            }
        }

        case 'SET_FILE_SELECTED':
        {
            let selected_doc_index = state.documents_data.findIndex(item=>{
                return item.file_name === action.payload.name
            })

            let selected_doc_data = null
            if(selected_doc_index !== -1){
                selected_doc_data = state.documents_data[selected_doc_index]
            }

            return {
                ...state,
                selectedFile: action.payload,
                document_data_selected: selected_doc_data
            }
        }

        case 'REMOVE_FILE':
        {
            console.log("State files remove --> ", state.files)
            let index = state.files.findIndex(item=>{
                return item.name === action.payload.name
            })
            console.log("Index --> ", index)
            let current_selected = state.selectedFile
            let newList = state.files
            if(index >= 0){
                newList.splice(index, 1)
                if(current_selected.name === action.payload.name){
                    current_selected = null
                }
            }

            return {
                ...state,
                files: newList,
                selectedFile: current_selected
            }
        }

        case 'SET_FILES':
        {
            //console.log("Files received --> ", action.payload)
            let files_array = []
            for(var i=0; i<action.payload.length; i++){
                if(action.payload[i].type ==="text/xml"){
                    files_array.push(action.payload[i])
                }
                
            }
            return {
                ...state,
                files: files_array
            }
        }

        case 'ADD_FILE':
        {
            console.log("Files payload --> ", action.payload)
            return {
                ...state, 

            }
        }

        case 'CLEAR_FILES':
        return {
            ...state, 
            dragActive: false
        }

    }

    return state
}