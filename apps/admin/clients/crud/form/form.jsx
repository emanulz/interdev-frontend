import React from 'react'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'
import { setItem } from '../../../../../utils/api'
import Select2 from 'react-select2-wrapper'

@connect((store) => {
  return {
    client: store.clients.clientActive,
    clients: store.clients.clients,
    provinces: store.addresses.provinces,
    cantons: store.addresses.cantons,
    districts: store.addresses.districts,
    clientCategories: store.clientCategories.clientCategories,
    towns: store.addresses.towns
  }
})

class Form extends React.Component {
  // REACT METHODS
  componentWillMount() {

    this.props.dispatch({type: 'CLEAR_CLIENT', payload: ''})
    this.props.dispatch({type: 'CLEAR_NEXT_PREV_CLIENT', payload: ''})

    if (this.props.update) {

      const lookUp = this.props.location.pathname.split('/').pop()

      const kwargs = {
        lookUpField: 'code',
        url: '/api/clients/',
        lookUpValue: lookUp,
        dispatchType: 'SET_CLIENT',
        dispatchType2: 'SET_CLIENT_OLD',
        dispatchErrorType: 'CLIENT_NOT_FOUND',
        lookUpName: 'código',
        modelName: 'Clientes',
        redirectUrl: '/admin/clients',
        history: this.props.history
      }
      this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      this.props.dispatch(setItem(kwargs))

    }
  }

  componentWillUpdate(nextProps) {

    if (this.props.update) {

      const lookUp = this.props.location.pathname.split('/').pop()

      if (nextProps.client.id == '0000000000') {

        const kwargs = {
          lookUpField: 'code',
          url: '/api/clients/',
          lookUpValue: lookUp,
          dispatchType: 'SET_CLIENT',
          dispatchType2: 'SET_CLIENT_OLD',
          dispatchErrorType: 'CLIENT_NOT_FOUND',
          lookUpName: 'código',
          modelName: 'Clientes',
          redirectUrl: '/admin/clients',
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

    this.props.dispatch({type: 'SET_CLIENT', payload: client})
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

  clearClientCategory() {
    const client = {
      ...this.props.client
    }

    client['category_id'] = ''

    this.props.dispatch({type: 'SET_CLIENT', payload: client})
  }

  render() {

    // ********************************************************************
    // SELECT2 DATA
    // ********************************************************************
    const provinces = this.props.provinces
    const cantons = this.props.cantons
    const districts = this.props.districts
    const towns = this.props.towns
    const clientCategories = this.props.clientCategories

    // map the provinces and return items to render in Select2
    const clientCategoriesData = clientCategories.map(clientCategory => {
      return {text: `${clientCategory.code} - ${clientCategory.name} (Descuentos: Max: ${clientCategory.max_discount}%, Pred: ${clientCategory.pred_discount}%)`, id: `${clientCategory.id}`}
    })

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

    const maxDiscountGroup = this.props.client.category_id
      ? ''
      : <div className='form-group'>
        <label>Desc Máximo %</label>
        <input value={this.props.client.max_discount} name='max_discount'
          onChange={this.handleInputChange.bind(this)}
          type='number'
          className='form-control' onFocus={this.fieldFocus.bind(this)} />
      </div>

    const predDiscountGroup = this.props.client.category_id
      ? ''
      : <div className='form-group'>
        <label>Desc Predet %</label>
        <input value={this.props.client.pred_discount} name='pred_discount'
          onChange={this.handleInputChange.bind(this)}
          type='number'
          className='form-control' onFocus={this.fieldFocus.bind(this)} />
      </div>

    const predPriceListGroup = this.props.client.category_id
      ? ''
      : <div className='form-group'>
        <label>Lista de Precios</label>
        <select onChange={this.handleInputChange.bind(this)} className='form-control' name='pred_price_list'
          value={this.props.client.pred_price_list} >
          <option value='1'>Precio 1</option>
          <option value='2'>Precio 2</option>
          <option value='3'>Precio 3</option>
        </select>
      </div>

    // ********************************************************************
    // RETURN BLOCK
    // ********************************************************************
    return <div className='col-xs-12 row form-container'>

      <div className='col-xs-12 col-sm-4 fields-container first'>

        <span>Datos generales</span>
        <hr />

        <div className='form-group'>
          <label>Código</label>
          <input value={this.props.client.code} name='code' onChange={this.handleInputChange.bind(this)} type='text'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Nombre</label>
          <input value={this.props.client.name} name='name' onChange={this.handleInputChange.bind(this)} type='text'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Apellidos</label>
          <input value={this.props.client.last_name} name='last_name' onChange={this.handleInputChange.bind(this)}
            type='text'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Tipo de Identificación</label>
          <select onChange={this.handleInputChange.bind(this)} className='form-control' name='id_type'
            value={this.props.client.id_type} >
            <option value='01'>CÉDULA FÍSICA</option>
            <option value='02'>CÉDULA JURÍDICA</option>
            <option value='03'>DIMEX</option>
            <option value='04'>NITE</option>
            <option value='EXT'>IDENTIFICACIÓN EXTRANJEROS</option>
          </select>
        </div>

        <div className='form-group'>
          <label>Identificación</label>
          <input value={this.props.client.id_num} onChange={this.handleInputChange.bind(this)} name='id_num' type='text'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Email</label>
          <input value={this.props.client.email} name='email' onChange={this.handleInputChange.bind(this)} type='email'
            className='form-control' />
        </div>

      </div>

      <div className='col-xs-12 col-sm-4 fields-container buttons second'>

        <span>Contacto y dirección</span>
        <hr />

        <div className='form-group row input-block'>
          <div className='col-xs-6 first'>

            <label>Teléfono</label>
            <input value={this.props.client.phone_number} name='phone_number' onChange={this.handleInputChange.bind(this)}
              type='text'
              className='form-control' />
          </div>

          <div className='col-xs-6 second'>
            <label>Celular</label>
            <input value={this.props.client.cellphone_number} name='cellphone_number'
              onChange={this.handleInputChange.bind(this)}
              type='text'
              className='form-control' />
          </div>
        </div>
        <div className='form-group'>
          <label>Provincia</label>
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
        </div>

        <div className='form-group'>
          <label>Cantón</label>
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
        </div>

        <div className='form-group'>
          <label>Distrito</label>
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
        </div>

        <div className='form-group'>
          <label>Barrio</label>
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
        </div>

        <div className='form-group'>
          <label>Otras Señas</label>
          <input value={this.props.client.other_address} name='other_address' onChange={this.handleInputChange.bind(this)} type='text'
            className='form-control' />
        </div>

      </div>

      <div className='col-xs-12 col-sm-4 fields-container buttons second'>

        <span>Crédito y Decuentos</span>
        <hr />

        <div className='form-group'>
          <label>Categoría</label>
          <Select2
            name='category_id'
            data={clientCategoriesData}
            value={this.props.client.category_id}
            className='form-control'
            onSelect={this.handleInputChange.bind(this)}
            onUnselect={this.clearClientCategory.bind(this)}
            options={{
              placeholder: 'Elija una Categoría...',
              noResultsText: 'Sin elementos',
              allowClear: true
            }}
          />
        </div>

        {maxDiscountGroup}

        {predDiscountGroup}

        {predPriceListGroup}

        <div className='form-group row input-block'>
          {/* <div className='col-xs-6 first'>

            <label>Paga Impuestos</label>
            <input checked={this.props.client.pays_taxes} name='pays_taxes' onChange={this.handleInputChange.bind(this)}
              type='checkbox' className='form-control' />

          </div> */}

          <div className='col-xs-6 first'>

            <label>Tiene Crédito</label>
            <input checked={this.props.client.has_credit} name='has_credit' onChange={this.handleInputChange.bind(this)}
              type='checkbox' className='form-control' />

          </div>
        </div>

        <div className='form-group row input-block'>
          <div className='col-xs-6 first'>

            <label>Límite de crédito</label>
            <input value={this.props.client.credit_limit} name='credit_limit' onChange={this.handleInputChange.bind(this)}
              type='number' className='form-control' onFocus={this.fieldFocus.bind(this)} />

          </div>

          <div className='col-xs-6 second'>

            <label>Días de crédito</label>
            <input value={this.props.client.credit_days} name='credit_days' onChange={this.handleInputChange.bind(this)}
              type='number' className='form-control' onFocus={this.fieldFocus.bind(this)} />

          </div>
        </div>

        <div className='form-group'>
          <label>Observaciones</label>
          <input value={this.props.client.observations} name='observations'
            onChange={this.handleInputChange.bind(this)} type='text'
            className='form-control' />
        </div>

      </div>

    </div>
  }
}

// EXPORT THE CLASS WITH ROUTER
export default withRouter(Form)
