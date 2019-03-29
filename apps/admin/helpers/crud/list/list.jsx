/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import AdminTable from '../../../../../general/adminTable/adminTable.jsx'
import { getPaginationItemDispatch } from '../../../../../utils/api.js'
import Pagination from '../../../../../general/pagination/pagination.jsx'
import ResultsPerPage from '../../../../../general/pagination/resultsPerPage.jsx'
import { withRouter } from 'react-router-dom'

@connect((store) => {
  return {
    fething: store.fetching.fetching,
    helpers: store.helpers.helpers,
    model: store.helpers.model,
    pageSize: store.pagination.pageSize
  }
})

class List extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'FETCHING_STARTED'})

    // const helper_model = this.props.location.pathname.split('/').pop()

    // this.props.dispatch({type: 'SET_HELPER_GROUP', payload: helper_model})
    const helpersKwargs = {
      url: `/api/administration/?limit=${this.props.pageSize}&group=${this.props.model}`,
      successType: 'FETCH_HELPERS_FULFILLED',
      errorType: 'FETCH_HELPERS_REJECTED'
    }

    //console.log("List colors display --> ", helpersKwargs)

    this.props.dispatch(getPaginationItemDispatch(helpersKwargs))

  }

  componentWillReceiveProps(){
    if(this.props.update){
      const helper_model = this.props.location.pathname.split('/').pop()

      this.props.dispatch({type: 'SET_HELPER_GROUP', payload: helper_model})
    }
  }

  componentWillUpdate(){
    if(this.props.update){
      const helper_model = this.props.location.pathname.split('/').pop()

      this.props.dispatch({type: 'SET_HELPER_GROUP', payload: helper_model})
    }
  }

  render() {

    const headerOrder = [
      {
        field: 'id',
        text: 'ID',
        type: 'primary'
      }, {
        field: 'name',
        text: 'Nombre'
      }, {
        field: 'code',
        text: 'Identificador'
      }
      , {
        field: 'description',
        text: 'Descripción'
      }
    ]

    const fetching = <div />
    
    const list = <AdminTable headerOrder={headerOrder} model={"helpers/"+this.props.model} data={this.props.helpers}
      addLink={`/admin/helpers/${this.props.model}/add`} idField='id' />

    const content = this.props.fetching ? fetching : list

    const addLink = <Link className='addBtn' to={`/admin/helpers/${this.props.model}/add`}>
      <span className='fa fa-plus' />
      Agregar
    </Link>

    return <div className='list list-container'>
      <div className='admin-list-header'>
        <h1>{`Mantenimiento de ${this.props.model.toUpperCase()}:`}</h1>
        {addLink}
      </div>
      <div className='admin-list-search'>
        <input
          type='text'
          placeholder='Ingrese un texto para buscar...'
        />
      </div>
      <div className='admin-list-results-pagination' >
        <ResultsPerPage url={`/api/administration/?group=${this.props.model}`} successType='FETCH_HELPERS_FULFILLED' errorType='FETCH_HELPERS_REJECTED' />
        <Pagination url={`/api/administration/?group=${this.props.model}`} successType='FETCH_HELPERS_FULFILLED' errorType='FETCH_HELPERS_REJECTED' />
      </div>
      {content}
    </div>

  }

}

export default withRouter(List)