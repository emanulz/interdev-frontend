import React from 'react'
import {connect} from 'react-redux'
import Select2 from 'react-select2-wrapper'
import { generalSave } from '../../../../../utils/api'

@connect((store) => {
    return {
        cabysSearchResults: store.productsAdmin.cabysSearchResults,
        showCabysSearchPanel: store.productsAdmin.showCabysSearchPanel
    }
})
export default class SearchCabysPanel extends React.Component {
    
    filterA = '';
    filterB = '';
    filterC = '';
    rate = -1;
    cabysResultLimit = 300;


    hidePanel(){
        this.props.dispatch({type: 'TOGGLE_CABYS_SEARCH_PANEL'})
    }


    handleInputChange(filter, event){
        if(filter==='a'){
            this.filterA = event.target.value;
        }else if(filter === 'b'){
            this.filterB = event.target.value;
        }else if(filter === 'c'){
            this.filterC = event.target.value;
        }
    }

    handleRateChange(event){
        this.rate = event.target.value;
    }
    
    onSearch(){
        console.log("Yay, search --> ", this.filterA, this.filterB, this.filterC, this.props.rate)

        let target_url = `/api/products/cabysGeneralSearch/?limit=${this.cabysResultLimit}`;
        if(this.filterA){
            target_url += `&keywordA=${this.filterA}`;
        }

        if(this.filterB){
            target_url += `&keywordB=${this.filterB}`;
        }

        if(this.filterC){
            target_url += `&keywordC=${this.filterC}`;
        }
        if(this.rate != -1){
            target_url += `&rate=${this.rate}`
        }
        console.log("Final URL --> ", target_url);

        const kwargs = {
            method: 'get',
            url: target_url,
            // sucessMessage: `Código verificado correctamente.`,
            errorMessage: `Hubo un error al buscar.`,
            successType: 'CABYS_SEARCH_RESULT',
            errorType: 'FETCHING_DONE'
      
          }
      
          this.props.dispatch(generalSave(kwargs))

    }

    onCatSelected(cat){

        const kwargs = {
          method: 'get',
          url: `/api/products/cabysValidate/?code=${cat.catCode}`,
          errorMessage: `Hubo un error al verificar el código.`,
          successType: 'CABYS_VERIFY_RESULT',
          errorType: 'FETCHING_DONE'
    
        }
        this.props.dispatch(generalSave(kwargs))
        this.hidePanel()
    }

    render() {

        let resultsTable = <div>SIN RESULTADOS</div>
        if(this.props.cabysSearchResults && this.props.cabysSearchResults.length > 0){

            const rows = this.props.cabysSearchResults.map(result => {
                return <tr>
                        <td class="data-element-a">
                            <button onClick={this.onCatSelected.bind(this, result)} class="btn btn-success">
                                Asignar
                            </button>
                        </td>
                        <td class="data-element-a">{result.catCode}</td>
                        <td class="data-element-b">{result.description}</td>
                        <td class="data-element-a">{result.taxRate}</td>
                        <td class="data-element-b">{result.categories[0].description}</td>
                        <td class="data-element-b">{result.categories[1].description}</td>
                        <td class="data-element-b">{result.categories[2].description}</td>
                        <td class="data-element-b">{result.categories[3].description}</td>
                        <td class="data-element-b">{result.categories[4].description}</td>
                        <td class="data-element-b">{result.categories[5].description}</td>
                        <td class="data-element-b">{result.categories[6].description}</td>
                        <td class="data-element-b">{result.categories[7].description}</td>
                </tr>
            })

            resultsTable = <div class="results-container">
                <table>
                    <tbody className="cabysTableBody">
                        <tr>
                            <th>Acción</th>
                            <th>Código</th>
                            <th>Descripción</th>
                            <th>Impuesto</th>
                            <th>Categoría 1</th>
                            <th>Categoría 2</th>
                            <th>Categoría 3</th>
                            <th>Categoría 4</th>
                            <th>Categoría 5</th>
                            <th>Categoría 6</th>
                            <th>Categoría 7</th>
                            <th>Categoría 8</th> 
                        </tr>
                        {rows}
                    </tbody>
                </table>
            </div>
        }
        

        let rates = [
            {
                text: 'IVA 13%',
                id: 13
            },
            {
                text: 'IVA 8%',
                id: 8
            },
            {
                text: 'IVA 4%',
                id: 4
            },
            {
                text: 'IVA 2%',
                id: 2
            },
            {
                text: 'IVA 1%',
                id: 1
            },
            {
                text: 'Exento 0%',
                id: 0
            }
        ]
        let cabys_panel_class = "cabys-panel"
        if(this.props.showCabysSearchPanel){
            cabys_panel_class += " is-visible"
        }
        return <div className={cabys_panel_class}>
                <div className="cabys-panel-main">
                    <div className='cabys-panel-header'>
                        Búsqueda Catálogo CABYS
                        <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
                    </div>
                    <div class="cabys-panel-container">
                        <h4 class="cabys-panel-container-title">Instrucciones</h4>
                        <div>Para buscar un producto es necesario indicar palabras claves que se encuentren en la descripción del código Cabys según Hacienda. Hay 3 espacios para palabras claves, se recomienda empezar con una palabra y posteriormente agregar otras para ir refinando la busqueda.
                            Existe además un filtro especial por monto de impuesto, se recomienda usarlo siempre si conoce la tarifa a la que esta sujeta su producto. Esto limitará mucho los posibles resultados. 
                        </div>

                        <hr/>

                        <h4 class="cabys-panel-container-title">Palabras Clave</h4>

                        <div class="cabys-panel-search-keys-container">
                            <div>
                                <label>Filtro 1</label>
                                <input value={this.props.filterA} name='filterA'
                                onChange={this.handleInputChange.bind(this, 'a')}
                                type='text' className='form-control' />
                            </div>

                            <div>
                                <label>Filtro 2</label>
                                <input value={this.props.filterB} name='filterB'
                                onChange={this.handleInputChange.bind(this, 'b')}
                                type='text' className='form-control' />
                            </div>

                            <div>
                                <label>Filtro 3</label>
                                <input value={this.props.filterC} name='filterC'
                                onChange={this.handleInputChange.bind(this, 'c')}
                                type='text' className='form-control' />
                            </div>

                            <div>
                                <label>Tarifa Impuesto</label>
                                <Select2
                                    name='taxRate'
                                    value={''}
                                    className='form-control'
                                    onSelect={this.handleRateChange.bind(this)}
                                    data={rates}
                                    options={{
                                        placeholder: 'Elija la tarifa...',
                                        noResultsText: 'Sin resultado'
                                    }}
                                    />
                            </div>

                            <div className="search-button-container">
                                <button onClick={this.onSearch.bind(this)}
                                className='form-buttons-container-cancel form-control btn-info'>Búscar</button>
                            </div>
                        </div>
                        <hr/>
                        {resultsTable}
                    </div>
                </div>


        </div>
    }
}