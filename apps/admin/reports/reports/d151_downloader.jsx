import React from 'react'

const d151 = (props) => {

    let anchor = <a href={`/reportsExcel/d151/?start=${props.start}&end=${props.end}&money_limit=${props.limit}`}>D151</a>
    console.log("Limit client --> ", props.client)
    if(props.client && props.client !== ''){
        console.log("Limit client use")
        anchor = <a href={`/reportsExcel/d151/?start=${props.start}&end=${props.end}&money_limit=${props.limit}&client=${props.client}`}>D151</a>
    }
    return (
        <div className="detail-reports-item">
            <div className="d151-title">Reporte D151</div>
            <p>Ingrese el monto mínimo de inclusión:</p>
            <input type="text" value={props.limit} onChange={props.onLimitChange}/>
            <p>Si desea que sea para un único cliente, ingrese el código o cédula.</p>
            <p>De lo contrario, deje en blanco el campo de entrada.</p>
            <input type="text" value={props.client} onChange={props.clientChange}/>
            {anchor}
        </div>
    )
}

export default d151