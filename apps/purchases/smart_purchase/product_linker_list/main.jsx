import React from 'react'
import {connect} from 'react-redux'


@connect(store=>{
    return{
        invoice_to_link: store.smart_purchase.invoice_to_link,
    }
})
export default class ProductLinkerList extends React.Component{


    //builds a product graphical representation 
    buildProductItem(data, list_linked=true){
        const items = data.map(item =>{
            const code = list_linked ? item.linked.code : "??"
            const description  = list_linked ? item.linked.description : "??"
            console.log("Item for process --> ", item)
            return <div className="product-list-body-item">
                <div className="product-list-body-item-pcode">
                    {item.Codigo !==""?item.Codigo:"Sin Código"}
                </div>
                <div className="product-list-body-item-pdesc">{item.Detalle}</div>
                <div className="product-list-body-item-code">{code}</div>
                <div className="product-list-body-item-desc">{description}</div>
            </div>
        })
        return items
    }

    render(){
        const list_class = this.props.class_name

        const body_items = this.buildProductItem(
            this.props.invoice_to_link ? this.props.invoice_to_link.items_list: [],
            this.props.name === "Productos Enlazados" ? true : false
        )
        return <div className={list_class}>
            <h1>{this.props.name}</h1>
            <div className="product-list">
                <div className="product-list-header">
                    <div className="product-list-header-item">Código Proveedor</div>
                    <div className="product-list-header-item">Descripción Proveedor</div>
                    <div className="product-list-header-item">Código Interno</div>
                    <div className="product-list-header-item">Descripción Interna</div>
                </div>

                <div className="product-list-body">
                    {body_items}
                </div>
            </div>
        </div>
    }

}
