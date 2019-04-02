const stateConst = {
    company: {},
    salesWarehouse: '',
    workshopWarehouse: '',
    globalConf: {}
  }
  
  export default function reducer(state = stateConst, action) {
  
    switch (action.type) {

      case 'FETCH_SALES_WAREHOUSE_FULFILLED':
      {
        return {
          ...state,
          salesWarehouse: action.payload
        }
  
      } // case
  
      case 'FETCH_SALES_WAREHOUSE_REJECTED':
      {
        return {
          ...state,
          salesWarehouse: ''
        }
  
      } // case
  
      case 'FETCH_WORKSHOP_WAREHOUSE_FULFILLED':
      {
        return {
          ...state,
          workshopWarehouse: action.payload
        }
  
      } // case
  
      case 'FETCH_WORKSHOP_WAREHOUSE_REJECTED':
      {
        return {
          ...state,
          workshopWarehouse: ''
        }
  
      } // case
  
      case 'FETCH_CONFIG_FULFILLED':
      {
        return {
          ...state,
          [action.payload.section]: action.payload.data
        }
  
      } // case
  
      case 'FETCH_CONFIG_REJECTED':
      {
        return {
          ...state,
          [action.payload.section]: {}
        }
  
      } // case
  
      case 'SET_CONFIG':
      {
        return {
          ...state,
          [action.payload.section]: action.payload.data
        }
  
      } // case
  
    }
  
    return state // default return
  }
  