/*
 * Module dependencies
 */
import React from 'react'

export default class Clock extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      time: new Date().toLocaleTimeString('es-CR'),
      date: new Date().toLocaleDateString('es-CR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    }
  }

  componentDidMount() {
    this.intervalID = setInterval(
      () => this.tick(),
      1000
    )
  }
  componentWillUnmount() {
    clearInterval(this.intervalID)
  }

  tick() {
    this.setState({
      time: new Date().toLocaleTimeString('es-CR'),
      date: new Date().toLocaleDateString('es-CR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    })
  }

  // Main Layout
  render() {

    return <div className='clock'>
      <div className='time'>
        {this.state.time}
      </div>
      <div className='date'>
        {this.state.date}
      </div>
    </div>
  }

}
