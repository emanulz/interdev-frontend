/*
 * Module dependencies
 */
import React from 'react'
import Form from './form/form.jsx'

import Unauthorized from '../../../../general/unauthorized.jsx'
import {connect} from 'react-redux'
import {setNextPrevItem} from '../../../../utils/api'
// import {Link} from 'react-router-dom'
import UpdateButtons from './form/updateButtons.jsx'
import ItemsBar from '../../layout/itemsBar/itemsBar.jsx'
import {toggleItemsBar} from '../../layout/itemsBar/actions'

@connect((store) => {
  return {
    permissions: store.projects.permissions,
    project: store.projects.projectActive,
    nextProject: store.projects.nextProject,
    previousProject: store.projects.PreviousProject,
    projects: store.projects.projects
  }
})
export default class Update extends React.Component {

  componentDidMount() {
    this.props.dispatch({type: 'CLEAR_NEXT_PREV_PROJECT', payload: ''})
  }

  componentWillUpdate(nextProps) {

    const code = this.props.location.pathname.split('/').pop()

    if (nextProps.nextProject == 0 && nextProps.previousProject == 0 && nextProps.projects.length) {

      const kwargs = {
        items: [
          ...nextProps.projects
        ],
        codeField: 'consecutive',
        code: code,
        dispatchType: 'SET_NEXT_PREV_PROJECT'
      }

      this.props.dispatch(setNextPrevItem(kwargs))

    }
  }

  toggleBar() {
    toggleItemsBar()
  }

  // Main Layout
  render() {

    let content = ''

    const code = this.props.location.pathname.split('/').pop()

    switch (this.props.permissions.change) {
      case true:
      {
        content = <div className='heigh100'>
          <Form key={code} update location={this.props.location} />
          <UpdateButtons />
        </div>
        break
      } // case

      case false:
      {
        content = <Unauthorized />
        break
      } // case
      default:
      {
        content = <div>FETCHING</div>
        break
      } // case
    }

    return <div className='create heigh100'>
      <div className='create-edit-header'>
        <h1>EDITAR PROYECTO {code}</h1>
        {/* <Link to={`/admin/projects/edit/${this.props.previousProject}`}>
          <span className={`previous fa fa-chevron-circle-left`} />
        </Link>
        <Link to={`/admin/projects/edit/${this.props.nextProject}`}>
          <span className='next fa fa-chevron-circle-right' />
        </Link> */}
        <span onClick={this.toggleBar.bind(this)} className='list fa fa-list' />
      </div>

      {content}

      <ItemsBar items={this.props.projects} tittle='Lista de Proyectos' codeField='id' descriptionField='name'
        descriptionField2={false} editPath='/admin/projects/edit/' />
    </div>

  }

}
