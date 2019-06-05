import { inspect } from "util";

const warehouseModel = {
    id: '00000000-0000-0000-0000-000000000000',
    code: '00',
    name: 'Bodega sin Seleccionar',
    location: '',
    description:''
}

const stateConst = {
    warehouses:[],
    warehouses_options:[],
    selectedWarehouse: {'default':warehouseModel},
    is_disabled: false,
}

export default function reducer(state=stateConst, action){

    switch(action.type){
        
        case 'MULTI_CLEAR_WAREHOUSES_ALL':
        {
            return {
                ...state,
                warehouses:[],
                selectedWarehouse: {'default': warehouseModel}
            }
        }
        case 'MULTI_WAREHOUSE_SELECTED':
        {
            let namespace = action.namespace ? action.namespace : 'default'
            let selected = JSON.parse(JSON.stringify(state.selectedWarehouse))
            selected[namespace] = state.warehouses[action.payload]

            return {
                ...state,
                selectedWarehouse: selected
            }
        }
        case 'MULTI_LOADED_WAREHOUSE':
        {
            const warehouse =  action.payload.warehouse != ''
            ? JSON.parse(action.payload.warehouse)
            : warehouseModel
            let namespace = action.namespace ? action.namespace : 'dafault'
            let selected = JSON.parse(JSON.stringify(state.warehouses))
            selected[namespace] = warehouse

            return {
                ...state,
                selectedWarehouse: selected
            }
        }
        case 'MULTI_CLEAR_WAREHOUSE':
        {
            return {
                ...state,
                warehouses: [],
                selectedWarehouse: {'default': warehouseModel}
            }
        }
        case 'MULTI_FETCH_WAREHOUSES_FULFILLED':
        {
            const warehouses_options = action.payload.map(item=>{
                return {id:item.id, text:item.name}
            })
            return {
                ...state,
                warehouses: action.payload,
                warehouses_options: warehouses_options
            }
        }
    }

    return state
}