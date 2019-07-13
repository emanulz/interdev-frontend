import alertify from 'alertifyjs'

const defaultPermissions = {
  add: 'unfetched',
  change: 'unfetched',
  list: 'unfetched',
  delete: 'unfetched'
}

const projectModel = {
  id: '0000000000',
  name: '',
  description: '',
  client: '',
  client_id: '',
  activities: [],
  is_active: true
}

const stateConst = {
  projects: [],
  projectActive: projectModel,
  projectActiveOld: projectModel,
  nextProject: 0,
  previousProject: 0,
  permissions: defaultPermissions,
  initialActivitiesFetched: false,
  initialProjectFetched: false,
  projectFetching: false
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'PROJECT_FETCHING':
    {
      return {
        ...state,
        projectFetching: true
      }
    } // case

    case 'FETCH_USER_PROJECT_PERMISSIONS_FULLFILLED':
    {
      return {
        ...state,
        permissions: action.payload
      }
    } // case

    case 'FETCH_USER_PROJECT_PERMISSIONS_REJECTED':
    {
      return {
        ...state,
        permissions: defaultPermissions
      }
    } // case

    case 'SET_NEXT_PREV_PROJECT':
    {
      return {
        ...state,
        nextProject: action.payload.next,
        previousProject: action.payload.previous
      }
    } // case

    case 'CLEAR_NEXT_PREV_PROJECT':
    {
      return {
        ...state,
        nextProject: 0,
        previousProject: 0
      }
    } // case

    case 'FETCH_PROJECTS_FULFILLED':
    {
      return {
        ...state,
        projects: action.payload
      }

    } // case

    case 'FETCH_PROJECTS_REJECTED':
    {
      return {
        ...state,
        projects: []
      }
    } // case

    case 'SET_PROJECT':
    {
      const project = action.payload
      try {
        project.client = JSON.parse(project.client)
      } catch (err) {
        console.log('PARSING ERROR', err)
      }
      try {
        project.activities = JSON.parse(project.activities)
      } catch (err) {
        project.activities = project.activities ? project.activities : []
      }
      return {
        ...state,
        projectActive: project,
        initialProjectFetched: true,
        projectFetching: false
      }
    }

    case 'SET_PROJECT_CLIENT':
    {
      const project = {...state.projectActive}
      project.client = action.payload
      project.client_id = action.payload.id
      return {
        ...state,
        projectActive: project
      }
    }

    case 'SET_PROJECT_ACTIVITIES':
    {
      const project = {...state.projectActive}
      project.activities = action.payload
      return {
        ...state,
        projectActive: project,
        initialActivitiesFetched: true
      }
    }

    case 'ADD_ACTIVITY_TO_PROJECT':
    {
      const project = {...state.projectActive}
      if (project.activities.filter(e => e.id == action.payload.id).length == 0) {
        project.activities.push(action.payload)
      } else {
        alertify.alert('ERROR', `La actividad seleccionada "${action.payload.id} - ${action.payload.name}" ya se encuentra en la lista de actividades del proyecto.`)
        return state
      }
      return {
        ...state,
        projectActive: project
      }
    }
    case 'REMOVE_ACTIVITY_FROM_PROJECT':
    {
      const project = {...state.projectActive}
      const newActivities = project.activities.filter(activity => {
        return activity.id != action.payload
      })
      project.activities = newActivities
      return {
        ...state,
        projectActive: project
      }
    }

    case 'SET_PROJECT_OLD':
    {
      return {
        ...state,
        projectActiveOld: action.payload
      }
    }

    case 'CLEAR_PROJECT':
    {
      return {
        ...state,
        projectActive: projectModel,
        projectActiveOld: projectModel,
        initialActivitiesFetched: false,
        initialProjectFetched: false,
        projectFetching: false
      }
    }

  } // switch

  return state // default return

} // reducer
