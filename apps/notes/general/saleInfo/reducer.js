const saleDataModel = {
    consecutive: 0,
    sale_total: 0,
    currency_code: 'CRC',
    exchange_rate: 1,
    extras: ''
}

const electronicDocModel = {
    sale_id:'',
    consecutive_numbering: '',
    numeric_key: '',
    process_history: '',
    client_name: '',
    sale_total: '',
    sale_consecutive: '',
    related_credit_notes: '',
    related_debit_notes: ''
}
const stateConst = {
    saleData: saleDataModel,
    electronicDoc: electronicDocModel,
    note_mode: 'debit'
}

export default  function reducer(state=stateConst, action){
    switch(action.type){


        case 'CLEAR_ALL':
        {
          return {
            ...state,

          }
        }

        case 'FETCH_SALE_DATA_FULFILLED':
        {
            let sale = ''
            try {
                sale = action.payload.results[0]
            } catch (error) {
                return {
                    ...state
                }
            }
            
            return {
                ...state,
                saleData: sale
            }
        }
        case 'FETCH_SALE_DATA_REJECTED':
        {
            return {
                ...state,
                saleData: saleDataModel
            }
        }

        case 'FETCH_ELECTRONIC_DATA_FULFILLED':
        {
            let electronic = ''
            try{
                electronic = action.payload.results[0]
            } catch (error){
                return {
                    ...state
                }
            }
            return {
                ...state,
                electronicDoc: electronic
            }
        }
        case 'FETCH_ELECTRONIC_DATA_REJECTED':
        {
            return {
                ...state,
                electronicDoc: electronicDocModel
            }
        }

    }

    return state
}