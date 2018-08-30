import React from 'react'
import alertify from 'alertifyjs'
import {connect} from 'react-redux'
import {saveItem, postNoDispatch, postDispatch} from '../../../../../utils/api'
import {validateTaxPayerCreation} from '../../actions.js'

import { withRouter } from 'react-router-dom'


@connect(store=>{
    return {
        taxpayer: store.taxpayer.taxpayer_active,
        certificate_file: store.taxpayer.certificate_file,
        certificate_valid: store.taxpayer.certificate_valid,
    }
})
class CreateButtons extends React.Component {

    saveBtn(redirect){
        const is_valid = validateTaxPayerCreation(this.props.taxpayer)
        if(is_valid){
            //Build a promise to validate the certificate
            const formData = new FormData()
            formData.append('certificate', this.props.certificate_file)
            formData.append('secret', this.props.taxpayer.signing_secret)
            const kwargs = {
                url: '/api/taxpayercreate/test_certificate/',
                data: formData
            }
            postNoDispatch(kwargs).then(result=>{
                if(result =="VALID"){
                    this.props.dispatch({type:'FETCHING_STARTED'})
                    const formData = new FormData()
                    formData.append('oauth_id', this.props.taxpayer.oauth_id)
                    formData.append('oauth_password', this.props.taxpayer.oauth_password)
                    let kwargs = {
                        url: '/api/taxpayercreate/test_oauth/',
                        data: formData
                    }
                    postNoDispatch(kwargs).then(result=>{
                      if(result == "VALID"){
                        console.log("SECRET AND OAUTH VALID")
                        //create the taxpayer
                        try{
                            const tp = this.props.taxpayer
                            const data = {
                            oauth_id: tp.oauth_id,
                            oauth_password: tp.oauth_password,
                            secret: tp.signing_secret,
                            legal_name: tp.legal_name,
                            commercial_name: tp.commercial_name,
                            email: tp.email,
                            id_type: tp.id_type,
                            id_number: tp.id_number,
                            provincia: tp.provincia,
                            canton: tp.canton,
                            distrito: tp.distrito,
                            barrio: tp.barrio,
                            otras_senas: tp.otras_senas,
                            country_code: tp.country_code,
                            phone_number: tp.phone_number,
                            fax_number: tp.fax_number
                            }
    
                            const formData = new FormData()
                            formData.append('certificate', this.props.certificate_file)
                            formData.append('data', JSON.stringify(data))
                            kwargs = {
                                url: '/api/taxpayercreate/',
                                data: formData,
                                onSuccess: 'SET_TAXPAYER',
                                onError: 'TAX_PAYER_CREATION_ERR',
                            }
                            this.props.dispatch(postDispatch(kwargs))
                        }catch(err){
                            this.props.dispatch({type: 'FETCHING_DONE'})
                            console.log("Error creating user")
                            console.log(err)
                        }
                        
                      }else{
                        this.props.dispatch({type: 'FETCHING_DONE'})
                          alertify.alert("Error", "Los credenciales de OAUTH no son correctos.")
                      }
                    }).catch(err=>{
                        this.props.dispatch({type: 'FETCHING_DONE'})
                        alertify.alert("Error", 'Ocurrió un problema verificando los credenciales OAUTH')
                    })
                }else{
                    this.props.dispatch({type: 'FETCHING_DONE'})
                    alertify.alert("El pin no puede desbloquear la llave criptográfica.")
                }
            }).catch(err=>{
                this.props.dispatch({type: 'FETCHING_DONE'})
                alertify.alert("Error", "Ocurrio un problema verificando el pin del cerficado criptográfico.")
            })

        }
    }

    cancelBtn(event){
        console.log("Cancel button press")
    }

    render(){

        
        return <div className="buttons-row">
            <div className="buttons-row-button">
                <button onClick={this.saveBtn.bind(this, true)}
                    className='form-buttons-container-save form-control btn-success'>
                    Guardar
                </button>
            </div>
            <div className="buttons-row-button">
                <button onClick={this.cancelBtn.bind(this, true)}
                    className='form-buttons-container-save form-control btn-danger'>
                    Cancelar
                </button>
            </div>
        </div>
    }


}

export default withRouter(CreateButtons)