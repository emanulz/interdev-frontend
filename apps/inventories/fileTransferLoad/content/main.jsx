import React from 'react'
import {connect} from 'react-redux'


@connect(store=>{
    return {
        transferData: store.transferDataLoad.transferData
    }
})
export default class TransferContent extends React.Component {


    componentWillMount(){
        
    }



    // {this.state.data.map(( listValue, index ) => {
    //     return (
    //       <tr key={index}>
    //         <td>{listValue.id}</td>
    //         <td>{listValue.title}</td>
    //         <td>{listValue.price}</td>
    //       </tr>
    //     );
    //   })}

    render(){

        let body_items = ''

        if(this.props.transferData.prods_data){
            body_items = this.props.transferData.prods_data.map((item, index) => {
                return(
                    <div className="transfer-view-content-body-row">
                        <div>{item.code}</div>
                        <div>Descripción</div>
                        <div>{item.qty}</div>
                        <div>{item.cost}</div>
                        <div>{item.pu1}</div>
                    </div>
                )
            
            })
        }


    return <div className="transfer-view-content">
        <div className="transfer-view-content-header">
            <div className="transfer-view-content-header-item">
                Código
            </div>
            <div className="transfer-view-content-header-item">
                Descripción
            </div>
            <div className="transfer-view-content-header-item">
                Cantidad
            </div>
            <div className="transfer-view-content-header-item">
                Costo
            </div>
            <div className="transfer-view-content-header-item">
                Precio1 IVI
            </div>
        </div>
        
        <div className="transfer-view-content-body">
            {body_items}
        </div>
        
    </div>
    }
}





