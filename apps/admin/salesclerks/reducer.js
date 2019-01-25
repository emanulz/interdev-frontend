const defaultPermissions = {
    add: 'unfetched',
    change: 'unfetched',
    list: 'unfetched',
    delete: 'unfetched'
  }
  
  const stateConst = {
    stats_data: null,
    start_date: "",
    end_date: "",
  }
  
  export default function reducer(state = stateConst, action) {
  
    switch (action.type) {
      
      case 'FETCH_GENERAL_DATA_FULFILLED':
      {
        return {
          ...state,
          employees_data: action.payload
        }
      }

      case 'JUMP_TO_NEXT_MONTH_MONTH':
      {
        //jump through full months backwards or forwards, the current
        //month used as reference is based on the month of the current
        //end date

        const current_end_month = parseInt(state.end_date.split("-")[1])-1
        console.log("Current month of reference --> ", current_end_month)

        console.log("Payload direction --> ", action.payload)
        const month_delta = action.payload>0?1:-1

        const new_start = new Date()
        new_start.setMonth(current_end_month + month_delta)
        new_start.setDate(1)

        const new_end = new Date()
        new_end.setDate(1)
        new_end.setMonth(current_end_month+month_delta) //adjust the month for going back or forth
        //move it one month ahead, set it to the first day and then substract one day
        //to land on the last day of the previous month
        new_end.setMonth(new_end.getMonth()+1)
        new_end.setDate(1)
        new_end.setDate(new_end.getDate()-1)
        
        const new_end_str = `${new_end.getDate()}-${new_end.getMonth()+1}-${new_end.getFullYear()}`
        const new_start_str = `${new_start.getDate()}-${new_start.getMonth()+1}-${new_start.getFullYear()}`

        return {
          ...state,
          start_date: new_start_str,
          end_date: new_end_str
        }

      }

      case 'SET_TO_LAST_X_DAYS':
      {
        
        let today = new Date()
        if(state.end_date!==''){
          const active_day = state.end_date.split("-")
          today = new Date(
            parseInt(active_day[2]), //year
            parseInt(active_day[1])-1, //month
            parseInt(active_day[0]) //day
          )

        }
        
        const lapse = action.payload <=31?action.payload:31
        //go back one day
        today.setDate(today.getDate()-lapse)
        const day = today.getDate()
        const month = today.getMonth()+1//fucking js and zero based months..
        const year = today.getFullYear()
        const full_date = `${day}-${month}-${year}`

        return {
          ...state,
          start_date: full_date
        }
      }

      case 'SET_DATE_AS_TODAY':
      {

        const today = new Date()
        const day = today.getDate()
        const month = today.getMonth()+1//fucking js and zero based months..
        const year = today.getFullYear()
        const full_date = `${day}-${month}-${year}`
        return {
          ...state,
          start_date: full_date,
          end_date: full_date
        }
      }

      case 'SET_DATE_AS_YESTERDAY':
      {
        let today = new Date()
        if(state.start_date!==''){
          const active_day = state.start_date.split("-")
          today = new Date(
            parseInt(active_day[2]), //year
            parseInt(active_day[1])-1, //month
            parseInt(active_day[0]) //day
          )

        }

        //go back one day
        today.setDate(today.getDate()-1)
        const day = today.getDate()
        const month = today.getMonth()+1//fucking js and zero based months..
        const year = today.getFullYear()
        const full_date = `${day}-${month}-${year}`

        return {
          ...state,
          start_date: full_date,
          end_date: full_date
        }
      }

      case 'SET_START_DATE':
      {
        return {
          ...state,
          start_date: action.payload
        }
      }

      case 'SET_END_DATE':
      {
        return {
          ...state,
          end_date: action.payload
        }
      }
      
    } // switch
  
    return state // default return
  
  } // reducer
  