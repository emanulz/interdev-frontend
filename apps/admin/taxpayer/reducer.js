const defaultPermissions = {
    add: 'unfetched',
    change: 'unfetched',
    list: 'unfetched',
    delete: 'unfetched'
  }

const taxpayerModel = {
    id: '-1',
    legal_name: '',
    commercial_name: '',
    email: '',
    id_type: '00',
    id_number: '',
    provincia: 'Provincia',
    canton: 'Cantón',
    distrito: 'Distrito',
    barrio: 'Barrio',
    otras_senas: '',
    country_code: '506',
    phone_number: '',
    fax_number: '',
    invoicing_backup_email: 'backup@gmail.com',
    tax_payer_admins_emails: 'adminemails@domain.com',
    is_digital_invoicing_active: false,
    certificate_name: '',
    signing_secret: '',
    oauth_id: '',
    oauth_password: '',


}

const stateConst = {
    taxpayers: [],
    taxpayer_active: taxpayerModel,
    permissions: defaultPermissions,
    oauth_credentials_valid: undefined,
    certificate_valid: undefined,
    certificate_file: '',

}

export default function reducer(state=stateConst, action){


    switch(action.type){
        case 'OAUTH_VALIDATION_RESULT':
        {
            if(action.payload == "INVALID"){
                alertify.alert('ERROR', `Los credenciales OAUTH de Hacienda son incorrectos.`) 
            }else{
                alertify.alert('Éxito', `Los credenciales OAUTH de Hacienda son correctos.`) 
            }
            return {
                ...state,
                oauth_credentials_valid: action.payload,

            }
        }
        case 'OAUTH_VALIDATION_REJECT':
        {
            return{
                ...state,
                oauth_credentials_valid: undefined
            }
        }
        case 'CERTIFICATE_VALIDATION_RESULT':
        {
            if(action.payload == "INVALID"){
                alertify.alert('ERROR', `El secreto ingresado no puede desbloquear la llave de firmado, intente de nuevo.`) 
            }else{
                alertify.alert('Éxito', `El secreto desbloquea correctamente la llave criptográfica`) 
            }
            return {
                ...state,
                certificate_valid: action.payload,

            }
        }
        case  'CERTIFICATE_VALIDATION_REJECT':
        {
            return{
                ...state,
                certificate_valid: undefined
            }
        }
        case 'SET_CERTIFICATE_FILE':
        {
            return {
                ...state,
                certificate_file: action.payload
            }
        }
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
  
