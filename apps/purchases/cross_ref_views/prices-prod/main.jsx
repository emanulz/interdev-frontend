import React from 'react'
import {connect} from 'react-redux'
import {Bar, Line} from 'react-chartjs-2'


@connect(store=>{
    return {

    }
})
export default class Prices_Prod extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            chartData: {
                labels: ['A', 'B', 'C'],
                datasets: [
                    {
                        label: 'Something',
                        data: [
                            45,87,35
                        ]
                    }
                ],
                bacgroundColor: 'green'
            }
        }
    }

    componentWillMount(){

    }

    render(){
        return <div>
            YAY, PRICES-PROD!!!
            <Bar
                data={this.state.chartData}
            />
        </div>
    }
}