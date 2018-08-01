const defaultPermissions = {
    add: 'unfetched',
    change: 'unfetched',
    list: 'unfetched',
    delete: 'unfetched'
  }

const stateConst = {
    taxpayers: [],
    permissions: defaultPermissions,

}

export default function reducer(state=stateConst, action){


    switch(action.type){
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
    }

    return state

}
  
