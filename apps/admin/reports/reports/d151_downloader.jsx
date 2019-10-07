import React from 'react'

const d151 = (props) => {
    
    console.log("Sent limit --> ", props.limit)

    return (
        <div>
            <div className="d151-title">Reporte D151</div>
            <p>Ingrese el monto mínimo de inclusión:</p>
            <input type="text" value={props.limit} onChange={props.onLimitChange}/>
            <a href={`/reportsExcel/d151/?start=${props.start}&end=${props.end}&money_limit=${props.limit}`}>D151</a>
        </div>
    )
}

export default d151