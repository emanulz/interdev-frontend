
const currenciesTemp = [
  {
    currency_name: 'Colones',
    currency_code: 'CRC',
    currency_symbol: '₡',
    currency_exchange_rate: 1
  }, {
    currency_name: 'Dólares',
    currency_code: 'USD',
    currency_symbol: '$',
    currency_exchange_rate: 585
  }, {
    currency_name: 'Euros',
    currency_code: 'EUR',
    currency_symbol: '€',
    currency_exchange_rate: 682
  }

]

const stateConst = {
  currencies: currenciesTemp,
  currencySelected: 'CRC',
  exchangeRateSelected: 1,
  symbolSelected: '₡'
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_CURRENCIES_REJECTED':
    {
      return {
        ...state,
        currencies: []
      }
    } // case

    case 'FETCH_CURRENCIES_FULFILLED':
    {
      return {
        ...state,
        currencies: action.payload
      }
    } // case

    case 'SET_CURRENCY':
    {
      const currency = state.currencies.find(curr => curr.currency_code == action.payload)
      if (currency != -1) {
        return {
          ...state,
          currencySelected: currency.currency_code,
          symbolSelected: currency.currency_symbol,
          exchangeRateSelected: currency.currency_exchange_rate
        }
      }
      return {
        ...state,
        currencySelected: 'CRC',
        exchangeRateSelected: 1,
        symbolSelected: '₡'

      }
    } // case

    case 'CLEAR_CURRENCY':
    {
      return {
        ...state,
        currencySelected: 'CRC',
        exchangeRateSelected: 1,
        symbolSelected: '₡'
      }
    } // case

    case 'SET_EXCHANGE_RATE':
    {
      return {
        ...state,
        exchangeRateSelected: action.payload
      }
    } // case

    case 'CLEAR_EXCHANGE_RATE':
    {
      return {
        ...state,
        exchangeRateSelected: 585
      }
    } // case

  } // switch

  return state // default return

} // reducer
