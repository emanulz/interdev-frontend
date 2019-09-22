import React from 'react'

const card = (props) => {

    return (
        <div className="ingredient-card">
            <div className="ingredient-card-container">
                <div><strong>Código:</strong> {props.prod_data.product.code}</div>
                <div><strong>Descripción:</strong> {props.prod_data.product.description}</div>
                <div>
                    <strong>Cantidad:</strong> 
                    <input value={props.prod_data.qty} name='model' 
                        onChange={(event) => props.changeQty(event, props.prod_data.product.id, props.is_input)}
                        type='number' className='form-control' />
                </div>
                <button onClick={()=>props.remove(props.prod_data.product.id, props.is_input)}
                    className='form-control btn-danger'>
                    Remover
                </button>
            </div>
        </div>
    )
}


export default card