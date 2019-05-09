// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'
import axios from 'axios'

export function checkProjectData(project, projects) {
  const Ok = true

  if (project.name == '') {
    alertify.alert('Error', 'Debe especificar el nombre del proyecto.')
    // alertify.notify('Debe especificar el código del Cliente', 'error', 5, function() { console.log('dismissed') })
    return false
  }

  if (project.description == '') {
    alertify.alert('Error', 'Debe especificar la descripción del proyecto.')
    return false
  }

  if (project.client_id == '') {
    alertify.alert('Error', 'Debe especificar el cliente del proyecto.')
    return false
  }

  // UNIQUE FIELDS
  // projects.forEach((projectData) => {
  //   if (project.identifier == projectData.identifier) {
  //     if (project.id != projectData.id) {
  //       alertify.alert('Error', `La Familia ${projectData.name} ya posee el identificador ${projectData.identifier}`)
  //       Ok = false
  //       return false
  //     }
  //   }
  // })

  return Ok
}

export function clientSearchDoubleClick(item, dispatch) {
  axios.get(`/api/clients/${item}`).then(function(response) {
    const client = response.data
    // ON LOAD DISPATCH OR CLEAN THE CLIENT TO UPDATE
    try {
      if (client.client.code != '00') {
        dispatch({type: 'SET_PROJECT_CLIENT', payload: client.client})
        dispatch({type: 'clientSearch_TOGGLE_SEARCH_PANEL', payload: -1})
      } else {
        alertify.alert('ERROR', `No se puede utilizar el cliente general para crear un proyecto`)
      }
    } catch (err) {}
  }).catch(function(error) {
    alertify.alert('ERROR', `Error al obtener el valor del API, por favor intente de nuevo o comuníquese con el
    administrador del sistema con el siguiete error: ${error}`)
  })
}

export function activitySearchDoubleClick(item, dispatch, activities) {
  axios.get(`/api/activities/${item}`).then(function(response) {
    const activity = response.data
    // ON LOAD DISPATCH OR CLEAN THE CLIENT TO UPDATE
    try {
      dispatch({type: 'ADD_ACTIVITY_TO_PROJECT', payload: activity})
      dispatch({type: 'activitySearch_TOGGLE_SEARCH_PANEL', payload: -1})
    } catch (err) {}
  }).catch(function(error) {
    alertify.alert('ERROR', `Error al obtener el valor del API, por favor intente de nuevo o comuníquese con el
    administrador del sistema con el siguiete error: ${error}`)
  })
}
