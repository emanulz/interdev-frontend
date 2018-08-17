import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    departments: store.searchRestaurant.departments
  }
})
export default class RestaurantDepartments extends React.Component {

  setDepartmentActive(id) {
    this.props.dispatch({type: 'SEARCH_RESTAURANT_SET_DEPARTMENT_ACTIVE', payload: id})
  }

  render() {

    const departmentList = this.props.departments.map(department => {
      return <div key={department.id} className='restaurant-search-departments-single' onClick={this.setDepartmentActive.bind(this, department.id)}>
        {department.name}
      </div>
    })
    departmentList.push(<div key={'noDepartment'} className='restaurant-search-departments-single' onClick={this.setDepartmentActive.bind(this, 'noDepartment')}>
      {'Genéricos'}
    </div>)
    return <div className='restaurant-search-departments'>
      {departmentList}
    </div>

  }

}
