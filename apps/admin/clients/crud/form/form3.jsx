import React from 'react'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'
import {setItem} from '../../../../../utils/api'
import {saveClientLocal, updateClientLocal, deleteClientLocal} from '../../actions.js'
import Select2 from 'react-select2-wrapper'
import alertify from 'alertifyjs'

@connect((store) => {
  return {
    client: store.clientsAdmin.clientActive,
    clientLocal: store.clientsAdmin.clientLocalActive,
    provinces: store.addresses.provinces,
    cantons: store.addresses.cantons,
    districts: store.addresses.districts,
    towns: store.addresses.towns,
    is_adding_local: store.clientsAdmin.is_adding_local,
    is_updating_local: store.clientsAdmin.is_updating_local
  }
})

class Form3 extends React.Component {
  // REACT METHODS
  componentWillMount() {

    this.props.dispatch({type: 'CLEAR_CLIENT_LOCAL', payload: ''})

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

    const clientLocal = {
      ...this.props.clientLocal
    }

    clientLocal[name] = value

    this.props.dispatch({type: 'SET_CLIENT_LOCAL', payload: clientLocal})
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

  createNewLocal(ev) {
    const local = {
      id: '0000000000',
      province: this.props.client.province,
      canton: this.props.client.canton,
      district: this.props.client.district,
      town: this.props.client.town,
      other_address: this.props.client.other_address,
      phone_number: this.props.client.phone_number,
      cellphone_number: this.props.client.cellphone_number,
      email: this.props.client.email,
      commercial_name: ''
    }
    this.props.dispatch({type: 'SET_CLIENT_LOCAL', payload: local})
    this.props.dispatch({type: 'SET_CLIENT_LOCAL_ADDING', payload: local})
  }

  editLocal(id, ev) {
    const local = this.props.client.locals.find(local => {
      return local.id == id
    })
    if (local) {
      this.props.dispatch({type: 'SET_CLIENT_LOCAL', payload: local})
      this.props.dispatch({type: 'SET_CLIENT_LOCAL_UPDATING', payload: local})
    } else {
      alertify.alert('ERROR', 'No se encontró el local a editar.')
    }
  }

  createLocalBtn(ev) {
    const localObject = this.props.clientLocal
    localObject['client'] = this.props.client.id

    const kwargs = {
      url: '/api/clientlocal/',
      item: localObject,
      sucessMessage: 'Local creado Correctamente.',
      errorMessage: 'Hubo un error al crear el Local del Cliente, intente de nuevo.',
      dispatchType: 'CLEAR_CLIENT_LOCAL_ADDING_UPDATING'
    }
    const createPromise = new Promise((resolve, reject) => {
      this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      this.props.dispatch(saveClientLocal(kwargs, resolve, reject))
    })
    const _this = this

    createPromise.then(() => {
      const kwargs = {
        lookUpField: 'code',
        url: '/api/clients/',
        lookUpValue: _this.props.client.code,
        dispatchType: 'SET_CLIENT',
        dispatchType2: 'SET_CLIENT_OLD',
        dispatchErrorType: 'CLIENT_NOT_FOUND',
        lookUpName: 'código',
        modelName: 'Clientes',
        redirectUrl: '/admin/clients',
        history: _this.props.history
      }
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      _this.props.dispatch(setItem(kwargs))
    }).catch((err) => {
      console.log(err)
    })

  }

  updateLocalBtn(ev) {
    const localObject = this.props.clientLocal
    localObject['client'] = this.props.client.id

    const kwargs = {
      url: `/api/clientlocal/${localObject.id}/`,
      item: localObject,
      sucessMessage: 'Local Actualizado Correctamente.',
      errorMessage: 'Hubo un error al actualizar el Local del Cliente, intente de nuevo.',
      dispatchType: 'CLEAR_CLIENT_LOCAL_ADDING_UPDATING'
    }
    const updatePromise = new Promise((resolve, reject) => {
      this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      this.props.dispatch(updateClientLocal(kwargs, resolve, reject))
    })
    const _this = this

    updatePromise.then(() => {
      const kwargs = {
        lookUpField: 'code',
        url: '/api/clients/',
        lookUpValue: _this.props.client.code,
        dispatchType: 'SET_CLIENT',
        dispatchType2: 'SET_CLIENT_OLD',
        dispatchErrorType: 'CLIENT_NOT_FOUND',
        lookUpName: 'código',
        modelName: 'Clientes',
        redirectUrl: '/admin/clients',
        history: _this.props.history
      }
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      _this.props.dispatch(setItem(kwargs))
    }).catch((err) => {
      console.log(err)
    })

  }

  deleteLocalBtn(ev) {
    const localObject = this.props.clientLocal
    localObject['client'] = this.props.client.id

    const kwargs = {
      url: `/api/clientlocal/${localObject.id}/`,
      sucessMessage: 'Local Eliminado Correctamente.',
      errorMessage: 'Hubo un error al eliminar el Local del Cliente, intente de nuevo.',
      dispatchType: 'CLEAR_CLIENT_LOCAL_DELETING'
    }
    const updatePromise = new Promise((resolve, reject) => {
      this.props.dispatch({type: 'FETCHING_STARTED'})
      this.props.dispatch(deleteClientLocal(kwargs, resolve, reject))
    })
    const _this = this

    updatePromise.then(() => {
      const kwargs = {
        lookUpField: 'code',
        url: '/api/clients/',
        lookUpValue: _this.props.client.code,
        dispatchType: 'SET_CLIENT',
        dispatchType2: 'SET_CLIENT_OLD',
        dispatchErrorType: 'CLIENT_NOT_FOUND',
        lookUpName: 'código',
        modelName: 'Clientes',
        redirectUrl: '/admin/clients',
        history: _this.props.history
      }
      _this.props.dispatch({type: 'FETCHING_STARTED'})
      _this.props.dispatch(setItem(kwargs))
    }).catch((err) => {
      console.log(err)
    })

  }

  render() {

    // ********************************************************************
    // SELECT2 DATA
    // ********************************************************************
    const provinces = this.props.provinces
    const cantons = this.props.cantons
    const districts = this.props.districts
    const towns = this.props.towns

    const disabled = !this.props.is_adding_local && !this.props.is_updating_local
    const itemText = this.props.is_adding_local ? 'Nuevo Local' : this.props.is_updating_local ? 'Editar Local' : '-'
    const saveButton = this.props.is_adding_local
      ? <button onClick={this.createLocalBtn.bind(this)} className='btn btn-primary save-local-btn'>
        <span className='fa fa-save' />
        Crear
      </button>
      : this.props.is_updating_local
        ? <button onClick={this.updateLocalBtn.bind(this)} className='btn btn-success save-local-btn'>
          <span className='fa fa-save' />
          Guardar
        </button>
        : ''

    const deleteButton = this.props.is_updating_local
        ? <button onClick={this.deleteLocalBtn.bind(this)} className='btn btn-danger save-local-btn'>
          <span className='fa fa-times' />
          Borrar
        </button>
        : ''
    // map the provinces and return items to render in Select2
    const provincesData = provinces.map(province => {
      return {text: `${province.code} - ${province.name}`, id: `${province.code}`}
    })

    // Filter the cantons data Based on the province selection stored in client active item
    const filteredCantons = cantons.filter(el => {
      return el.province_code == this.props.clientLocal.province
    })

    // map the filtered cantons and return items to render in Select2
    const cantonsData = filteredCantons.map(canton => {
      return {text: `${canton.code} - ${canton.name}`, id: canton.code}
    })

    // Filter the districts data Based on the province and canton selection stored in client active item
    const filteredDistricts = districts.filter(el => {
      return el.province_code == this.props.clientLocal.province && el.canton_code == this.props.clientLocal.canton
    })

    // map the filtered districts and return items to render in Select2
    const districtsData = filteredDistricts.map(district => {
      return {text: `${district.code} - ${district.name}`, id: district.code}
    })

    // Filter the towns data Based on the province and canton selection stored in client active item
    const filteredTowns = towns.filter(el => {
      return el.province_code == this.props.clientLocal.province && el.canton_code == this.props.clientLocal.canton && el.district_code == this.props.clientLocal.district
    })

    // map the filtered towns and return items to render in Select2
    const townsData = filteredTowns.map(town => {
      return {text: `${town.code} - ${town.name}`, id: town.code}
    })

    const locals = this.props.client.locals.map(local => {
      return <div key={local.id} onClick={this.editLocal.bind(this, local.id)} className='client-local-element' id={local.id} >
        {local.commercial_name ? local.commercial_name : 'SIN NOMBRE COMERCIAL'}
      </div>
    })

    locals.push(<div key='000000000' onClick={this.createNewLocal.bind(this)} id='000000000' className='client-local-element add-item'>
      <span className='fa fa-plus' />
      Agregar...
    </div>)

    // ********************************************************************
    // RETURN BLOCK
    // ********************************************************************
    return <div className='col-xs-12 row form-container'>
      <div className='col-xs-12 col-sm-6 fields-container first'>
        <span>Locales del Cliente</span>
        <hr />
        {locals}
      </div>
      <div className='col-xs-12 col-sm-6 fields-container second'>

        <span>{itemText}</span>
        <hr />

        <div className='form-group'>
          <label>Nombre Comercial</label>
          <input disabled={disabled} value={this.props.clientLocal.commercial_name} name='commercial_name' onChange={this.handleInputChange.bind(this)} type='text'
            className='form-control' />
        </div>

        <div className='form-group'>
          <label>Email</label>
          <input disabled={disabled} value={this.props.clientLocal.email} name='email' onChange={this.handleInputChange.bind(this)} type='email'
            className='form-control' />
        </div>

        <div className='form-group row input-block'>
          <div className='col-xs-6 first'>

            <label>Teléfono</label>
            <input disabled={disabled} value={this.props.clientLocal.phone_number} name='phone_number' onChange={this.handleInputChange.bind(this)}
              type='text'
              className='form-control' />
          </div>

          <div className='col-xs-6 second'>
            <label>Celular</label>
            <input disabled={disabled} value={this.props.clientLocal.cellphone_number} name='cellphone_number'
              onChange={this.handleInputChange.bind(this)}
              type='text'
              className='form-control' />
          </div>
        </div>
        <div className='form-group row input-block'>
          <div className='col-xs-6 first'>
            <label>Provincia</label>
            <Select2
              disabled={disabled}
              name='province'
              data={provincesData}
              value={this.props.clientLocal.province}
              className='form-control'
              onSelect={this.handleInputChange.bind(this)}
              options={{
                placeholder: 'Elija una Provincia...',
                noResultsText: 'Sin elementos'
              }}
            />
          </div>
          <div className='col-xs-6 second'>
            <label>Cantón</label>
            <Select2
              disabled={disabled}
              name='canton'
              data={cantonsData}
              value={this.props.clientLocal.canton}
              className='form-control'
              onSelect={this.handleInputChange.bind(this)}
              options={{
                placeholder: 'Elija un Cantón...',
                noResultsText: 'Sin elementos'
              }}
            />
          </div>
        </div>
        <div className='form-group row input-block'>
          <div className='col-xs-6 first'>
            <label>Distrito</label>
            <Select2
              disabled={disabled}
              name='district'
              data={districtsData}
              value={this.props.clientLocal.district}
              className='form-control'
              onSelect={this.handleInputChange.bind(this)}
              options={{
                placeholder: 'Elija un Distrito...',
                noResultsText: 'Sin elementos'
              }}
            />
          </div>

          <div className='col-xs-6 second'>
            <label>Barrio</label>
            <Select2
              disabled={disabled}
              name='town'
              data={townsData}
              value={this.props.clientLocal.town}
              className='form-control'
              onSelect={this.handleInputChange.bind(this)}
              options={{
                placeholder: 'Elija un Barrio...',
                noResultsText: 'Sin elementos'
              }}
            />
          </div>
        </div>
        <div className='form-group'>
          <label>Otras Señas</label>
          <input disabled={disabled} value={this.props.clientLocal.other_address} name='other_address' onChange={this.handleInputChange.bind(this)} type='text'
            className='form-control' />
        </div>

        <div className='form-group row input-block'>
          <div className='col-xs-6 first'>
            {deleteButton}
          </div>

          <div className='col-xs-6 second'>
            {saveButton}
          </div>
          
        </div>
      </div>

    </div>
  }
}

// EXPORT THE CLASS WITH ROUTER
export default withRouter(Form3)
