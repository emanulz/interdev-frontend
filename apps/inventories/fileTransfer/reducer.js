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
}

export default function reducer(state=stateConst, action) {
    switch(action.type){
        
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
             return window.location.href = "/inventories/filetransferslist"
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