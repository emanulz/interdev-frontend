const defaultPermissions = {
    add: 'unfetched',
    change: 'unfetched',
    list: 'unfetched',
    delete: 'unfetched'
  }

const taxpayerModel = {
    id: '-1',
    legal_name: 'Los Mangos',
    commercial_name: ' Los Mangos Enterprise',
    email: 'losmangos@losmangos.com',
    id_type: '01',
    id_number: '113540770',
    provincia: '1',
    canton: '19',
    distrito: '2',
    barrio: '2',
    otras_senas: 'Santa Ana Centro',
    country_code: '506',
    phone_number: '8888-8888',
    fax_number: '7777-7777',
    invoicing_backup_email: 'backup@losmangos.com',
    tax_payer_admins_emails: 'adminemails@losmangos.com',
    is_digital_invoicing_active: false,
    certificate_name: '',
    signing_secret: '1234',
    oauth_id: 'cpf-01-1353-0032@stag.comprobanteselectronicos.go.cr',
    oauth_password: 'L[@9{*T=h@flY9q_#//d',


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

        case 'TAX_PAYER_CREATION_ERR':
        {
            alertify.alert("Error", 'Error creando contribuyente '+ action.payload)
            return {
                ...state,
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
  
