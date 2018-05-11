import React from 'react'
import {connect} from 'react-redux'
import { setItem, getItemDispatch } from '../../../../../utils/api'
import Select2 from 'react-select2-wrapper'
import Client from '../../../general/clients/clients.jsx'

@connect((store)=>{
    return {
        article_types: store.workorder.article_types,
        article_brands: store.workorder.article_brands,
        article_colors: store.workorder.article_colors,
        article_failures: store.workorder.article_failures,
        article_custom_failure : store.workorder.article_custom_failure,
        failure_input_dropdown: store.workorder.failure_input_dropdown,

        article_observations: store.workorder.article_observations,
        article_custom_observation: store.workorder.custom_observation,
        observation_input_dropdown: store.workorder.observation_input_dropdown,
        
        work_order: store.workorder.work_order,

        cash_advance : store.workorder.cash_advance
        
    }
})

export default class Form extends React.Component {

    //REACT METHODS
    componentWillMount(){

    }

    componentWillUpdate(nextProps){

    }

    handleInputChange(event){
        const target = event.target
        console.log(event.target.attributes)
        let value

        let temp_name = target.name

        switch (target.type) {
            case 'checkbox':
                value = target.checked
                break
        
            case 'number':
                value = parseFloat(target.value)
                    ? parseFloat(target.value)
                    : 0
                break
            default:
                //check if the particular event comes from a element with id matching a failure item
                var node_id = event.target.attributes['id']
                if(node_id != undefined){
                    const parts = node_id.value.split('-')
                    if(parts[0]==="failure_id"){
                        temp_name = "remove_malfunction"
                        value = parseInt(parts[1])
                    }else if(parts[0]==="observation_id"){
                        temp_name ="remove_observation"
                        value = parseInt(parts[1])
                    }
                }else{
                    value = target.value
                }
                
        }

        const name = temp_name
        
        const work_order = {
            ...this.props.work_order
        }

        switch(name){
            case "failures_list":
            {
                const temp_failure = this.props.article_failures.find(item => {return item.id == target.value})['text']
                if(temp_failure ==="99-Otro"){//handle particular case where the failure is not listed
                    this.props.dispatch({type:'CHANGE_MALFUNCTION_INPUT', payload:'text'})
                    return
                }else{
                    let new_failures_list = this.props.work_order.malfunction_details
                    const exists = this.props.work_order.malfunction_details.find(item => item.value === temp_failure)
                    if(exists === undefined){ //only add if not in list
                        new_failures_list.push({'key':temp_failure.id,'value':temp_failure})
                    }            
                    work_order["malfunction_details"] = new_failures_list
                }
                break
            }
            case "observations_list":
            {
                
                const temp_observation = this.props.article_observations.find(item=>{return item.id == target.value})['text']
                if(temp_observation ==="99-Otra"){
                    this.props.dispatch({type:'CHANGE_OBSERVATION_INPUT', payload:'text'})
                    return
                }else{
                    let new_observations_list = this.props.work_order.observations_list
                    let exists = this.props.work_order.observations_list.find(item => item.value === temp_observation)
                    if(exists === undefined){
                        new_observations_list.push({'key':temp_observation.id, 'value':temp_observation})
                    }
                    work_order['observations_list'] = new_observations_list
                }
                break
            }
            case "remove_observation":
            {
                let new_observations_list = this.props.work_order.observations_list
                const target_index = this.props.work_order.observations_list.splice(value, 1)
                work_order['observations_list'] = new_observations_list
                break
            }
            case "remove_malfunction":
            {
                let new_failures_list = this.props.work_order.malfunction_details
                const target_index = this.props.work_order.malfunction_details.splice(value,1)
                work_order['malfunction_details'] = new_failures_list
                break
            }
            case "custom_observation_input":
            {
                if(event.type ==='blur' && value.length>3){
                    let new_list =  this.props.work_order.observations_list
                    const exists = this.props.work_order.observations_list.find(item => item.value === value)
                    if(exists === undefined){ //only add if not in list
                        new_list.push({'key':new_list.length+1,'value':value})
                    }            
                    work_order["observations_list"] = new_list
                    this.props.dispatch({type:'UPDATE_CUSTOM_OBSERVATION_INPUT', payload:''})
                    this.props.dispatch({type:'CHANGE_OBSERVATION_INPUT', payload:''})
                }else{
                    this.props.dispatch({type:'UPDATE_CUSTOM_OBSERVATION_INPUT', payload:value})
                }
                break                
            }
            case "custom_malfunction_input":
            {
                if(event.type ==='blur' && value.length>3){
                    var new_failures_list =  this.props.work_order.malfunction_details
                    const exists = this.props.work_order.malfunction_details.find(item => item.value === value)
                    if(exists === undefined){ //only add if not in list
                        new_failures_list.push({'key':new_failures_list.length+1,'value':value})
                    }            
                    work_order["malfunction_details"] = new_failures_list
                    this.props.dispatch({type:'UPDATE_CUSTOM_MALFUNCTION_INPUT', payload:''})
                    this.props.dispatch({type:'CHANGE_MALFUNCTION_INPUT', payload:''})
                }else{
                    this.props.dispatch({type:'UPDATE_CUSTOM_MALFUNCTION_INPUT', payload:value})
                }

                break
            }

            default:
            {
            //change what was modified
            work_order[name] = value
            }
        }
        this.props.dispatch({type: 'SET_WORK_ORDER', payload: work_order})

    }

    render(){

        const failures_list = this.props.work_order.malfunction_details.map((malfunction, index)=>
            <li key={malfunction.key} className="workshop-list-damages-item" >
            <span id ={"failure_id-"+index} className="fa fa-minus-square" 
            onClick={this.handleInputChange.bind(this)}/> {malfunction.value}
            </li>
        )
        let failure_input_object=''
        if(this.props.failure_input_dropdown==true){
            failure_input_object = <Select2
            name='failures_list'
            className='form-control'
            onSelect={this.handleInputChange.bind(this)}
            data={this.props.article_failures}
            options={{
                placeholder: 'Elija fallas de la lista..',
                noResultsText: 'Sin elementos'
            }}
            />
        }else{
            failure_input_object = <div className="col-xs-6 second">
            <input type="text" value={this.props.article_custom_failure} 
                name="custom_malfunction_input" 
                onBlur={this.handleInputChange.bind(this)} 
                onChange={this.handleInputChange.bind(this)}
                className='form-control' placeholder="Falla.."/>
            </div>
        }
        //build a list with the observations about the object state
        const observations_list = this.props.work_order.observations_list.map((observation, index)=>
            <li key={observation.key} className="workshop-list-observation-item">
            <span id={"observation_id-"+index} className="fa fa-minus-square" 
            onClick={this.handleInputChange.bind(this)}/> {observation.value}
            </li>
        )

        let observations_input_object = ''
        if(this.props.observation_input_dropdown==true){
            observations_input_object = <Select2
            name='observations_list'
            className='form-control'
            onSelect={this.handleInputChange.bind(this)}
            data={this.props.article_observations}
            options={{
                placeholder: 'Elija un observación de la lista..',
                noResultsText: 'Sin elementos'
            }}
            />           
        }else{
            observations_input_object = <div className="col-xs-6 second">
            <input type="text" value={this.props.article_custom_observation} 
                name="custom_observation_input" 
                onBlur={this.handleInputChange.bind(this)} 
                onChange={this.handleInputChange.bind(this)}
                className='form-control' placeholder="Observación.."/>
            </div>           
        }

        return <div className='col-xs-12 row form-container workshop-form'>

            <div className='col-xs-12 col-sm-6 fields-container first'>

                <span>Detalles del Artículo</span>
                <hr/>

                <div className="row first">
                    <div className="col-xs-6 first">
                        <label>Tipo electrodoméstico</label>
                        <Select2
                            name='article_type'
                            value={this.props.work_order.article_type}
                            onSelect={this.handleInputChange.bind(this)}
                            options={{
                                placeholder: 'Elija el tipo de artículo...',
                                noResultsText: 'Sin elementos'
                            }}
                            data={this.props.article_types}
                        />
                    </div>

                <div className="col-xs-6 second">
                        <label> Marca</label>
                        <Select2
                        name='article_brand'
                        value={this.props.work_order.article_brand}
                        onSelect={this.handleInputChange.bind(this)}
                        options={{
                            placeholder: 'Elija la marca del artículo...',
                            noResultsText: 'Sin elementos'
                        }}
                        data={this.props.article_brands}
                    />
                </div>
            </div>

            <div className="row second">
                <div className="col-xs-6 first">
                        <label>Color</label>
                        <Select2
                        name='article_color'
                        value={this.props.work_order.article_color}
                        onSelect={this.handleInputChange.bind(this)}
                        options={{
                            placeholder: 'Elija el color del artículo...',
                            noResultsText: 'Sin elementos'
                        }}
                        data={this.props.article_colors}
                    />
                </div>

                <div className="col-xs-6 second">
                        <label>Modelo</label>
                        <input type="text" value={this.props.work_order.article_model} 
                            name="article_model" onChange={this.handleInputChange.bind(this)} 
                            className='form-control' placeholder="Modelo.."/>
                </div>
            </div>

            <div className="row third">
                <div className="col-xs-6 first">
                    <label>Número de Serie</label>
                    <input name="article_serial" type="text" value={this.props.work_order.article_serial}
                        className="form-control" placeholder="Número de Serie.." onChange={this.handleInputChange.bind(this)}/>
                </div>

                <div className="col-xs-6 first">
                    <label>Es garantía?</label>
                    <input checked={this.props.work_order.is_warranty} name='is_warranty'
                        onChange={this.handleInputChange.bind(this)}
                        type='checkbox' className='form-control' />
                </div>
            </div>

            <span>Daños Reportados</span>
            <hr/>

            <div className="row fourth">
                <div className="col-xs-6 first">
                    <label>Daños</label>
                    <ul className="list-group workshop-list-damages">
                        {failures_list}
                    </ul>
                </div>
                
                <div className="col-xs-6 second">
                <label>Lista de fallas</label>
                
                {failure_input_object}
                        
                </div>
            </div>
            
            <span>Observaciones Artículo</span>
            <hr/>

            <div className="row fifth">
                <div className="col-xs-6 first">
                    <label>Observaciones</label>
                    <ul className="list-group workshop-list-observations">
                    {observations_list}
                    </ul>
                </div>
                <div className="col-xs-6 second">
                    <label>Seleccionar observación</label>
                    {observations_input_object}
                </div>
            </div>

            </div>

            <div className='col-xs-12 col-sm-6 fields-container second'>

                <span>Cliente y Garantía</span>
                <hr/>
                <div className="row first">
                    <div className="col-xs-6 first">
                        <Client/>
                    </div>
                    <div className="col-xs-6 second">
                        {this.buildWarrantyElement()}
                    </div>
                </div>



            </div>

        </div>
    }

    buildWarrantyElement(){
        let  content=''
        if(this.props.work_order.is_warranty){
            let repaired_by_element = <div>
                <label>Fecha de Entrega Estimada</label>
                <input name="warranty_repaired_by" type='date'
                value={this.props.work_order.warranty_repaired_by}
                className="form-control" placeholder="Fecha Entrega estimada.."
                onChange={this.handleInputChange.bind(this)} />
            </div>

            let bd_warranty_body = ''
            if(this.props.work_order.warranty_number_bd !== ''){
                    bd_warranty_body= <div>
                    <label>Nombre vendedor</label>
                    <input name="warranty_supplier_name" type='text'
                    value={this.props.work_order.warranty_supplier_name}
                    className="form-control" placeholder="Vendedor Producto"
                    onChange={this.handleInputChange.bind(this)}/>

                    <label>Fecha Factura</label>
                    <input value={this.props.work_order.warranty_invoice_date}
                        name='warranty_invoice_date' 
                        onChange={this.handleInputChange.bind(this)} 
                        type='date' className='form-control'/>

                    <label>Número de Factura</label>
                    <input name="warranty_invoice_number" type='text'
                    value={this.props.work_order.warranty_invoice_number}
                    className="form-control" placeholder="Número factura.."
                    onChange={this.handleInputChange.bind(this)}/>

                    {repaired_by_element}

                </div>
            }else{ //internal warranty form
                bd_warranty_body = <div>
                    <label>Adelanto</label>
                    <input name="cash_advance" type='text'
                    value={this.props.cash_advance} className="form-control"
                    placeholder="Ingrese monto adelanto.." 
                    onChange={this.handleInputChange.bind(this)} />
                    {repaired_by_element}
                </div>
                
            }
            content = <div className="warranty">
                    <h2>Garantía</h2>
                    <label>Número de Garantía Black Decker</label>
                    <input name="warranty_number_bd" type="text" 
                        value={this.props.work_order.warranty_number_bd}
                        className="form-control" placeholder="Número de Garantía.." 
                        onChange={this.handleInputChange.bind(this)} /> 
                    {bd_warranty_body}               
            </div>
        }
        return content

    }

    warrantyKeyPress(e){
        if(e.key == 'Enter'){
            //check content of warranty box
            const warranty_number = e.target.value
            if(warranty_number !== ''){

            }
        }
    }
}



