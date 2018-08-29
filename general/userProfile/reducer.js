import alertify from 'alertifyjs'
const stateConst = {
  profile: {},
  taxPayer: {},
  tp_locals: [],
  salesWarehouse: '',
  reservesWarehouse: '',
  activeLocal: ''
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_USER_PROFILE_FULFILLED':
    {
      let activeLocal = {}
      try {
        const profile = action.payload.profile
        activeLocal = action.payload.tp_locals.find(local => local.id == profile.active_local_id)
      } catch (err) {
        alertify.alert('ERROR AL CARGAR EL PERFIL Y LAS BODEGAS', `El usuario activo no tiene asociado ningún local,
          el sistema tendra problemas con el uso de inventarios y el manejo de facturación electrónica.`)
      }
      return {
        ...state,
        profile: action.payload.profile,
        taxPayer: action.payload.taxpayer,
        tp_locals: action.payload.tp_locals,
        salesWarehouse: activeLocal.sales_warehouse,
        reservesWarehouse: activeLocal.reserves_warehouse,
        activeLocal: activeLocal
      }
    } // case

    case 'FETCH_USER_PROFILE_REJECTED':
    {
      return {
        ...state,
        profile: {},
        taxPayer: {},
        tp_locals: []
      }
    } // case

  } // switch

  return state // default return

} // reducer
