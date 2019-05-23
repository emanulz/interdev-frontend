import React from 'react'
import {connect} from 'react-redux'
import {getPaginationItemDispatch} from '../../../../utils/api.js'
import AdminTable from '../../../../general/adminTable/adminTable.jsx'
import Pagination from '../../../../general/pagination/pagination.jsx'
import ResultsPerPage from '../../../../general/pagination/resultsPerPage.jsx'
import SearchAdmin from '../../../../general/search/searchAdmin.jsx'


@connect(store=>{
    return {
        fetching: store.fetching.fetching,
        pageSize: store.pagination.pageSize,
        searchResults: store.transferSearch.searchResults,  
        ftransfers: store.fileTransfer.transfers
    }
})
export default class ListMassInv extends React.Component {


    componentWillMount(){
        this.props.dispatch({type: 'FETCHING_STARTED'})
        this.props.dispatch({type: `transferSearch_CLEAR_SEARCH_RESULTS`})

        const transferKwargs = {
            url : `/api/filetransferslist/?limit=${this.props.pageSize}&ordering=-created&is_mass_input=2`,
            successType: 'FETCH_FTRANSFERS_FULFILLED',
            errorType: 'FETCH_FTRANSFERS_REJECTED'
        }

        this.props.dispatch(getPaginationItemDispatch(transferKwargs))
    }


    componentWillUpdate(nextProps){

    }


    render(){

        let get_name = (el)=>{

            let user = ""
            let first_name = 'Indefinido'
            let last_name = ""
            let user_name = ""
            try {
                user = JSON.parse(el.user)
                first_name = user.first_name
                last_name = user.last_name
                user_name = user.username
            } catch (error) {
                
            }
            return `${first_name} ${last_name} / ${user_name}`

        }

        let get_file = (el)=>{
            let file_name = el.transfer_file
            if(file_name === ""){
                return "No Disponible"
            }

            let target_file = `/media/inv_transfers/${file_name}`
            return <a download={file_name} href={target_file}>Descargar</a>
        }

        const headerOrder = [
            {
                field: 'id',
                text: 'Consecutivo',
                type: 'text'
            },
            {
                field: 'transfer_id',
                text: 'Ingreso?',
                type: 'bool'
            },
            {
                field: 'notes',
                text: 'Notas',
                type: 'text'
            },
            {
                field: 'user',
                text: 'Creada por',
                type: 'function_element',
                worker_method: get_name
            },

            {
                field: 'created',
                text: 'Creación',
                type: 'date'
            },
            {
                field: 'id',
                text: 'Imprimible',
                textToRender: 'Imprimible',
                baseLink: '/reportsExcel/massinvload',
                type: 'link_params',
                fieldAsParams: [{field: 'id', name:'massinvid'}],
                extraParams: []
            }


        ]


        const  fetching = <div/>

        let tableData = this.props.searchResults.length ? this.props.searchResults : this.props.ftransfers
        const list = <AdminTable headerOrder={headerOrder} model='clients' data={tableData}
            idField='id' />

        const content = this.props.fetching ? fetching : list

        const paginationDiv = !this.props.searchResults.length
            ? <div className='admin-list-results-pagination' >
            <ResultsPerPage url='/api/filetransferslist/?ordering=-created&is_mass_input=2' successType='FETCH_FTRANSFERS_FULFILLED' errorType='FETCH_FTRANSFERS_REJECTED' />
            <Pagination url='/api/filetransferslist/?ordering=-created&is_mass_input=2' successType='FETCH_FTRANSFERS_FULFILLED' errorType='FETCH_FTRANSFERS_REJECTED' />
            </div>
            : <div />

            return <div className='list list-container'>
            
            <div className='admin-list-header'>
                <h1>Listado Ingresos Inventario</h1>
            </div>

            <SearchAdmin model='filetransfer' namespace='transferSearch' />
            {paginationDiv}
            {content}
        
        </div>

    }
    

}