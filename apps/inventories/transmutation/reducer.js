
const stateConst = {
    activeInput: true,
    inputs: [],
    outputs: []
    
}


export default function reducer(state=stateConst, action) {
    switch(action.type){
        case 'SET_PRODUCT': 
        {
            console.log("Set product payload --> ", action.payload)
            return {
                ...state
            }
            
        }


    }

    return state
}