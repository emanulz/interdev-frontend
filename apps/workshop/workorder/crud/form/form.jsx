import React from 'react'
import {connect} from 'react-redux'
import { setItem, getItemDispatch } from '../../../../../utils/api'
import Select2 from 'react-select2-wrapper'

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
        
        work_order: store.workorder.work_order
        
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

        
        var temp_name = target.name
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
                //deep clone current workorder
                const temp_failure = this.props.article_failures.find(item => {return item.id == target.value})['text']
                //const temp_failure = this.props.article_failures[target.value]['text']
                if(temp_failure ==="99-Otro"){//handle particular case where the failure is not listed
                    this.props.dispatch({type:'CHANGE_MALFUNCTION_INPUT', payload:'text'})
                    return

                }else{
                    var new_failures_list = this.props.work_order.malfunction_details
                    const exists = this.props.work_order.malfunction_details.find(item => item.value === temp_failure)
                    if(exists === undefined){ //only add if not in list
                        new_failures_list.push({'key':temp_failure.id,'value':temp_failure})
                    }            
                    work_order["malfunction_details"] = new_failures_list
                }
                break
            }
            case "remove_malfunction":
            {
                var new_failures_list = this.props.work_order.malfunction_details
                const target_index = this.props.work_order.malfunction_details.splice(value,1)
                work_order['malfunction_details'] = new_failures_list
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
            <li key={malfunction.key} className="workshop-list-observation-item">
            <span id={"observation_id-"+index} className="fa fa-minus-square" />{observation.value}
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
                    <label>Número de Garantía Black Decker</label>
                    <input name="article_warranty_bd" type="text" value={this.props.work_order.article_warranty_bd}
                        className="form-control" placeholder="Número de Garantía.." onChange={this.handleInputChange.bind(this)} />
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

        </div>
    }
}

//