import React from 'react'
import {connect} from 'react-redux'
import Select2 from 'react-select2-wrapper'
import {getCantonsSelect, getDistrictsSelect, getTownsSelect} from '../../actions.js'

@connect(store=>{
    return {
        taxpayer: store.taxpayer.taxpayer_active,
        provinces: store.addresses.provinces,
        cantons: store.addresses.cantons,
        districts: store.addresses.districts,
        towns: store.addresses.towns,

    }
})
export default class Form extends React.Component {


    componentWillMount(){
        this.props.dispatch({type: 'CLEAR_TAXPAYER'})
        
        if(this.props.update){

            const lookUp = this.props.location.pathname.split('/').pop()
            const kwargs = {

            }

            this.props.dispatch({type: 'FETCHING_STARTED'})
        }


    }

    componentWillUpdate(nextProps){

        if(this.props.update){
            
            if(nextProps.taxpayer_active.id == '-1'){
                const lookUp = this.props.location.pathname.split('/').pop()
                const kwargs = {

                }
                this.props.dispatch({type:'FETCHING_STARTED'})
            }

        }
    }

    handleInputChange(event){
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
        const taxpayer = {
            ...this.props.taxpayer
        }

        taxpayer[name] =  value

        this.props.dispatch({type:'SET_TAXPAYER', payload: taxpayer})
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

    render(){

        const provinces = this.props.provinces
        const cantons = this.props.cantons
        const districts = this.props.districts
        const towns = this.props.towns
        // map the provinces and return items to render in Select2
        const provincesData = provinces.map(province => {
            return {text: `${province.code} - ${province.name}`, id: `${province.code}`}
        })

        const cantonData = getCantonsSelect(this.props.taxpayer.provincia, cantons)
        const districtsData = getDistrictsSelect(this.props.taxpayer.canton, this.props.taxpayer.provincia, districts)
        const townsData = getTownsSelect(this.props.taxpayer.distrito, this.props.taxpayer.canton,
            this.props.taxpayer.provincia, towns)
        return <div className="taxpayer">
            <div className="taxpayer-left">
                <div className="taxpayer-left-header">
                    <h1>Información General</h1>
                    <br/>
                </div>
                <div className="taxpayer-left-field">
                    <label>Nombre Legal</label>
                    <input value={this.props.taxpayer.legal_name} name='legal_name' onChange={this.handleInputChange.bind(this)}
                    type='text'
                    className='form-control' />
                </div>
                <div className="taxpayer-left-field">
                    <label>Nombre Comercial</label>
                    <input value={this.props.taxpayer.commercial_name} name='commercial_name' onChange={this.handleInputChange.bind(this)}
                    type='text'
                    className='form-control' />
                </div>
                <div className="taxpayer-left-field">
                    <label>Tipo de Identificación</label>
                    <select onChange={this.handleInputChange.bind(this)} className='form-control' name='id_type'
                        value={this.props.taxpayer.id_type} >
                        <option value='01'>Cédula Física</option>
                        <option value='02'>Cédula Jurídica</option>
                        <option value='03'>Pasaporte</option>
                    </select>
                </div>

                <div className="taxpayer-left-field">
                    <label>Identificación</label>
                    <input value={this.props.taxpayer.id_number} onChange={this.handleInputChange.bind(this)} name='id_num' type='text'
                    className='form-control' />
                </div>
            </div>
            <div className="taxpayer-middle">
                <div className="taxpayer-middle-header">
                    <h1>Contacto y Dirección</h1>
                    <br/>
                </div>
                <div className="taxpayer-middle-field">
                    <label>Teléfono</label>
                    <input value={this.props.taxpayer.phone_number} name='phone_number' onChange={this.handleInputChange.bind(this)}
                    type='text'
                    className='form-control' />
                </div>
                <div className="taxpayer-middle-field">
                    <label>Celular</label>
                    <input value={this.props.taxpayer.cellphone_number} name='cellphone_number'
                        onChange={this.handleInputChange.bind(this)}
                        type='text'
                        className='form-control' />
                </div>
                
                <div className="taxpayer-middle-field">
                    <label>Provincia</label>
                    <Select2
                        name='provincia'
                        data={provincesData}
                        value={this.props.taxpayer.provincia}
                        className='form-control'
                        onSelect={this.handleInputChange.bind(this)}
                        options={{
                        placeholder: 'Elija una Provincia...',
                        noResultsText: 'Sin elementos'
                        }}
                    />
                </div>

                <div className="taxpayer-middle-field">
                    <label>Cantón</label>
                    <Select2
                        name='canton'
                        data={cantonData}
                        value={this.props.taxpayer.canton}
                        className='form-control'
                        onSelect={this.handleInputChange.bind(this)}
                        options={{
                        placeholder: 'Elija un Cantón...',
                        noResultsText: 'Sin elementos'
                        }}
                    />
                </div>

                <div className="taxpayer-middle-field">
                
                    <label>Distrito</label>
                    <Select2
                        name='distrito'
                        data={districtsData}
                        value={this.props.taxpayer.distrito}
                        className='form-control'
                        onSelect={this.handleInputChange.bind(this)}
                        options={{
                        placeholder: 'Elija un Distrito...',
                        noResultsText: 'Sin elementos'
                        }}
                    />
                
                </div>

                <div className="taxpayer-middle-field">
                
                    <label>Barrio</label>
                    <Select2
                        name='barrio'
                        data={townsData}
                        value={this.props.taxpayer.barrio}
                        className='form-control'
                        onSelect={this.handleInputChange.bind(this)}
                        options={{
                        placeholder: 'Elija un Barrio...',
                        noResultsText: 'Sin elementos'
                        }}
                    />
                
                </div>

            </div>
            <div className="taxpayer-right">

            </div>
        </div>
    }
}
