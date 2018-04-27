import React from 'react'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'
import { setItem } from '../../../../../utils/api'
import Select2 from 'react-select2-wrapper'

@connect((store) => {
  return {
    sender: store.senders.senderActive,
    senders: store.senders.senders,
    provinces: store.addresses.provinces,
    cantons: store.addresses.cantons,
    districts: store.addresses.districts,
    towns: store.addresses.towns
  }
})

class Form extends React.Component {
  // REACT METHODS
  componentWillMount() {

    this.props.dispatch({type: 'CLEAR_SENDER', payload: ''})
    this.props.dispatch({type: 'CLEAR_NEXT_PREV_SENDER', payload: ''})

    if (this.props.update) {

      const lookUp = this.props.location.pathname.split('/').pop()

      const kwargs = {
        lookUpField: 'code',
        url: '/api/senders/',
        lookUpValue: lookUp,
        dispatchType: 'SET_SENDER',
        dispatchType2: 'SET_SENDER_OLD',
        dispatchErrorType: 'SENDER_NOT_FOUND',
        lookUpName: 'código',
        modelName: 'Emisores',
        redirectUrl: '/admin/senders',
        history: this.props.history
      }
      this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      this.props.dispatch(setItem(kwargs))

    }
  }

  componentWillUpdate(nextProps) {

    if (this.props.update) {

      const lookUp = this.props.location.pathname.split('/').pop()

      if (nextProps.sender.id == '0000000000') {

        const kwargs = {
          lookUpField: 'code',
          url: '/api/senders/',
          lookUpValue: lookUp,
          dispatchType: 'SET_SENDER',
          dispatchType2: 'SET_SENDER_OLD',
          dispatchErrorType: 'SENDER_NOT_FOUND',
          lookUpName: 'código',
          modelName: 'Emisores',
          redirectUrl: '/admin/senders',
          history: this.props.history
        }
        this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        this.props.dispatch(setItem(kwargs))

      }
    }
  }

  // HANDLE INPUT CHANGE
  handleInputChange(event) {

    const target = event.target
    let value
    // const value = target.type === 'checkbox' ? target.checked : target.value
    console.log(target.type)
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

    const sender = {
      ...this.props.sender
    }

    sender[name] = value

    this.props.dispatch({type: 'SET_SENDER', payload: sender})
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

  fieldFocus(ev) {
    ev.target.select()
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

    // Filter the cantons data Based on the province selection stored in sender active item
    const filteredCantons = cantons.filter(el => {
      return el.province_code == this.props.sender.province
    })

    // map the filtered cantons and return items to render in Select2
    const cantonsData = filteredCantons.map(canton => {
      return {text: `${canton.code} - ${canton.name}`, id: canton.code}
    })

    // Filter the districts data Based on the province and canton selection stored in sender active item
    const filteredDistricts = districts.filter(el => {
      return el.province_code == this.props.sender.province && el.canton_code == this.props.sender.canton
    })

    // map the filtered districts and return items to render in Select2
    const districtsData = filteredDistricts.map(district => {
      return {text: `${district.code} - ${district.name}`, id: district.code}
    })

    // Filter the towns data Based on the province and canton selection stored in sender active item
    const filteredTowns = towns.filter(el => {
      return el.province_code == this.props.sender.province && el.canton_code == this.props.sender.canton && el.district_code == this.props.sender.district
    })

    // map the filtered towns and return items to render in Select2
    const townsData = filteredTowns.map(town => {
      return {text: `${town.code} - ${town.name}`, id: town.code}
    })

    // ********************************************************************
    // RETURN BLOCK
    // ********************************************************************
    return <div className='col-xs-12 row form-container'>

      <div className='col-xs-12 col-sm-4 fields-container first'>

        <span>Datos generales</span>
        <hr />

        <div className='form-group'>
          <label>Razón Social</label>
          <input value={this.props.sender.name} name='name' onChange={this.handleInputChange.bind(this)} type='text'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Nombre Comercial</label>
          <input value={this.props.sender.commercial_name} name='commercial_name' onChange={this.handleInputChange.bind(this)}
            type='text'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Tipo de Identificación</label>
          <select onChange={this.handleInputChange.bind(this)} className='form-control' name='id_type'
            value={this.props.sender.id_type} >
            <option value='01'>Cédula Física</option>
            <option value='02'>Cédula Jurídica</option>
            <option value='03'>Pasaporte</option>
          </select>
        </div>

        <div className='form-group'>
          <label>Identificación</label>
          <input value={this.props.sender.id_number} onChange={this.handleInputChange.bind(this)} name='id_number' type='text'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Email</label>
          <input value={this.props.sender.email} onChange={this.handleInputChange.bind(this)} name='email'
            type='email' className='form-control' />
        </div>

      </div>

      <div className='col-xs-12 col-sm-4 fields-container buttons second'>

        <span>Direccion</span>
        <hr />

        <div className='form-group'>
          <label>Provincia</label>
          <Select2
            name='province'
            data={provincesData}
            value={this.props.sender.province}
            className='form-control'
            onSelect={this.handleInputChange.bind(this)}
            options={{
              placeholder: 'Elija una Provincia...',
              noResultsText: 'Sin elementos'
            }}
          />
        </div>

        <div className='form-group'>
          <label>Cantón</label>
          <Select2
            name='canton'
            data={cantonsData}
            value={this.props.sender.canton}
            className='form-control'
            onSelect={this.handleInputChange.bind(this)}
            options={{
              placeholder: 'Elija un Cantón...',
              noResultsText: 'Sin elementos'
            }}
          />
        </div>

        <div className='form-group'>
          <label>Distrito</label>
          <Select2
            name='district'
            data={districtsData}
            value={this.props.sender.district}
            className='form-control'
            onSelect={this.handleInputChange.bind(this)}
            options={{
              placeholder: 'Elija un Distrito...',
              noResultsText: 'Sin elementos'
            }}
          />
        </div>

        <div className='form-group'>
          <label>Barrio</label>
          <Select2
            name='town'
            data={townsData}
            value={this.props.sender.town}
            className='form-control'
            onSelect={this.handleInputChange.bind(this)}
            options={{
              placeholder: 'Elija un Barrio...',
              noResultsText: 'Sin elementos'
            }}
          />
        </div>

        <div className='form-group'>
          <label>Otras Señas</label>
          <input value={this.props.sender.other_address} name='other_address' onChange={this.handleInputChange.bind(this)} type='text'
            className='form-control' />
        </div>

      </div>

      <div className='col-xs-12 col-sm-4 fields-container buttons second'>

        <span>Crédito y Decuentos</span>
        <hr />

        <div className='form-group row input-block'>
          <div className='col-xs-6 first'>

            <label>Desc Máximo %</label>
            <input value={this.props.sender.max_discount} name='max_discount'
              onChange={this.handleInputChange.bind(this)}
              type='number'
              className='form-control' onFocus={this.fieldFocus.bind(this)} />

          </div>

          <div className='col-xs-6 second'>

            <label>Desc Predet %</label>
            <input value={this.props.sender.pred_discount} name='pred_discount'
              onChange={this.handleInputChange.bind(this)}
              type='number'
              className='form-control' onFocus={this.fieldFocus.bind(this)} />

          </div>
        </div>

        <div className='form-group'>
          <label>Desc Máx Línea %</label>
          <input value={this.props.sender.max_line_discount} name='max_line_discount'
            onChange={this.handleInputChange.bind(this)} type='number'
            className='form-control' onFocus={this.fieldFocus.bind(this)} />
        </div>

        <div className='form-group row input-block'>
          <div className='col-xs-6 first'>

            <label>Paga Impuestos</label>
            <input checked={this.props.sender.pays_taxes} name='pays_taxes' onChange={this.handleInputChange.bind(this)}
              type='checkbox' className='form-control' />

          </div>

          <div className='col-xs-6 second'>

            <label>Tiene Crédito</label>
            <input checked={this.props.sender.has_credit} name='has_credit' onChange={this.handleInputChange.bind(this)}
              type='checkbox' className='form-control' />

          </div>
        </div>

        <div className='form-group row input-block'>
          <div className='col-xs-6 first'>

            <label>Límite de crédito</label>
            <input value={this.props.sender.credit_limit} name='credit_limit' onChange={this.handleInputChange.bind(this)}
              type='number' className='form-control' onFocus={this.fieldFocus.bind(this)} />

          </div>

          <div className='col-xs-6 second'>

            <label>Días de crédito</label>
            <input value={this.props.sender.credit_days} name='credit_days' onChange={this.handleInputChange.bind(this)}
              type='number' className='form-control' onFocus={this.fieldFocus.bind(this)} />

          </div>
        </div>

        <div className='form-group'>
          <label>Observaciones</label>
          <input value={this.props.sender.observations} name='observations'
            onChange={this.handleInputChange.bind(this)} type='text'
            className='form-control' />
        </div>

      </div>

    </div>
  }
}

// EXPORT THE CLASS WITH ROUTER
export default withRouter(Form)
