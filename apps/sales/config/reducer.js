const stateConst = {
  company: {},
  salesWarehouse: '',
  workshopWarehouse: '',
  reservesWarehouse: '',
  globalConf: {}
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

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

    case 'FETCH_RESERVES_WAREHOUSE_FULFILLED':
    {
      return {
        ...state,
        reservesWarehouse: action.payload
      }

    } // case

    case 'FETCH_RESERVES_WAREHOUSE_REJECTED':
    {
      return {
        ...state,
        reservesWarehouse: ''
      }

    } // case

    case 'FETCH_GLOBAL_CONF_FULFILLED':
    {
      return {
        ...state,
        globalConf: action.payload.data
      }

    } // case

    case 'FETCH_GLOBAL_CONF_REJECTED':
    {
      return {
        ...state,
        globalConf: {}
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
  }

  return state // default return
}
