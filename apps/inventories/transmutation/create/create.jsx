import React from 'react'
import Search from '../../../../general/search/search.jsx'
import { connect } from 'react-redux'
import { getSingleItemDispatch } from '../../../../utils/api'

import IngredientCard from './ingredient_card/ingredient_card.jsx'

@connect((store)=> {
    return {
        inputs: store.transmutation.inputs,
        outputs: store.transmutation.outputs,
    }
})
export default class CreateTransmutation extends React.Component {


    onProductSelected(item_id){
        this.props.dispatch({type:'productSearch_TOGGLE_SEARCH_PANEL'})
        //get the product
        const kwargs = {
            url: `/api/productslist/${item_id}`,
            successType: 'RECEIVED_PROD_FOR_RECIPE',
            errorType: 'REJECTED_PROD_FOR_RECIPE'
        }
        this.props.dispatch(getSingleItemDispatch(kwargs))
    }

    searchProductForInput(){
        this.props.dispatch({type: 'SET_PROD_SEARCH_DESTINATION', payload: true})
        //toggle panel display
        this.props.dispatch({type:'productSearch_TOGGLE_SEARCH_PANEL'})
    }

    searchProductForOutput(){
        this.props.dispatch({type: 'SET_PROD_SEARCH_DESTINATION', payload: false})
        //toggle panel display
        this.props.dispatch({type:'productSearch_TOGGLE_SEARCH_PANEL'})
    }

    saveRecipe(){
        console.log("Guardar receta producto")
        
    }

    onRemoveCard = (prod_id, is_input) => {
        
        if(is_input){
            this.props.dispatch({type: 'REMOVE_PROD_FROM_RECIPE_INPUT', payload: prod_id})
        }else{
            this.props.dispatch({type: 'REMOVE_PROD_FROM_RECIPE_OUTPUT', payload: prod_id})
        }
    }

    onIngredientQtyChange = (event, prod_id, is_input) => {
        const new_qty = event.target.value
        console.log("Event --> ", event)
        if(is_input){
            this.props.dispatch({type: 'CHANGE_QTY_PROD_RECIPE_INPUT', payload: {prod_id: prod_id, qty: new_qty}})
        }else{
            this.props.dispatch({type: 'CHANGE_QTY_PROD_RECIPE_OUTPUT', payload: {prod_id: prod_id, qty: new_qty}})
        }
    }

    buildCards(items){
        //build input cards
        const input_cards = this.props.inputs.map(prod => {
            return <IngredientCard
            key={prod.product.id}
            prod_data={prod}
            remove={this.onRemoveCard}
            changeQty={this.onIngredientQtyChange}
            is_input={true}>
            </IngredientCard>
        })
        //build output cards
        const output_cards = this.props.outputs.map(prod => {
            return <IngredientCard
            key={prod.product.id}
            prod_data={prod}
            remove={this.onRemoveCard}
            changeQty={this.onIngredientQtyChange}
            is_input={false}>
            </IngredientCard>
        })
        return {
            input: input_cards,
            output: output_cards
        }
    }

    render(){

        let input_cards = []
        let output_cards = []

        const card_data = this.buildCards()
        input_cards = card_data.input
        output_cards = card_data.output

        return <div className="create-recipe">
            <Search modelText='Producto' model='product' namespace='productSearch' 
            onRowDoubleClick={this.onProductSelected.bind(this)}
            sortedBy='code' />
            <h1>Edward Elric Power</h1>

            <div className="create-recipe-add-buttons">
                <button onClick={this.searchProductForInput.bind(this)}
                    className='form-control btn-info'>
                    Agregar Ingrediente
                </button>
                <button onClick={this.searchProductForOutput.bind(this)}
                    className='form-buttons-container-cancel form-control btn-info'>
                    Agregar Resultado
                </button>
            </div>

            <div className="create-recipe-body row">
                <div className="create-recipe-cards col-md-5">
                    <div className="create-recipe-cards-container">
                        <div className="create-recipe-cards-container-title">
                            Entra
                        </div>
                        {input_cards}
                    </div>
                </div>

                <div className="create-recipe-middle col-md-2">
                    <div className="rectangle"></div>
                    <div className="triangle-right">

                    </div>
                </div>

                <div className="create-recipe-cards col-md-5">
                    <div className="create-recipe-cards-container">
                        <div className="create-recipe-cards-container-title">
                            Sale
                        </div>
                        {output_cards}
                    </div>
                </div>
            </div>

            <div className="create-recipe-crud-buttons">
                <button onClick={this.saveRecipe.bind(this)}
                    className='form-control btn-success'>
                    Guardar Transformación
                </button>
            </div>

            
        </div>
    }
}