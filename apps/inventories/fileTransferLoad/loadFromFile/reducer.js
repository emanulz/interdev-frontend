const stateConst = {
    file: '',
}


export default function reducer(state=stateConst, action){


    switch(action.type) {
        case 'FILE_SELECTED_PICKER':
        {
            return {
                ...state,
                file: action.payload
            }
        }
    }

    return state
}