import React from 'react'
import {connect} from 'react-redux'
import Select2 from 'react-select2-wrapper'
import {getCantonsSelect, getDistrictsSelect, getTownsSelect} from '../../actions.js'
import {postDispatch, getItemDispatch, saveItem} from '../../../../../utils/api.js'
import UpdateButtons from './updateButtons.jsx'
var util = require('util')

@connect(store=>{
    return {
        taxpayer: store.taxpayer.taxpayer_active,
        provinces: store.addresses.provinces,
        cantons: store.addresses.cantons,
        districts: store.addresses.districts,
        towns: store.addresses.towns,
        oauth_credentials_valid: store.taxpayer.oauth_credentials_valid,
        certificate_file: store.taxpayer.certificate_file,
        certificate_valid: store.taxpayer.certificate_valid,
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
        return <div className="container">
            <div className='admin-list-header'>
                <h1>ATENCION SI ESOS PARAMETROS SON MODIFICADOS EL SISTEMA DEJARÁ DE FUNCIONAR</h1>
            </div>
            <div className="taxpayer">
                <div className="taxpayer-right">
                <div className="taxpayer-left-header">
                    <h1>Credenciales Hacienda</h1>
                    <br/>
                    <div className="oauth-container">
                        <div className="oauth-container-field">
                            <label>Usuario OAUTH Hacienda</label>
                            <input value={this.props.taxpayer.oauth_id} onChange={this.handleInputChange.bind(this)} name='oauth_id' 
                            type='text' className='form-control' placeholder="Ingrese usuario OAUTH"/>
                        </div>

                        <div className="oauth-container-field">
                            <label>Contraseña OAUTH Hacienda</label>
                            <input value={this.props.taxpayer.oauth_password} onChange={this.handleInputChange.bind(this)} name='oauth_password' 
                            type='text' className='form-control' placeholder="Ingrese contraseña OAUTH"/>
                        </div>
                        <button onClick={this.validateOauthCredentials.bind(this)}>
                            Verificar Credenciales
                        </button>
                    </div>

                    <div className="certificate-container">
                        <h2>Certificado Criptográfico de Firma Digital</h2>
                        <div className="certificate-container-field">
                            <input type="file" name="certificate_file" onChange={this.onCertificateChange.bind(this)} 
                                accept="application/x-pkcs12" id="file_picker"/>
                        </div>
                        
                        <div className="certificate-container-field">
                            <input value={this.props.taxpayer.signing_secret} onChange={this.handleInputChange.bind(this)} name='signing_secret' 
                                type='text' className='form-control' placeholder="Ingrese el secreto del certificado" />
                        </div>
                        <button onClick={this.validateCertificateSecret.bind(this)}>
                            Verificar secreto
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <UpdateButtons/>
        </div>
    }

    validateCertificateSecret(e){
        console.log("Dispatch a request to validate the p12 certificate")
        const formData = new FormData()
        formData.append('certificate', this.props.certificate_file)
        formData.append('secret', this.props.taxpayer.signing_secret)
        //dispatch request kwargs
        const kwargs = {
            url: '/api/taxpayercreate/test_certificate/',
            data: formData,
            onSuccess: 'CERTIFICATE_VALIDATION_RESULT',
            onError: 'CERTIFICATE_VALIDATION_REJECT',
        }
        this.props.dispatch(postDispatch(kwargs))
    }

    validateOauthCredentials(e){
        //if the credentials are empty, return err
        const taxpayer = this.props.taxpayer
        let errors = []
        if(taxpayer.oauth_id == ''){
            errors.push('El usuario OAUTH no puede estar en blanco.')
        }
        if(taxpayer.oauth_password == ''){
            errors.push('La contraseña OAUTH no puede estar en blanco.')
        }
        if(errors.length>0){
            const message = errors.join(' ')
            alertify.alert('ERROR', message)  
            return
        }
        //dispatch a request to validate the tokens
        const formData = new FormData()
        formData.append('oauth_id', this.props.taxpayer.oauth_id)
        formData.append('oauth_password', this.props.taxpayer.oauth_password)
        const kwargs = {
            url: '/api/taxpayercreate/test_oauth/',
            data: formData,
            onSuccess: 'OAUTH_VALIDATION_RESULT',
            onError: 'OAUTH_VALIDATION_REJECT', 
        }
        this.props.dispatch(postDispatch(kwargs))
    }

    onCertificateChange(e) {
        //check at least that the file extension is p12
        const target_file = e.target.files[0]
        const extension = target_file.name.split('.')[1]
        if(extension !== "p12"){
            alertify.alert('ERROR', `La extensión de los archivos criptográficos de firma digital deben tener extensión .p12`)  
            let certificate_file = document.getElementById("file_picker")       
            certificate_file.value =''
            return
        }
        this.props.dispatch({type:'SET_CERTIFICATE_FILE', payload:e.target.files[0]})
    }
}


