import React from 'react'

import CreateTransmutation from './create/create.jsx'

export default class Transmutation extends React.Component {



    render(){
        return <div className="transmutation-root">
            <h1>Tadah!</h1>
            <CreateTransmutation />
        </div>
    }
}