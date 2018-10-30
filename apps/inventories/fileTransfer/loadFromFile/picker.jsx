import React from 'react'
import {connect} from 'react-redux'


export default class Picker extends React.Component {


    componentWillMount(){

    }

    onFileChange(e){
        console.log("Archivo seleccionado --> ", e)
        //this.props.dispatch({type: 'FILE_SELECTED', payload: e.target.files[0]})
        //this.props.dispatch({type:'SET_IMAGE_FILE', payload:e.target.files[0]})
    }

    render() {

        return <div className='inv-importer'>

            <div className="inv-importer-header">
            
                <div>Seleccioné el archivo de transferencia</div>
                <div className="inv-importer-picker">
                    <input type="file" name="file_picker" onChange={this.onFileChange.bind(this)} accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'/>
                </div>    
            
            </div>

        </div>
    }
}
