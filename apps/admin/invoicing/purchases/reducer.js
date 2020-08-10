const defaultPermissions = {
  add: 'unfetched',
  change: 'unfetched',
  list: 'unfetched',
  delete: 'unfetched'
}

const stateConst = {
  epurchases: [],
  loadedPurchase: {},
  purchaseToUpload: '',
  permissions: defaultPermissions,
  epurchaseType: 'PURCHASE',
  token: "",
  //extra states for multi upload
  multi_accept_files: '',
  accepted_queued_tasks: [],
  refetch_queued_tasks: false,
  mass_process_result: [],
  show_process_results: false,
  activities: [],
  target_activity: ''

}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    
    case 'MULTI_PURCHASES_PROCESS_COMPLETE':
    {
      return {
        ...state,
        mass_process_result: action.payload,
        show_process_results: true
      }
    }
    case 'TAX_PAYER_LOCAL_ACTIVITIES_FULFILLED':
    {
      // console.log("Activities received --> ", action.payload)
      const new_activities = [];
      for(let local of action.payload){
        for(let activity of local.activities){
          new_activities.push(
            {
              id: activity.activity.id,
              code: activity.activity.code,
              activity_name: activity.activity.activity_name
            }
          );
        }
      }

      return {
        ...state,
        activities: new_activities
      }
    }

    case 'TAX_PAYER_ACTIVITY_SELECTED':
    {

      return {
        ...state,
        target_activity: action.payload
      }
    }

    case 'UPLOAD_RESULTS_DISMISSED':
    {
      return {
        ...state,
        mass_process_result: [],
        show_process_results: false
      }
    }

    //multi accept cases
    case 'QUEUED_TASK_PROCESSED':
    {
      return {
        ...state,
        refetch_queued_tasks: true
      }
    }
    
    case 'RESET_REFETCH_QUEUED':
    {
      return {
        ...state,
        refetch_queued_tasks: false
      }
    }

    case 'PURCHASE_RECEPTION_TASKS_FULFILLED':
    {
      return {
        ...state,
        accepted_queued_tasks: action.payload,
      }
    }
    case 'SET_DOCUMENTS_SELECTED':
    {
      return {
        ...state,
        multi_accept_files: action.payload
      }
    }


    case 'SET_EPURCHASE_TOKEN':
    {
      return {
        ...state,
        token: action.payload
      }
    } 

    case 'SET_EPURCHASE_TYPE':
    {
      return {
        ...state,
        epurchaseType: action.payload
      }
    } // case

    case 'FETCH_USER_EPURCHASE_PERMISSIONS_FULLFILLED':
    {
      return {
        ...state,
        permissions: action.payload
      }
    } // case

    case 'FETCH_USER_EPURCHASE_PERMISSIONS_REJECTED':
    {
      return {
        ...state,
        permissions: defaultPermissions
      }
    } // case

    case 'FETCH_EPURCHASES_FULFILLED':
    {
      return {
        ...state,
        epurchases: action.payload
      }

    } // case

    case 'FETCH_EPURCHASES_REJECTED':
    {
      return {
        ...state,
        epurchases: []
      }
    } // case

    case 'SET_EPURCHASE':
    {
      return {
        ...state,
        loadedPurchase: action.payload
      }
    }

    case 'SET_EPURCHASE_FILE':
    {
      return {
        ...state,
        purchaseToUpload: action.payload
      }
    }

    case 'CLEAR_EPURCHASE':
    {
      return {
        ...state,
        purchases: [],
        loadedPurchase: {}
      }
    }

  } // switch

  return state // default return

} // reducer
