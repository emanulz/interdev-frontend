import {createLaborMovement} from '../general/actions'
let inspect = require('util-inspect')


export function saveLaborTransactions(work_order_id, labor_list, user, dispatcher){
    console.log("Labor saver method")
    const url = '/api/labor/'
    const logCodeCreate = 'LABOR_CREATE'
    const logCodeUpdate = 'LABOR_UPDATE'
    const descriptionCreate = 'Creación nueva entrada mano de obra'
    const descriptionUpdate = 'Actualización entrada mano de obra'
    const logMode = 'LABOR'
    const successCreate = 'Mano de obra creada'

    let promises = []
    //if a labor object already has an id, it already exists on the db and must be patched
    for (let labor of labor_list){
        const user_string = JSON.stringify(user)
        promises.push(
            createLaborMovement(work_order_id, labor.element.cost,
                                labor.element.description, user_string)
        )
    }

    Promise.all(promises).then(values=>{
        dispatcher({type:'LABOR_MOVEMENTS_CREATED', payload:values})
    })
}