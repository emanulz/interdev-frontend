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
    permissions: store.activities.permissions,
    activity: store.activities.activityActive,
    nextActivity: store.activities.nextActivity,
    previousActivity: store.activities.PreviousActivity,
    activities: store.activities.activities
  }
})
export default class Update extends React.Component {

  componentDidMount() {
    this.props.dispatch({type: 'CLEAR_NEXT_PREV_ACTIVITY', payload: ''})
  }

  componentWillUpdate(nextProps) {

    const code = this.props.location.pathname.split('/').pop()

    if (nextProps.nextActivity == 0 && nextProps.previousActivity == 0 && nextProps.activities.length) {

      const kwargs = {
        items: [
          ...nextProps.activities
        ],
        codeField: 'id',
        code: code,
        dispatchType: 'SET_NEXT_PREV_ACTIVITY'
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
        <h1>EDITAR ACTIVIDAD {code}</h1>
        {/* <Link to={`/admin/activities/edit/${this.props.previousActivity}`}>
          <span className={`previous fa fa-chevron-circle-left`} />
        </Link>
        <Link to={`/admin/activities/edit/${this.props.nextActivity}`}>
          <span className='next fa fa-chevron-circle-right' />
        </Link> */}
        <span onClick={this.toggleBar.bind(this)} className='list fa fa-list' />
      </div>

      {content}

      <ItemsBar items={this.props.activities} tittle='Lista de Actividades' codeField='id' descriptionField='name'
        descriptionField2={false} editPath='/admin/activities/edit/' />
    </div>

  }

}
