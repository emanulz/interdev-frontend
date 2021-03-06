// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'

export function checkData(user, users, is_password_valid) {
  let Ok = true

  if (user.username == '') {
    alertify.alert('Error', 'El nombre de Usuario no puede estar vacío')
    return false
  }

  if(is_password_valid!=='OK'){
    alertify.alert('Error', `El password no cumple las reglas de seguridad: --> \n${is_password_valid}`)
    return false
  }

  // UNIQUE FIELDS
  users.forEach((userData) => {

    if (user.username == userData.username && userData.username != '') {
      if (user.id != userData.id) {
        alertify.alert('Error', `El usuario ${userData.username} - ${userData.first_name} ${userData.last_name}
                        ya posee el usuario ${userData.username}`)
        Ok = false
        return false
      }
    }
  })

  return Ok
}
