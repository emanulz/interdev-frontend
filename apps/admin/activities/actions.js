// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'

export function checkProjectData(activity, activities) {
  const Ok = true

  if (activity.name == '') {
    alertify.alert('Error', 'Debe especificar el nombre de la Actividad.')
    // alertify.notify('Debe especificar el código del Cliente', 'error', 5, function() { console.log('dismissed') })
    return false
  }

  if (activity.description == '') {
    alertify.alert('Error', 'Debe especificar la descripción de la Actividad.')
    return false
  }

  // UNIQUE FIELDS
  // activities.forEach((activityData) => {
  //   if (activity.identifier == activityData.identifier) {
  //     if (activity.id != activityData.id) {
  //       alertify.alert('Error', `La Familia ${activityData.name} ya posee el identificador ${activityData.identifier}`)
  //       Ok = false
  //       return false
  //     }
  //   }
  // })

  return Ok
}
