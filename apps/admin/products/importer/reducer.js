const warehouseModel = {
    id: '00000000-0000-0000-0000-000000000000',
    code: '00',
    name: 'Bodega sin Seleccionar',
    location: '',
    description:''
}

const stateConst = {
    file: '',
    destination_warehouse: warehouseModel,
    warehouses: [],
    warehouses_options:[],
}

export default function reducer(state=stateConst, action){
    switch(action.type) {
        
        case 'FILE_SELECTED':
        {
            return {
                ...state,
                file: action.payload
            }
        }

        case 'CLEAR_WAREHOUSES':
        {
            return {
                ...state,
                warehouses: [],
                destination_warehouse: warehouseModel
            }
        }

        case 'WAREHOUSE_SELECTED':
        {
            const index = state.warehouses.findIndex(a=>a.id=action.payload)
            return {
                ...state,
                destination_warehouse: state.warehouses[index]
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
                warehouses_options: warehouses_options,
            }
        }

        case 'FETCH_WAREHOUSES_REJECTED':
        {
            alertify.alert('Error', 'Ocurrio un error al cargar las bodegas existentes.')
            return{
                ...state,
                warehouses: [],
            }
        }


    }

    return state
}