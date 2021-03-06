/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import axios from 'axios'

@connect((store) => {
  return {}
})
export default class ClientUpdatePanel extends React.Component {

  componentDidMount() {
    const sectionName = this.props.sectionName
    const successDispatch = this.props.successDispatch
    const failDispatch = this.props.failDispatch

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    const _this = this
    // IF THE ITEM IS NOT ON LOCAL STORAGE UNDER NAME interdev_conf_$SECTION_NAME LOAD IT AND SAVE IT
    if (localStorage.getItem(`interdev_conf_${sectionName}`) === null) {
      axios.get(`/api/globalprefs/?limit=10000`).then(function(response) {
        // The property to modify in reducer
        const config = response.data.results
          ? response.data.results.filter(item => {
            return item.section == sectionName
          })
          : {}
        const data = {}
        config.forEach(item => {
          data[item.name] = item.value
        })
        console.log('DATAAAA', data)
        localStorage.setItem(`interdev_conf_${sectionName}`, JSON.stringify(data))
        if (sectionName == 'global_conf') {
          localStorage.setItem(`interdev_conf_settingsVersion`, data.settingsCurrentVersion)
        }
        _this.props.dispatch({type: successDispatch, payload: {data: data, section: sectionName}})
      }).catch(function(error) {
        localStorage.removeItem(`interdev_conf_${sectionName}`)
        _this.props.dispatch({type: failDispatch, payload: error})
        _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      })
    } else {
      if (sectionName == 'global_conf') {
        axios.get(`/api/administration/helpertasks/checkSettingsVersion/`).then(function(response) {
          const settingsVersion = response.data
          const storageSettingsVersion = localStorage.getItem(`interdev_conf_settingsVersion`)
          if (settingsVersion == storageSettingsVersion) {
            _this.props.dispatch({type: successDispatch, payload: {data: JSON.parse(localStorage.getItem(`interdev_conf_${sectionName}`)), section: sectionName}})
          } else {
            localStorage.clear()
            alert('Cache de la caja eliminado, se recargará la página')
            location.reload()
          }
        }).catch(function(error) {
          // localStorage.removeItem(`interdev_conf_${sectionName}`)
          _this.props.dispatch({type: failDispatch, payload: error})
          _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
        })
      } else {
        _this.props.dispatch({type: successDispatch, payload: {data: JSON.parse(localStorage.getItem(`interdev_conf_${sectionName}`)), section: sectionName}})
      }
    }

  }

  render() {

    return null

  }

}
