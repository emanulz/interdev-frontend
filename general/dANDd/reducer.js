


const stateConst = {
    dragActive: false,
    drag_depth: 0, //track how many times the drag enter and out have fired

}

export default function reducer(state=stateConst, action) {

    switch(action.type) {
        case 'SET_DRAGGING_ACTIVE':
        {
            return {
                ...state, 
                dragActive: true
            }
        }

        case 'SET_DRAGGING_INACTIVE':
        return {
            ...state, 
            dragActive: false
        }

    }

    return state
}