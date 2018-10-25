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
    selectedWarehouse: warehouseModel,
    is_disabled: false
}

export default function reducer(state=stateConst, action){

    switch(action.type){
        case 'CLEAR_WAREHOUSES_ALL':
        {
            return {
                ...state,
                warehouses:[],
                selectedWarehouse:warehouseModel
            }
        }
        case 'WAREHOUSE_SELECTED':
        {
            return {
                ...state,
                selectedWarehouse: state.warehouses[action.payload]
            }
        }
        case 'LOADED_WAREHOUSE':
        {
            const warehouse =  action.payload.warehouse != ''
            ? JSON.parse(action.payload.warehouse)
            : warehouseModel
            return {
                ...state,
                selectedWarehouse: warehouse
            }
        }
        case 'CLEAR_WAREHOUSE':
        {
            return {
                ...state,
                warehouses: [],
                selectedWarehouse: warehouseModel
            }
        }
        case 'FETCH_WAREHOUSES_FULFILLED':
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