

const defaultPinCase = {
    case_name: 'default',
    headerText: 'Indentifición de Usuario',
    dispatchButtonText: 'Ejecutar',
    dispatchButtonIcon: undefined,
    actionHeader: 'Acción',
    actionDescription: '',
    insert_user: false
}

const stateConst = {
    isVisible: false,
    user: {},
    profile: {},
    userCode: '',
    userPin: '',
    pinCases: [],
    selectedCase: defaultPinCase,

}

export default function reducer(state=stateConst, action) {


    switch (action.type){

        case 'CLEAR_PIN_CASES':
        {
            return {
                ...state,
                pinCases: []
            }
        }

        case 'SET_PIN_CASE_AND_SHOW':
        {
            const pin_case = state.pinCases.find(a=>{
                return a.case_name === action.payload['case']
            })
            pin_case['kwargs'] = action.payload['kwargs']
            return {
                ...state,
                selectedCase: pin_case,
                isVisible: true,

            }
        }

        case 'REGISTER_ACTION_CASE':
        {
            const newPinCases = [...state.pinCases]
            newPinCases.push(action.payload)
            return {
                ...state,
                pinCases: newPinCases
            }
        }

        case 'SHOW_PIN_PANEL':
        {
            return {
                ...state,
                isVisible: true
            }
        }

        case 'HIDE_PIN_PANEL':
        {
            return {
                ...state,
                isVisible: false
            }
        }

        case 'SET_PIN_USER_CODE':
        {
            return {
                ...state,
                userCode: action.payload
            }
        }

        case 'SET_PIN_USER_PIN':
        {
            return {
                ...state,
                userPin: action.payload
            }
        }

        case 'SET_PIN_USER':
        {
            return {
                ...state,
                user: action.payload
            }
        }

        case 'CLEAR_PIN_USER':
        {
            return {
                ...state,
                user: {}
            }
        }

        case 'SET_PIN_USER_PROFILE':
        {
            return {
                ...state,
                profile: action.payload
            }
        }

        case 'CLEAR_PIN_USER_PROFILE':
        {
            return {
                ...state,
                profile: {}
            }
        }

        case 'CLEAR_PIN_USER_INPUTS':
        {
            return {
                ...state,
                profile: {},
                user: {},
                userPin: '',
                userCode: ''

            }
        }
    }

    return state
}