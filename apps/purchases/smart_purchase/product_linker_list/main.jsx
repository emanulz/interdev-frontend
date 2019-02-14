import React from 'react'
import {connect} from 'react-redux'


@connect(store=>{
    return{
        invoice_to_link: store.smart_purchase.invoice_to_link,
        product_to_link: store.smart_purchase.product_to_link
    }
})
export default class ProductLinkerList extends React.Component{

    setProductActive(item, e){
        return this.props.dispatch({type:'SET_PRODUCT_TO_LINK', payload: item})
    }


    //builds a product graphical representation 
    buildProductItem(data, active_line, list_linked=true){
        
        let buildItem = (code, desc, pcode, pdesc, key, active_line) => {
            //add the active class accordingly 
            let active_class = ""
            if (active_line !== undefined && active_line !== null ){
                if(key===active_line.NumeroLinea)
                    active_class = " linker-item-active"
            }
             

            return <div className={"product-list-body-item" + active_class} key={key}
                onClick={this.setProductActive.bind(this, key)}>
                <div className={"product-list-body-item-pcode"}>
                    {pcode !==""?pcode:"Sin Código"}
                </div>
                <div className="product-list-body-item-pdesc">{pdesc}</div>
                <div className="product-list-body-item-code">{code}</div>
                <div className="product-list-body-item-desc">{desc}</div>
            </div>
        }

        const items = data.map((item) =>{
            const code = list_linked ? item.linked.code : "??"
            const description  = list_linked ? item.linked.description : "??"
            //console.log("Item for process --> ", item)

            if(list_linked && item.linked === "not-found"){
                return ''
            }else if(list_linked){
                return buildItem(code, description, item.Codigo, item.Detalle, item.NumeroLinea, active_line)

            }else if(!list_linked && item.linked === "not-found"){
                return buildItem(code, description, item.Codigo, item.Detalle, item.NumeroLinea, active_line)
            }else if(!list_linked){
                return ""
            }
            

        })

        return  <div className="product-list-body">
            {items}
        </div>
        
    }



    render(){
        const list_class = this.props.class_name

        const body_items = this.buildProductItem(
            this.props.invoice_to_link ? this.props.invoice_to_link.items_list: [],
            this.props.product_to_link,
            list_class === "product-linked-list" ? true : false
        )
        return <div className={list_class}>
            <h1>{this.props.name}</h1>
            <div className="product-list">
                <div className="product-list-header">
                    <div className="product-list-header-item-pcode">Código Proveedor</div>
                    <div className="product-list-header-item-pdesc">Descripción Proveedor</div>
                    <div className="product-list-header-item-code">Código Interno</div>
                    <div className="product-list-header-item-desc">Descripción Interna</div>
                </div>

                {body_items}

            </div>
        </div>
    }

}
