import {makeTableFriendly} from './list/actions.js'

const stateConst = {
    fullWidth: false,
    purchases:[],
    purchasesTableFriendly: [],
    invoiceNumber:'',
    invoiceDate:'',
    isEdit: false,
    is_closed: false,
    purchase_id: '',
    old: '',
    requires_incomplete_refresh: false,
    requires_complete_refresh: false,

  }

  export default function reducer(state=stateConst, action){
      switch (action.type){
          case 'FLAG_REFRESH_PURCHASES_INCOMPLETE':
          {
              return{
                ...state,
                requires_incomplete_refresh: true
              }
          }
          case 'FLAG_REFRESH_PURCHASES_COMPLETE':
          {
              return{
                ...state,
                requires_complete_refresh: true
              }
          }
          case 'TOGGLE_FULL_WIDTH':
          {
              const width = !state.fullWidth
              return{
                  ...state,
                  fullWidth: width
              }
          }
          case 'PURCHASE_SAVED':
          {
              return {
                  ...state,
                  purchase_id: action.payload.id,
                  is_closed: action.payload.is_closed
              }
          }
          case 'IS_PURCHASE_EDIT':
          {
              return {
                  ...state,
                  isEdit:true
              }
          }
          case 'CLEAR_PURCHASE':
          {
            return{
                ...state,
                fullWidth: false,
                purchases:[],
                purchasesTableFriendly: [],
                invoiceNumber:'',
                invoiceDate:'',
                isEdit: false,
                is_closed: false,
                purchase_id:'',
            }
          }
          case 'LOADED_PURCHASE':
          {
              return {
                ...state,
                invoiceNumber:action.payload.invoice_number,
                invoiceDate:action.payload.invoice_date,
                is_closed: action.payload.is_closed,
                purchase_id: action.payload.id,
              }
          }
          case 'INVOICE_DATE_CHANGED':
          {
              return {
                  ...state,
                  invoiceDate:action.payload
              }
          }

          case 'INVOICE_NUMBER_CHANGED':
          {
              return {
                  ...state,
                  invoiceNumber:action.payload
              }
          }

          case 'FETCH_PURCHASES_FULFILLED':
          {
              const tF = makeTableFriendly(action.payload)
              return {
                  ...state,
                  purchases:[
                      action.payload
                  ],
                  purchasesTableFriendly:tF,
                  requires_incomplete_refresh: false
                  
              }
          }
      }
      return state
  }