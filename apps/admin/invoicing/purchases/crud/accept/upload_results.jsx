import React from 'react'

import AdminTable from '../../../../../../general/adminTable/adminTable.jsx'

const upload_results = (props) => {

    let root_class = "upload-result"
    if(props.visible){
        root_class += " is-visible"
    }

    const total_processed_files = props.results.length

    let results_table = <h1 className="upload-result-content-title">
        Todos los archivos fueron puestos en cola de aceptación
    </h1>
    let table_data_rejected = props.results.filter(a=>{
        return a.result.can_be_accepted === false
    })

    const total_rejected_files = table_data_rejected.length

    let table_data = table_data_rejected.map(a=>{
        return {
            emisor: a.result.emisor.Nombre,
            amount: a.result.resumen.TotalVenta,
            created: a.result.header.FechaEmision.split('T')[0],
            consecutive: a.result.header.NumeroConsecutivo,
            reason: a.result.reason
        }
    });


    if(props.results.length>0){
        const headerOrder = [
            {
                field: 'emisor',
                text: 'Emisor',
                type: 'text'
            },
            {
                field: 'amount',
                text: 'Monto',
                type: 'text'
            },
            {
                field: 'consecutive',
                text: 'Consecutivo',
                type: 'text'
            },
            {
                field: 'reason',
                text: 'Razón',
                type: 'text'
            },
            {
                field: 'created',
                text: 'Fecha',
                type: 'date'
            }
        ]

        results_table = <AdminTable headerOrder={headerOrder} data={table_data}></AdminTable>
    }

    return (

        

        <div className={root_class}>
            <div className="upload-result-content">
                <h1 className="upload-result-content-title">Resultado de procesamiento de archivos</h1>
                
                <p className="upload-result-content-legend">El siguiente listado contiene motivos por los cuales algunos
                    documentos no pudieron ser aceptados tributariamente.
                    Asegure se estudiar el motivo y buscar una solución.
                </p>
                <hr/>
                <p className="upload-result-content-highlight">Del total de {total_processed_files}archivos, {total_rejected_files} presentaron problemas de validación.</p>
                {results_table}
                <div>
                <button onClick={props.dismiss}
                    className='form-control btn-danger'>
                    Cerrar
                </button>
                </div>

            </div>

        
        </div>
    )};


export default upload_results;