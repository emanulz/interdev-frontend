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
        ftransfers: store.fileTransfer.transfers,
        transfer_mode: store.fileTransfer.transfer_mode

    }
})
export default class ListMassInv extends React.Component {


    componentWillMount(){
        this.props.dispatch({type: 'FETCHING_STARTED'})
        this.props.dispatch({type: `transferSearch_CLEAR_SEARCH_RESULTS`})
        
        let transfer_type="INPUT"

        if(this.props.match.params.mode === "output"){
            transfer_type = "OUTPUT"
        }else if(this.props.match.params.mode  ==="transfer"){
            transfer_type = "TRANSFER"
        }
        this.props.dispatch({type: 'SET_TRANSFER_MODE', payload: transfer_type})
        const transferKwargs = {
            url : `/api/filetransferslist/?limit=${this.props.pageSize}&ordering=-created&is_mass_input=2&transfer_type=${transfer_type}`,
            successType: 'FETCH_FTRANSFERS_FULFILLED',
            errorType: 'FETCH_FTRANSFERS_REJECTED'
        }

        this.props.dispatch(getPaginationItemDispatch(transferKwargs))
    }

    componentWillReceiveProps(nextProps){
        if(this.props.match.params.mode!== nextProps.match.params.mode){
            
            if(nextProps.match.params.mode !== undefined){
                this.props.dispatch({type: 'SET_TRANSFER_MODE', payload: nextProps.match.params.mode.toUpperCase()})
            }else{
                this.props.dispatch({type: 'SET_TRANSFER_MODE', payload: "FILE"})
            }
        
            const transferKwargs = {
                url : `/api/filetransferslist/?limit=${this.props.pageSize}&ordering=-created&is_mass_input=2&transfer_type=${nextProps.match.params.mode.toUpperCase()}`,
                successType: 'FETCH_FTRANSFERS_FULFILLED',
                errorType: 'FETCH_FTRANSFERS_REJECTED'
            }
            this.props.dispatch({type: 'FETCHING_STARTED'})
            this.props.dispatch(getPaginationItemDispatch(transferKwargs))
        }
    }



    render(){
        let title = ""
        let transfer_type="INPUT"
        switch(this.props.match.params.mode){
            case "input":
                {
                    title = "Listado de Ingresos Masivos"
                    break
                }
                case "output":
                {
                    transfer_type = "OUTPUT"
                    title = "Listado de Salidas Masivas"
                    break 
                }
                case "transfer":
                {
                    transfer_type = "TRANSFER"
                    title = "Listado Transferencias de Bodega Masivas"
                    break 
                }
                default:
                {
                    title="Listado"
                    break
                }

                
        }


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
                extraParams: [{name: "transfer_type", value: transfer_type}]
            }


        ]


        const  fetching = <div/>

        let tableData = this.props.searchResults.length ? this.props.searchResults : this.props.ftransfers
        const list = <AdminTable headerOrder={headerOrder} model='not-used' data={tableData}
            idField='id' />

        const content = this.props.fetching ? fetching : list

        

        

        let url = `/api/filetransferslist/?ordering=-created&is_mass_input=2&transfer_type=${transfer_type}`

        const paginationDiv = !this.props.searchResults.length
            ? <div className='admin-list-results-pagination' >
            <ResultsPerPage url={url} successType='FETCH_FTRANSFERS_FULFILLED' errorType='FETCH_FTRANSFERS_REJECTED' />
            <Pagination url={url} successType='FETCH_FTRANSFERS_FULFILLED' errorType='FETCH_FTRANSFERS_REJECTED' />
            </div>
            : <div />

            return <div className='list list-container'>
            
            <div className='admin-list-header'>
                <h1>{title}</h1>
            </div>

            <SearchAdmin model='filetransfer' namespace='transferSearch' />
            {paginationDiv}
            {content}
        
        </div>

    }
    

}