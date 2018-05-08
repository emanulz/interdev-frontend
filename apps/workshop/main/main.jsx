/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {BrowserRouter as Router} from 'react-router-dom'
import {fecthProfile} from './actions'

// COMPONENTS

import TopBar from '../../../general/layout/topBar/topBar.jsx'


export default class Main extends React.Component {

    // Main layout
    render(){
        const unlocked = <Router>
            <div>
                TALLER MAIN
            </div>
        </Router>
    }
}