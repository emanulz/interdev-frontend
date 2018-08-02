const defaultPermissions = {
    add: 'unfetched',
    change: 'unfetched',
    list: 'unfetched',
    delete: 'unfetched'
  }

const taxpayerModel = {
    id: '-1',
    legal_name: 'Nombre legal',
    commercial_name: 'Nombre Comercial',
    email: 'correo@dominio.com',
    id_type: '00',
    id_number: '0000',
    provincia: 'Provincia',
    canton: 'Cantón',
    distrito: 'Distrito',
    barrio: 'Barrio',
    otras_senas: 'Otras señas de dirección',
    country_code: '506',
    phone_number: '0000-0000',
    fax_number: '0000-0000',
    invoicing_backup_email: 'backup@gmail.com',
    tax_payer_admins_emails: 'adminemails@domain.com',
    is_digital_invoicing_active: false

}

const stateConst = {
    taxpayers: [],
    taxpayer_active: taxpayerModel,
    permissions: defaultPermissions,

}

export default function reducer(state=stateConst, action){


    switch(action.type){

        case 'SET_TAXPAYER':
        {
            return {
                ...state,
                taxpayer_active: action.payload
            }
        }

        case 'CLEAR_TAX_PAYER':
        {
            return{
                ...state,
                taxpayers: []
            }
        }

        case 'TAX_PAYER_FULFILLED':
        {
            return {
                ...state,
                taxpayers: action.payload
            }
        }

        case 'FETCH_USER_TAXPAYER_PERMISSIONS_FULFILLED':
        {
            return {
                ...state,
                permissions: action.payload
            }
        }

        case 'FETCH_USER_TAXPAYER_PERMISSIONS_REJECTED':
        {
            return {
                ...state,
                permissions: defaultPermissions
            }
        }

        case 'CLEAR_CANTON':
        {
          const taxpayer = state.taxpayer_active
          taxpayer.canton = ''
          return {
            ...state,
            taxpayer_active: taxpayer
          }
        } 

        case 'CLEAR_DISTRICT':
        {
            const taxpayer = state.taxpayer_active
            taxpayer.distrito = ''
            return {
                ...state,
                taxpayer_active: taxpayer
            }
        }

        case 'CLEAR_TOWN':
        {
            const taxpayer = state.taxpayer_active
            taxpayer.barrio = ''
            return {
                ...state,
                taxpayer_active: taxpayer
            }
        }
    }

    return state

}
  
