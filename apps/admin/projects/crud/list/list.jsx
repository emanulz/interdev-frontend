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
    projects: store.projects.projects,
    pageSize: store.pagination.pageSize
  }
})
export default class List extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_PROJECT', payload: ''})

    const projectKwargs = {
      url: `/api/projects/?limit=${this.props.pageSize}`,
      successType: 'FETCH_PROJECTS_FULFILLED',
      errorType: 'FETCH_PROJECTS_REJECTED'
    }

    this.props.dispatch(getPaginationItemDispatch(projectKwargs))

  }

  render() {

    const getClientNameClosure = (item) => {
      function getName(item) {
        if (item == undefined || item.client == '') {
          return 'SIN NOMBRE'
        }
        try {
          const client = JSON.parse(item)
          return `${client.name} ${client.last_name}`
        } catch (err) { console.log(err) }
        return 'ERROR EN NOMBRE'
      }
      return getName(item)
    }

    const headerOrder = [
      {
        field: 'id',
        text: 'Código',
        type: 'primary'
      }, {
        field: 'name',
        text: 'Nombre'
      }, {
        type: 'function_process',
        field: 'client',
        text: 'Cliente',
        worker_method: getClientNameClosure
      }, {
        field: 'description',
        text: 'Descripción'
      }
    ]

    const fetching = <div />
    const list = <AdminTable headerOrder={headerOrder} model='projects' data={this.props.projects}
      addLink='/admin/projects/add' idField='id' />

    const content = this.props.fetching ? fetching : list

    const addLink = <Link className='addBtn' to={'/admin/projects/add'}>
      <span className='fa fa-plus' />
      Agregar
    </Link>

    return <div className='list list-container'>
      <div className='admin-list-header'>
        <h1>Mantenimiento de Proyectos:</h1>
        {addLink}
      </div>
      <SearchAdmin model='project' namespace='adminSearch' />

      <div className='admin-list-results-pagination' >
        <ResultsPerPage url='/api/projects/' successType='FETCH_PROJECTS_FULFILLED' errorType='FETCH_PROJECTS_REJECTED' />
        <Pagination url='/api/projects/' successType='FETCH_PROJECTS_FULFILLED' errorType='FETCH_PROJECTS_REJECTED' />
      </div>
      {content}
    </div>

  }

}
