import React from 'react'

const sales_per_client = (props) => {
    
    let anchor = <p>Ingrese el código cédula antes de continuar</p>

    if(props.client && props.client !==""){
        anchor = <a href={`/reportsExcel/generalsales/?start=${props.start}&end=${props.end}&client=${props.client}`}>Ventas Cliente</a>
    }
    return (
        <div className="detail-reports-item">
            <div className="d151-title">Reporte Ventas Por Cliente</div>
            <p>Ingrese el código de cliente o cédula:</p>
            <input type="text" onChange={props.clientChange}/>
            {anchor}
            
        </div>
    )
}

export default sales_per_client