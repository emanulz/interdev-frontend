import axios from 'axios'

// ------------------------------------------------------------------------------------------
// CONFIG DEFAULT AXIOS
// ------------------------------------------------------------------------------------------

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

const stateConst = {
    fullWidth: false,
    clientVisible: false,
    priceListVisible: false,
    showCurrency: false,
    uniqueId: '',
    transfer_location: '',
    transfers: [],
    mass_load_complete: false,
    transfer_mode: "FILE"
}

export default function reducer(state=stateConst, action) {
    switch(action.type){
        
        case 'SET_TRANSFER_MODE':
        {
            return {
                ...state,
                transfer_mode: action.payload
            }
        }

        case 'SET_UNIQUE_ID':
        {
            return {
                ...state,
                uniqueId: action.payload
            }
        }

        case 'TOGGLE_FULL_WIDTH':
        {
          const width = !state.fullWidth
          return {
            ...state,
            fullWidth: width
          }
        }

        case 'INV_LOAD_SUCCESFUL':
        {
            let path_final = "input"
            if(state.transfer_mode === "OUTPUT"){
                path_final = "output"
            }else if(state.transfer_mode === "OUTPUT"){
                path_final ="transfer"
            }
            return window.location.href = "/inventories/massloadlist/" + path_final
   
        }

        case ' INV_LOAD_REJECTED':
        {
            let message = `Error ingresando inventario ${action.payload}`
            alertify.alert("Error", message)
            return {
                ...state
            }
        }

        case 'INV_DOWNLOAD_SUCCESFUL':
        {             
            return {
                ...state,
                transfer_location: `/media/inv_transfers/${action.payload}`
            }
        }

        case 'FETCH_FTRANSFERS_FULFILLED':
        {
            return {
                ...state, 
                transfers: action.payload
            }
        }

        case 'FETCH_FTRANSFERS_REJECTED':
        {
            return {
                ...state,
                transfers: []
            }
        }
    }

    return state
}