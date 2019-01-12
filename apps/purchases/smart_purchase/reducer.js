
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
    product_to_link: null
}

function updateVeryNestedField(state, action) {
    return {
      ...state,
      first: {
        ...state.first,
        second: {
          ...state.first.second,
          [action.someId]: {
            ...state.first.second[action.someId],
            fourth: action.someValue
          }
        }
      }
    }
  }

export default function reducer(state=stateConst, action) {

    switch(action.type) {
        
        case 'SMART_PROD_CREATION_COMPLETE':
        {
            //find the product in the invoice_to_link and update it
            //as a found product

            const who_am_i = action.payload.who_am_i
            //if the supplier code is not empty, search by code
            let target_item = null
            if(who_am_i.code !==''){
                
                target_item = state.invoice_to_link.items_list.findIndex(item=>{
                    const first_code = `${item.CodigosMeta[0].type}-${item.CodigosMeta[0].code}`
                    console.log("First code --> ", first_code)
                    return first_code===who_am_i.supplier_code
                })
            }else{
                
                target_item = state.invoice_to_link.items_list.findIndex(item=>{
                    return item.Detalle===who_am_i.supplier_description
                })
            }

            console.log("Target item --> ", target_item)
            if(target_item==null){
                console.log("Error matching after link.....????")
            }
            const new_items_list = [...state.invoice_to_link.items_list]
            new_items_list[target_item].linked = action.payload.who_am_i

            return {
                ...state,
                invoice_to_link: {
                    ...state.invoice_to_link,
                    invoice_to_link: new_items_list
                }
            }
        }
        case 'SET_PRODUCT_TO_LINK':
        {
            let target_prod = null

            //find the item from the invoice to link object
            if(state.invoice_to_link!==null){
                target_prod = state.invoice_to_link.items_list
                    .find(item=>{
                        return item.NumeroLinea === action.payload
                    })
            }
            return {
                ...state,
                product_to_link: target_prod
            }
        }

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