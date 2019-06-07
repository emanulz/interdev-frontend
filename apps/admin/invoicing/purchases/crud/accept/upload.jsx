import React from 'react'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'
import { uploadEPurchase } from '../../actions.js'
import { generalSave } from '../../../../../../utils/api.js'
 
const uuidv4 = require('uuid/v4')

@connect((store) => {
  return {
    purchaseToUpload: store.epurchases.purchaseToUpload,
    multi_accept_files: store.epurchases.multi_accept_files
  }
})

class Form extends React.Component {
  // REACT METHODS
  constructor(){
    super();
    this.race_token = uuidv4()
    
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

  fieldFocus(ev) {
    ev.target.select()
  }

  handleFileChange(e) {
    
    e.preventDefault()

    const reader = new FileReader()
    const file = e.target.files[0]

    reader.onloadend = () => {

      this.props.dispatch({type: 'SET_EPURCHASE_FILE', payload: file})
      this.props.dispatch({type: 'SET_EPURCHASE_TOKEN', payload: uuidv4()})

    }

    reader.readAsDataURL(file)
  }



  uploadFile() {
    const formData = new FormData()
    formData.append('file', this.props.purchaseToUpload)
    if(this.race_token === ""){
      this.race_token = uuidv4()
    }
    formData.append('token', this.race_token)
    
    const kwargs = {
      url: '/api/facturareception/processHaciendaXML/',
      item: formData,
      sucessMessage: 'Compra Cargada Correctamente.',
      errorMessage: 'Hubo un error al cargar la compra, intente de nuevo.'
    }
    this.props.dispatch({type: 'FETCHING_STARTED'})
    this.props.dispatch(uploadEPurchase(kwargs))
  }



  handleMultiFilesInput(e){
    console.log("handle multi files input change --> ")
    e.preventDefault()

    //dispatch several promises to read the files as needed and await them all
    //console.log(e.target.files)

    let read_promises = []
    for(let file of e.target.files){
      //this is crap, if the extension is tampered it will fool us, but will
      //do ok for normal usage, might write a validator later that check the alignment octetes
      //of the file to figure real format
      if(file.type === "text/xml"){ 
        if(file.size > 25000){
          console.log("File seems to large...skip, over 2.5 MB")
          continue
        }

        //create a promise for the file reading
        const promise = new Promise((resolve, reject) => {
          console.log("Creating promise")
          const tempReader = new FileReader()
          tempReader.onloadend = () => {
            console.log("File loaded, resolving promise --> ", file.name)
            resolve(file)
          }
          tempReader.readAsDataURL(file)
        })

        //stack the promise
        read_promises.push(promise)


      }else{
        console.log("Ignore file because of extension --> ", file.name)
      }

    }

    //wait for all promises to fulfill and dispatch an array of results to the reducer
    Promise.all(read_promises).then(results =>{
      console.log("All promises resolved --> ", results)
      this.props.dispatch({type: "SET_DOCUMENTS_SELECTED", payload: results})
    })

  }


  uploadMultipleFiles(){
    console.log("Handle multi file upload")
    const formData = new FormData()
    //append all files to the request
    let counter = 0
    for(let file of this.props.multi_accept_files){
      formData.append(
        `file_${counter}`,
        file
      )
      counter += 1
    }

    const kwargs = {
      url: '/api/facturareception/massProcessHaciendaXML/',
      method: 'post',
      data: formData,
      sucessMessage: 'Archivos pre procesados correctamente.',
      errorMessage: 'Hubo un error al procesar los archivos.',
      successType: 'MULTI_PURCHASES_PROCESS_COMPLETE',
      errorType: 'MULTI_PURCHASES_PROCESS_REJECTED',
    }

    this.props.dispatch({type: 'FETCHING_STARTED'})
    this.props.dispatch(generalSave(kwargs))
  }

  render() {

    return <div className='col-xs-12 row form-container'>

      <div className='col-xs-12 fields-container first'>

        <span>SELECCIONAR FACTURA ELECTRÓNICA</span>
        <hr />

        <div className='form-group'>
          <div className='form-group-content'>
            <label>CARGAR FACTURA !</label>
            <input name='code' handleMultiFilesInput={this.handleFileChange.bind(this)} type='file'
              className='form-control' accept='application/xml' />
            <button onClick={this.uploadMultipleFiles.bind(this)} className='btn btn-primary uploadButton'> Cargar </button>
          </div>
        </div>

      </div>


      <div className='col-xs-12 fields-container first'>

        <span>SELECCIONAR CARPETA CONTENEDORA DOCUMENTOS</span>
        <hr />
        <p>Explore y seleccione el folder que contiene todas los documentos electrónicos por aceptar. De la carpeta serán procesados
          Tiquetes Electrónicos, Facturas Electrónicas, Notas de Crédito, Notas de Débito, Respuestas de Hacienda. Otros archivos serán ignorados.</p>
        <div className='form-group'>
          <div className='form-group-content'>
            <label>CARGAR MULTIPLES DOCUMENTOS ELECTRÓNICOS</label>
            <input name='multi-file-input' onChange={this.handleMultiFilesInput.bind(this)} type='file'
              className='form-control' accept='file' webkitdirectory mozdirectory msdirectory odirectory directory multiple />
            <button onClick={this.uploadMultipleFiles.bind(this)} className='btn btn-primary uploadButton'> Procesar </button>
          </div>
        </div>

      </div>

    </div>
  }
}

// EXPORT THE CLASS WITH ROUTER
export default withRouter(Form)
