import {makeTableFriendly} from './list/actions.js'
import { inspect } from 'util';

const stateConst = {
    fullWidth: false,
    purchases:[],
    purchasesTableFriendly: [],
    invoiceNumber:'',
    invoiceDate:'',
    isEdit: false,
    payed: false,
    is_closed: false,
    purchase_id: '',
    old: '',
  }

  export default function reducer(state=stateConst, action){
      switch (action.type){
          case 'TOGGLE_FULL_WIDTH':
          {
              const width = !state.fullWidth
              return{
                  ...state,
                  fullWidth: width
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
                payed: false,
                is_closed: false,
                purchase_id:'',
            }
          }
          case 'LOADED_PURCHASE':
          {
              const old = JSON.stringify(action.payload)
              return {
                ...state,
                invoiceNumber:action.payload.invoice_number,
                invoiceDate:action.payload.invoice_date,
                payed: action.payload.payed,
                is_closed: action.payload.is_closed,
                purchase_id: action.payload.id,
                old:old,
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
                  purchasesTableFriendly:tF
                  
              }
          }
      }
      return state
  }