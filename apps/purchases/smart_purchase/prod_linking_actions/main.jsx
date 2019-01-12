import React from 'react'
import {connect} from 'react-redux'

import {generalSave} from '../../../../utils/api.js'
import {calculateRealUtility} from '../../general/product/actions.js'

@connect(store=>{
    return {
        product_to_link: store.smart_purchase.product_to_link
    }
})
export default class ProdLinkingActions extends React.Component {

    goToStepB(){
        this.props.dispatch({type: "GO_TO_STEP", payload: "b"})
    }

    goToStepC(){
        this.props.dispatch({type: "GO_TO_STEP", payload: "c"})
    }

    createNewProduct(){
        //create a new product from the currently active product, granted it is not
        //linked, meaning there is already a product representing it

        console.log("Create a new product from XML data")

        if(this.props.product_to_link.linked !== "not-found"){
            this.props.dispatch({type:"SMART_PRODUCT_ALREADY_EXISTS"})
        }

        const  prod = this.props.product_to_link
        //get the tax data
        console.log("Meta --> ", prod.ImpuestoMeta)
        const total_tax = prod.ImpuestoMeta.reduce((acu, item)=>{
            return acu + parseFloat(item.Tarifa)
        }, 0)

        //create a duck product
        let product = {
            use_taxes: false,
            taxes: 0,
            use_taxes2: false,
            taxes2: 0,
            use_taxes3: false,
            taxes3: 0,
            pred_discount: 0
        }

        for (let index=0; index < prod.ImpuestoMeta.length; index++){
            switch(index){
                case 0:
                {
                    product.use_taxes = true
                    product.taxes = parseFloat(prod.ImpuestoMeta[index].Tarifa)
                    break
                }
                case 1:
                {
                    product.use_taxes2 = true
                    product.taxes2 = parseFloat(prod.ImpuestoMeta[index].Tarifa)
                    break
                }
                case 2:
                {
                    product.use_taxes3 = true
                    product.taxes3 = parseFloat(prod.ImpuestoMeta[index].Tarifa)
                    break
                }
                default:
                {
                    console.log("FUCK OFF!! MORE THAN 3 TAXES!!!")
                }
                        
            }
        }
        console.log("Total tax --> ", total_tax)
        console.log("Prod --> ", prod)
        const unit_price_no_tax = parseFloat(prod.PrecioUnitario) / (1+total_tax/100.0)
        console.log("Unit price no tax --> ", unit_price_no_tax)
        const def_utility_p1 = 40
        const def_utility_p2 = 35
        const def_utility_p3 = 30

        let ballpark = (cost, utility, total_tax)=>{
            return 0
        }
        const t_p1 = 0
        //calculate pricing data for the three target pricepoints
        const real_p1_Data = calculateRealUtility(
            unit_price_no_tax, //cost
            def_utility_p1, //target_utility
            t_p1, //target_price
            product, //QUACK QUACK
            'byUtility', //updatePattern
            'cost_based', //utility_method
            5 //round_to_coin
        )

        const real_p2_Data = calculateRealUtility(
            unit_price_no_tax, //cost
            def_utility_p2, //target_utility
            0, //target_price
            product, //QUACK QUACK
            'byUtility', //updatePattern
            'cost_based', //utility_method
            5 //round_to_coin
        )
        const real_p3_Data = calculateRealUtility(
            unit_price_no_tax, //cost
            def_utility_p3, //target_utility
            0, //target_price
            product, //QUACK QUACK
            'byUtility', //updatePattern
            'cost_based', //utility_method
            5 //round_to_coin
        )

        console.log("Real p1 data --> ", real_p1_Data)
        console.log("Real p2 data --> ", real_p2_Data)
        console.log("Real p3 data --> ", real_p3_Data)
        
        const prod_kwargs = {
            description: prod.Detalle,
            unit: prod.UnidadMedida,
            inventory_enabled: true,
            inventory_negative: true,
            use_taxes: product.use_taxes,
            taxes: product.taxes,
            use_taxes2: product.use_taxes2,
            taxes2: product.taxes2,
            use_taxes3: product.use_taxes3,
            taxes3: product.taxes3,
            utility1: real_p1_Data.real_utility,
            utility2: real_p2_Data.real_utility,
            utility3: real_p3_Data.real_utility,
            sell_price1: real_p1_Data.new_price,
            sell_price2: real_p2_Data.new_price,
            sell_price3: real_p3_Data.new_price,
            price: real_p1_Data/total_tax,
            price1: real_p1_Data/total_tax,
            price2: real_p2_Data/total_tax,
            price3: real_p3_Data/total_tax,
            cost: unit_price_no_tax
        }

        if(len(prod.CodigosMeta)>0){
            prod_kwargs["supplier_code"] = prod.CodigosMeta.code
        }

        const createKwargs = {
            url: '/api/facturareception/processHaciendaXML/',
            method: 'post',
            successType: 'SMART_PROD_CREATION_COMPLETE',
            errorType: 'SMART_PROD_CREATION_ERROR',
            data: prod_kwargs,
            succesMessage: "Producto Creado satisfactoriamente",
            errorMessage: "Ocurrio un creando el producto"
        }

    }

    displayProductSearch(){
        console.log("Display product search for linking")
    }

    unlinkProduct(){
        console.log("Unlink product")
    }

    openProductDetail(){
        console.log("Show product detail in new window")
    }

    render() {
        return <div className="prod-actions">
            <h1 className="section_header">Acciones Disponibles</h1>
            <hr/>
            <div className="prod-actions-action"
                onClick={this.displayProductSearch.bind(this)}>
                <div className="prod-actions-action-row">
                    <div>Enlazar Producto</div>
                    <i className="fa fa-link"></i>
                </div>
                <div className="doc-actions-action-row">
                    <p>Vincular producto de proveedor con producto en el sistema</p>
                </div>
            </div>
            <div className="prod-actions-action"
                onClick={this.createNewProduct.bind(this)}>
                <div className="prod-actions-action-row">
                    <div>Crear Producto</div>
                    <i className="fa fa-link"></i>
                </div>
                <div className="doc-actions-action-row">
                    <p>Crear un nuevo producto con la información en el XML. 
                        Se vinculará automáticamente.</p>
                </div>
            </div>
            <div className="prod-actions-action"
                onClick={this.unlinkProduct.bind(this)}>
                <div className="prod-actions-action-row">
                    <div>Desenlazar Producto</div>
                    <i className="fa fa-link"></i>
                </div>
                <div className="doc-actions-action-row">
                    <p>Romper vínculo entre producto de proveedor y el interno.</p>
                </div>
            </div>

            <div className="prod-actions-action"
                onClick={this.openProductDetail.bind(this)}>
                <div className="prod-actions-action-row">
                    <div>Mostrar producto</div>
                    <i className="fa fa-link"></i>
                </div>
                <div className="doc-actions-action-row">
                    <p>Muestra el detalle del producto en la página de administración.</p>
                </div>
            </div>

        </div>
    }

}