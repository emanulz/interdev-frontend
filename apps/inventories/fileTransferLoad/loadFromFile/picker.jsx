import React from 'react'
import {connect} from 'react-redux'

@connect(store=>{
    return {

    }
})
export default class Picker extends React.Component {


    componentWillMount(){

    }

    onFileChange(e){
        this.props.dispatch({type: 'FILE_SELECTED_PICKER', payload: e.target.files[0]})
    }

    render() {

        return <div className='picker'>

            <div className="picker-label">
                Seleccioné el archivo de transferencia
            </div>
            <div className="picker-input">
                <input type="file" name="file_picker" onChange={this.onFileChange.bind(this)} accept='text/xml'/>
            </div>    
            
        </div>
    }
}
