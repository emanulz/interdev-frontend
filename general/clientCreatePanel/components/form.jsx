/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import Select2 from 'react-select2-wrapper'

@connect((store) => {
  return {
    client: store.clientCreatePanel.clientActive,
    autoCode: store.clientCreatePanel.autoCode,
    provinces: store.clientCreatePanel.provinces,
    cantons: store.clientCreatePanel.cantons,
    districts: store.clientCreatePanel.districts,
    towns: store.clientCreatePanel.towns
  }
})
export default class Form extends React.Component {

  // HANDLE INPUT CHANGE
  handleInputChange(event) {

    const target = event.target
    let value
    switch (target.type) {
      case 'checkbox':
      {
        value = target.checked
        break
      }
      case 'number':
      {
        value = parseFloat(target.value)
          ? parseFloat(target.value)
          : 0
        break
      }
      case 'select-one':
      {
        this.clearAdrresses(target.name)
        value = target.value
        break
      }
      default:
      {
        value = target.value
      }
    }

    const name = target.name

    const client = {
      ...this.props.client
    }

    client[name] = value

    this.props.dispatch({type: 'SET_CREATE_CLIENT', payload: client})
  }

  handleAutoCodeChange(event) {
    const target = event.target
    const value = target.checked
    this.props.dispatch({type: 'SET_CREATE_CLIENT_AUTO_CODE', payload: value})
  }

  clearAdrresses(name) {
    if (name == 'province') {
      this.props.dispatch({type: 'CLEAR_CANTON', payload: ''})
      this.props.dispatch({type: 'CLEAR_DISTRICT', payload: ''})
      this.props.dispatch({type: 'CLEAR_TOWN', payload: ''})
    }
    if (name == 'canton') {
      this.props.dispatch({type: 'CLEAR_DISTRICT', payload: ''})
      this.props.dispatch({type: 'CLEAR_TOWN', payload: ''})
    }
    if (name == 'district') {
      this.props.dispatch({type: 'CLEAR_TOWN', payload: ''})
    }
  }

  render() {

    // ********************************************************************
    // SELECT2 DATA
    // ********************************************************************
    const provinces = this.props.provinces
    const cantons = this.props.cantons
    const districts = this.props.districts
    const towns = this.props.towns

    // map the provinces and return items to render in Select2
    const provincesData = provinces.map(province => {
      return {text: `${province.code} - ${province.name}`, id: `${province.code}`}
    })

    // Filter the cantons data Based on the province selection stored in client active item
    const filteredCantons = cantons.filter(el => {
      return el.province_code == this.props.client.province
    })

    // map the filtered cantons and return items to render in Select2
    const cantonsData = filteredCantons.map(canton => {
      return {text: `${canton.code} - ${canton.name}`, id: canton.code}
    })

    // Filter the districts data Based on the province and canton selection stored in client active item
    const filteredDistricts = districts.filter(el => {
      return el.province_code == this.props.client.province && el.canton_code == this.props.client.canton
    })

    // map the filtered districts and return items to render in Select2
    const districtsData = filteredDistricts.map(district => {
      return {text: `${district.code} - ${district.name}`, id: district.code}
    })

    // Filter the towns data Based on the province and canton selection stored in client active item
    const filteredTowns = towns.filter(el => {
      return el.province_code == this.props.client.province && el.canton_code == this.props.client.canton && el.district_code == this.props.client.district
    })

    // map the filtered towns and return items to render in Select2
    const townsData = filteredTowns.map(town => {
      return {text: `${town.code} - ${town.name}`, id: town.code}
    })

    return <div className='clientCreatePanel-content-form'>
      <div className='clientCreatePanel-content-form-inline'>
        <div className='form-group'>
          <label>Código Automático</label>
          <input checked={this.props.autoCode} name='autoCode' onChange={this.handleAutoCodeChange.bind(this)}
            type='checkbox' className='form-control' />
        </div>
        <div className='form-group'>
          <label>Código</label>
          <div className='insideIcon'>
            <input disabled={this.props.autoCode} value={this.props.client.code} name='code' onChange={this.handleInputChange.bind(this)} type='text'
              className='form-control' />
            <i className='fa fa-keyboard-o' />
          </div>
        </div>
      </div>

      <div className='clientCreatePanel-content-form-inline'>
        <div className='form-group'>
          <label>Nombre</label>
          <div className='insideIcon'>
            <input value={this.props.client.name} name='name' onChange={this.handleInputChange.bind(this)} type='text'
              className='form-control' />
            <i className='fa fa-user' />
          </div>
        </div>

        <div className='form-group'>
          <label>Apellidos</label>
          <div className='insideIcon'>
            <input value={this.props.client.last_name} name='last_name' onChange={this.handleInputChange.bind(this)}
              type='text'
              className='form-control' />
            <i className='fa fa-users' />
          </div>
        </div>
      </div>

      <div className='clientCreatePanel-content-form-inline'>
        <div className='form-group'>
          <label>Teléfono</label>
          <div className='insideIcon'>
            <input value={this.props.client.phone_number} name='phone_number' onChange={this.handleInputChange.bind(this)} type='text'
              className='form-control' />
            <i className='fa fa-phone' />
          </div>
        </div>

        <div className='form-group'>
          <label>Email</label>
          <div className='insideIcon'>
            <input value={this.props.client.email} name='email' onChange={this.handleInputChange.bind(this)} type='email'
              className='form-control' />
            <i className='fa fa-at' />
          </div>
        </div>
      </div>
      <div className='clientCreatePanel-content-form-inline'>
        <div className='form-group'>
          <label>Tipo de Identificación</label>
          <div className='insideIcon'>
            <select onChange={this.handleInputChange.bind(this)} className='form-control' name='id_type'
              value={this.props.client.id_type} >
              <option value='01'>Cédula Física</option>
              <option value='02'>Cédula Jurídica</option>
              <option value='03'>Pasaporte</option>
            </select>
            <i className='fa fa-id-card' />
          </div>
        </div>
        <div className='form-group'>
          <label>Identificación</label>
          <div className='insideIcon'>
            <input value={this.props.client.id_num} name='id_num' onChange={this.handleInputChange.bind(this)} type='text'
              className='form-control' />
            <i className='fa fa-id-card' />
          </div>
        </div>

      </div>

      <div className='clientCreatePanel-content-form-inline'>

        <div className='form-group'>
          <label>Provincia</label>
          <div className='insideIcon'>
            <Select2
              name='province'
              data={provincesData}
              value={this.props.client.province}
              className='form-control'
              onSelect={this.handleInputChange.bind(this)}
              options={{
                placeholder: 'Elija una Provincia...',
                noResultsText: 'Sin elementos'
              }}
            />
            <i className='fa fa-home' />
          </div>
        </div>
        <div className='form-group'>
          <label>Canton</label>
          <div className='insideIcon'>
            <Select2
              name='canton'
              data={cantonsData}
              value={this.props.client.canton}
              className='form-control'
              onSelect={this.handleInputChange.bind(this)}
              options={{
                placeholder: 'Elija un Cantón...',
                noResultsText: 'Sin elementos'
              }}
            />
            <i className='fa fa-home' />
          </div>
        </div>

      </div>
      <div className='clientCreatePanel-content-form-inline'>
        <div className='form-group'>
          <label>Distrito</label>
          <div className='insideIcon'>
            <Select2
              name='district'
              data={districtsData}
              value={this.props.client.district}
              className='form-control'
              onSelect={this.handleInputChange.bind(this)}
              options={{
                placeholder: 'Elija un Distrito...',
                noResultsText: 'Sin elementos'
              }}
            />
            <i className='fa fa-home' />
          </div>
        </div>
        <div className='form-group'>
          <label>Barrio</label>
          <div className='insideIcon'>
            <Select2
              name='town'
              data={townsData}
              value={this.props.client.town}
              className='form-control'
              onSelect={this.handleInputChange.bind(this)}
              options={{
                placeholder: 'Elija un Barrio...',
                noResultsText: 'Sin elementos'
              }}
            />
            <i className='fa fa-home' />
          </div>
        </div>
      </div>
    </div>

  }

}
