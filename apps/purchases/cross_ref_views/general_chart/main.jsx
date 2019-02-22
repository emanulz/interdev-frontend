import React from 'react'
import {connect} from 'react-redux'
import {Line, Bar, defaults} from 'react-chartjs-2'

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

    setColors(){
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

    render() {

        const chart_data = this.setColors()

        console.log("Modified data --> ", chart_data)

        return <div className="chart-root">
            <div>Place knobs here!!</div>
            <div>
                <Line data={chart_data}/>
                
            </div>
        </div>
    }

}