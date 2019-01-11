import axios from 'axios'

// ------------------------------------------------------------------------------------------
// CONFIG DEFAULT AXIOS
// ------------------------------------------------------------------------------------------

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

export function  supplierSearchDoubleClick(item, dispatch){
    axios.get(`/api/suppliers/${item}`).then(function(response) {
        dispatch({type: 'SUPPLIER_SELECTED', payload: response.data})
        dispatch({type: 'supplierSearch_TOGGLE_SEARCH_PANEL', payload: response.data})
    }).catch(function(error) {
        alertify.alert('ERROR', `Error al obtener el valor del API, por favor intente de nuevo o comuníquese con el
        administrador del sistema con el siguiete error: ${error}`)
    })
}

export function findSupplier(code, suppliers){
    const index = suppliers.findIndex(s => s.code == code)
    const res = (index==-1)
    ? {
        type:'SUPPLIER_NOT_FOUND',
        payload: code
    }
    : {
        type: 'SUPPLIER_SELECTED',
        payload:suppliers[index]
    }
    return res
}