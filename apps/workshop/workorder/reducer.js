

const defaultPermissions = {
    add: 'unfetched',
    change: 'unfetched',
    list: 'unfetched',
    delete: 'unfetched'
  }
  
  const stateConst = {
    fullWidth: false,
    permissions: defaultPermissions,
    workorders:[]
}

export default function reducer(state = stateConst, action){

    switch (action.type){
            case 'TOGGLE_FULL_WIDTH':
            {
            const width = !state.fullWidth
            return {
                ...state,
                fullWidth: width
            }
        }

        case 'FETCH_USER_WORKSHOP_PERMISSIONS_FULLFILLED':
        {
            return{
                ...state,
                permissions: action.payload
            }
        }
        case 'FETCH_USER_WORKSHOP_PERMISSIONS_REJECTED':
        {
            return{
                ...state,
                permissions: defaultPermissions
            }
        }

        case 'FETCH_WORKORDERS_FULFILLED':
        {
            return {
                ...state,
                workorders: action.payload
            }
        }

        case 'FETCH_WORKORDERS_REJECTED':
        {
            return {
                ...state,
                workorders: []
            }
        }
    }

    return state //default return

}