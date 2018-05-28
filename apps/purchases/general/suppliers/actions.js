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