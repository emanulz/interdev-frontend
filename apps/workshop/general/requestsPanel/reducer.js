const stateConst = {
    requestsGroups: [],
    isVisible: false,
    selectedGroup: -1,
}

export default function reducer(state=stateConst, action){

    switch (action.type){
        
        case 'SET_SELECTED_GROUP':
        {
            return {
                ...state, 
                selectedGroup: action.payload
            }
        }

        case 'SET_WORK_ORDER_VIEW':
        {
            return {
                ...state,
                requestsGroups: action.payload.request_groups
            }
        }

        case 'CLEAR_REQUESTS_GROUP':
        {
            return {
                ...state,
                requestsGroups: []
            }
        }

        case 'CLEAR_WORKSHOPVIEW':
        {
            return {
                ...state,
                requestsGroups: []
            }
        }

        case 'SHOW_REQUESTS_PANEL':
        {
            return {
                ...state,
                isVisible: true
            }
        }

        case 'HIDE_REQUESTS_PANEL':
        {
            return {
                ...state,
                isVisible: false
            }
        }


        
    }

    return state
}