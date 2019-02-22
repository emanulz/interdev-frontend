import React from 'react'
import {connect} from 'react-redux'
import {Line, Bar, defaults} from 'react-chartjs-2'


@connect(store=>{
    return {
        price_chart_visible: store.cross_ref.cross_actions.price_chart_visible,
    }
})
export default class General_Chart extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            //set default colors for series
            seriesBackgroundColors: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            seriesBorderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ]
        }
        
    }

    customizeChartData(){
        if(this.props.chart_data.datasets === undefined){
            return
        }
        
        const new_data = JSON.parse(JSON.stringify(this.props.chart_data))

        const series_count = this.props.chart_data.datasets.length
        const backGroundColors = []
        const borderColors = []
        for(let i=0; i<series_count; i++){
            backGroundColors.push(this.state.seriesBackgroundColors[i])
            borderColors.push(this.state.seriesBorderColor[i])
            new_data.datasets[i].borderColor=this.state.seriesBorderColor[i]
            new_data.datasets[i].backgroundColor=this.state.seriesBackgroundColors[i]
            new_data.datasets[i].borderWidth = 2
        }
    
        return new_data
    }

    configureChartOptions(chart){
        
        //chart.options.title.display=true
        //chart.options.title.text="MAHALO"

        if(this.props.chart_data.datasets === undefined){
            return
        }

        const data = this.props.chart_data

        const options = {
            title: {
                display: true,
                text: this.props.options.title,
                fontSize: 16,
                fontStyle: 'bold',
            },
            scales: {
                yAxes:[{
                    scaleLabel: {
                        display: true,
                        labelString: this.props.options.yAxisLegend,
                        fontSize: 14,
                        fontStyle: 'bold'

                    }
                }],
                xAxes:[{
                    scaleLabel: {
                        display: true,
                        labelString: this.props.options.xAxisLegend,
                        fontSize: 14,
                        fontStyle: 'bold'

                    }
                }]
            }
        }
        return options
    }

    togglePriceChart(){
        this.props.dispatch({type:'TOGGLE_PRICE_CHART'})
    }

    render() {

        
        const chart_data = this.customizeChartData()
        const chart_options = this.configureChartOptions()

        const price_chart = <Bar data={chart_data} options={chart_options}/>
        this.configureChartOptions(price_chart)

        console.log("Modified data --> ", chart_data)
        const show_legend = this.props.price_chart_visible ? 'Ocultar gráfico Precios' : 'Mostrar gráfico Precios'
        return <div className="chart-root">
            <div className="chart-root-price-holder-toggle">
                <button onClick={this.togglePriceChart.bind(this)}
                className='form-control btn-primary'>
                    {show_legend}
                </button>
            </div>
            <div className="chart-root-price-holder">
                {price_chart}
            </div>
        </div>
    }

}