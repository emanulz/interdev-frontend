import React from 'react'
import {connect} from 'react-redux'
import AdminTable from '../../../../../../general/adminTable/adminTable.jsx'
import { getPaginationItemDispatch } from '../../../../../../utils/api.js'
import Select2 from 'react-select2-wrapper'
import Pagination from '../../../../../../general/pagination/pagination.jsx'
import ResultsPerPage from '../../../../../../general/pagination/resultsPerPage.jsx'


@connect((store) => {
    return {
        fetching: store.fetching.fetching,
        pageSize: store.pagination.pageSize,
        searchResults: store.adminSearch.searchResults,
        accepted_queued_tasks: store.epurchases.accepted_queued_tasks
    }
})
export default class AcceptQueue extends React.Component {

    constructor(props){
        super(props)
        this.state =  {
            purchases_mode: {}
        }
        
    }

    componentWillMount(){
        this.props.dispatch({type: 'FETCHING_STARTED'})

        const tasksKwargs = {
            url: `/api/administration/helpertasks/?task_detail=&task_type=0&completed=False&to_delete=False`,
            successType: 'PURCHASE_RECEPTION_TASKS_FULFILLED',
            errorType: 'PURCHASE_RECEPTION_TASKS_REJECTED'
        }

        this.props.dispatch(getPaginationItemDispatch(tasksKwargs))

    }

    // shouldComponentUpdate(){
    //     let rerender = this.rerender
    //     this.rerender = false
    //     return rerender
    // }

    setPurchaseExpenseGlobal(value){
        let new_purchases_mode = {}
        for(let key of Object.keys(this.state.purchases_mode)){
            new_purchases_mode[key] = value
        }
        this.setState({
            purchases_mode: new_purchases_mode
        })
        this.forceUpdate()
        console.log(this.state.purchases_mode)
    }

    parseTasksData(tasks){
        if(!tasks){
            return []
        }
        return tasks.map(t => {
            if(this.state.purchases_mode[t.id] === undefined){
                this.state.purchases_mode[t.id] = "Compra"
            }
            const t_details = JSON.parse(t.task_detail)
            let emisor_name = t_details.emisor_name
            if(emisor_name.length>40){
                emisor_name = emisor_name.substr(0,40) + "..."
            }
            return {
                id: t.id,
                doc_path: t_details.doc_path,
                emisor_name: emisor_name,
                doc_type: t_details.doc_type,
                TotalComprobante: t_details.TotalComprobante,
                purchase_mode: this.state.purchases_mode[t.id]
            }
        })
    }

    onPurchaseModeSelected(task_id, event){

        if(event.target.value === "Compra"){
            this.state.purchases_mode[task_id] = "Compra"
        }else if(event.target.value === "Gasto"){
            this.state.purchases_mode[task_id] = "Gasto"
        }

    }

    render(){

        const options = [
                {text: "Compra", id: "Compra"},
                {text: "Gasto", id: "Gasto"}
            ]
        
        const Select2Builder = (value, handler, param) => {
            return <Select2
                name='purchase_mode'
                value={value}
                className='form-control'
                onSelect={handler.bind(this, param)}
                data={options}
                options={{
                placeholder: 'Elija una Modalidad...',
                noResultsText: 'Sin elementos'
                }}
            />  
        }

        const headerOrder = [
            {
                field: 'id',
                text: 'Consecutivo',
                type: 'text'
            },
            // {
            //     field: 'doc_path',
            //     text: 'Documento',
            //     type: 'text'
            // },
            {
                field: 'emisor_name',
                text: 'Emisor',
                type: 'text'
            },
            {
                field: 'doc_type',
                text: 'Tipo',
                type: 'text'
            },
            {
                field: 'TotalComprobante',
                text: 'Total Comprobante',
                type: 'text'
            },
            {
                field: 'id',
                text: 'Modalidad',
                type: 'select2',
                value: 'purchase_mode',
                builder: Select2Builder,
                handler: this.onPurchaseModeSelected,
                
                
            }
        ]


        const fetching = <div />
        const tableData = this.props.searchResults.length ? this.props.searchResults : this.parseTasksData(this.props.accepted_queued_tasks)
        

        const is_expense_button =<button onClick={this.setPurchaseExpenseGlobal.bind(this, "Gasto")}
          className='form-buttons-container-save form-control btn-accent'>
            Todos GASTOS
        </button>

        const is_purchase_button =<button onClick={this.setPurchaseExpenseGlobal.bind(this, "Compra")}
        className='form-buttons-container-save form-control btn-primary'>
            Todos COMPRAS
        </button>
        
        const table = <AdminTable headerOrder={headerOrder} model="taskhelpers" data={tableData} idField='id'/>

        const content = this.props.fetching ? fetching : table

        return <div className='list list-container'>
            <div className='admin-list-header'>
                <h1>Listado de Compras por Aceptar:</h1>
            </div>
            <div className='admin-list-header'>
                <p>El botón Todos Gastos ajusta todas los documentos pendientes como Gastos tributarios,
                    mientras que el botón Todos Compras configura los ajusta como Compras tributarias.
                </p>
                {is_expense_button}
                {is_purchase_button}
            </div>
            {content}
        </div>
    }



}