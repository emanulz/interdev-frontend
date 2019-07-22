/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import AdminTable from '../../../../../general/adminTable/adminTable.jsx'
import SearchAdmin from '../../../../../general/search/searchAdmin.jsx'
import { getPaginationItemDispatch } from '../../../../../utils/api.js'
import Pagination from '../../../../../general/pagination/pagination.jsx'
import ResultsPerPage from '../../../../../general/pagination/resultsPerPage.jsx'

@connect((store) => {
  return {
    fething: store.fetching.fetching,
    activities: store.activities.activities,
    pageSize: store.pagination.pageSize,
    searchResults: store.adminSearch.searchResults
  }
})
export default class List extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_ACTIVITY', payload: ''})

    const projectKwargs = {
      url: `/api/activities/?limit=${this.props.pageSize}`,
      successType: 'FETCH_ACTIVITIES_FULFILLED',
      errorType: 'FETCH_ACTIVITIES_REJECTED'
    }

    this.props.dispatch(getPaginationItemDispatch(projectKwargs))

  }

  render() {

    const headerOrder = [
      {
        field: 'id',
        text: 'Código',
        type: 'primary'
      }, {
        field: 'identifier',
        text: 'Identificador'
      }, {
        field: 'name',
        text: 'Nombre'
      }, {
        field: 'description',
        text: 'Descripción'
      }, {
        field: 'is_active',
        text: 'Activo?',
        type: 'bool'
      }
    ]

    const fetching = <div />
    const tableData = this.props.searchResults.length ? this.props.searchResults : this.props.activities
    const filteredData = tableData.filter(item => { return !item.deleted })
    const list = <AdminTable headerOrder={headerOrder} model='activities' data={filteredData}
      addLink='/admin/activities/add' idField='id' />

    const content = this.props.fetching ? fetching : list

    const addLink = <Link className='addBtn' to={'/admin/activities/add'}>
      <span className='fa fa-plus' />
      Agregar
    </Link>

    return <div className='list list-container'>
      <div className='admin-list-header'>
        <h1>Mantenimiento de Actividades:</h1>
        {addLink}
      </div>
      <SearchAdmin model='activity' namespace='adminSearch' notDeleted />

      <div className='admin-list-results-pagination' >
        <ResultsPerPage url='/api/activities/' successType='FETCH_ACTIVITIES_FULFILLED' errorType='FETCH_ACTIVITIES_REJECTED' />
        <Pagination url='/api/activities/' successType='FETCH_ACTIVITIES_FULFILLED' errorType='FETCH_ACTIVITIES_REJECTED' />
      </div>
      {content}
    </div>

  }

}
