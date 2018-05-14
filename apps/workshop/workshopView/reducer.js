const defaultPermissions = {
    add: 'unfetched',
    change: 'unfetched',
    list: 'unfetched',
    delete: 'unfetched'
  }

const stateConst = {
    permissions: defaultPermissions,
    showPrices: true,
    showPartsTransactions : true,
    showLaborTransactions: true,
    showCashAdvanceTransactions: true
}

export default function reducer(state=stateConst, action){

    switch (action.type){
        case 'FETCH_USER_WORKSHOPVIEW_PERMISSIONS_FULLFILLED':
        {
            return{
                ...state,
                permissions: action.payload
            }
        }
        case 'FETCH_USER_WORKSHOPVIEW_PERMISSIONS_REJECTED':
        {
            return{
                ...state,
                permissions: defaultPermissions
            }
        }
        default:{

        }
    }

    return state

}
