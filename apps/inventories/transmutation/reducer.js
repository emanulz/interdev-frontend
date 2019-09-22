
const stateConst = {
    activeInput: true,
    inputs: [],
    outputs: [],
    searchingInput: true
    
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

        case 'SET_PROD_SEARCH_DESTINATION':
        {
            return {
                ...state,
                searchingInput: action.payload
            }
        }

        case 'CHANGE_QTY_PROD_RECIPE_INPUT':
        {
            const index = state.inputs.findIndex(a => a.product.id === action.payload.prod_id)
            if(index === -1){
                return {
                    ...state
                }
            }

            const new_inputs = JSON.parse(JSON.stringify(state.inputs))
            new_inputs[index].qty = action.payload.qty

            return {
                ...state,
                inputs: new_inputs
            }

        }
        case 'CHANGE_QTY_PROD_RECIPE_OUTPUT':
        {
            const index = state.outputs.findIndex(a => a.product.id === action.payload.prod_id)
            if(index === -1){
                return {
                    ...state
                }
            }

            const new_outputs = JSON.parse(JSON.stringify(state.outputs))
            new_outputs[index].qty = action.payload.qty

            return {
                ...state,
                outputs: new_outputs
            }
        }
        case 'REMOVE_PROD_FROM_RECIPE_INPUT': 
        {
            const index = state.inputs.findIndex(a => a.product.id === action.payload)
            if(index === -1 ){
                return {
                    ...state
                }
            }
            let new_inputs = JSON.parse(JSON.stringify(state.inputs))
            new_inputs.splice(index, 1)
            return {
                ...state,
                inputs: new_inputs
            }
        }
        case 'REMOVE_PROD_FROM_RECIPE_OUTPUT': 
        {

            const index = state.outputs.findIndex(a => a.product.id === action.payload)
            if(index === -1 ){
                return {
                    ...state
                }
            }
            let new_outputs = JSON.parse(JSON.stringify(state.outputs))
            new_outputs.splice(index, 1)
            return {
                ...state,
                outputs: new_outputs
            }
        }

        case 'RECEIVED_PROD_FOR_RECIPE':
        {
            console.log("Received data --> ", action.payload)
            
            if(state.searchingInput){
                const index = state.inputs.findIndex(a => a.product.id === action.payload.index)
                if(index !== -1 ){
                    console.log("Product is already on input --> ", index)
                    return {
                        ...state
                    }
                }
                let inputs = JSON.parse(JSON.stringify(state.inputs))
                const new_input = {
                    product: action.payload,
                    qty: 1
                }
                inputs.push(new_input)

                return {
                    ...state,
                    inputs: inputs
                }
            }else{
                console.log("Is output")
                const index = state.outputs.findIndex(a => a.product.id === action.payload.index)
                if(index !== -1 ){
                    console.log("Product is already on outputs --> ", index)
                    return {
                        ...state
                    }
                }
                let outputs = JSON.parse(JSON.stringify(state.outputs))
                const new_output = {
                    product: action.payload,
                    qty: 1
                }
                outputs.push(new_output)

                return {
                    ...state,
                    outputs: outputs
                }
            }

        }


    }

    return state
}