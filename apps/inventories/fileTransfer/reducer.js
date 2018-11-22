import {generalSave} from '../../../utils/api.js'

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
    transfer_location: ''
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

        case 'INV_DOWNLOAD_SUCCESFUL':
        {

            // const get_file = () => {
            //     try {
            //     console.log("Go there --> " + `/media/inv_transfers/${action.payload}`)
            //       return axios.get(`/media/inv_transfers/${action.payload}`)
            //     } catch (error) {
            //       console.error(error)
            //     }
            //   }
            // console.log("Call get file")
            // get_file()
            // console.log("Get file called")
              
            return {
                ...state,
                transfer_location: `/media/inv_transfers/${action.payload}`
            }
        }
    }

    return state
}