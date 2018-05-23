
const stateConst = {
    isVisible: true,
    isFull: false
}

export default function reducer(state=stateConst, action) {
    switch (action.type) {
        default:
        {
            console.log('Not implemented action --> ' + action.type)
        }
    }

    return state
}