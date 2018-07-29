import { inspect } from 'util';

const stateConst = {
    reports_definitions: {},
  }

export default function reducer(state=stateConst, action){
    switch (action.type){
        case 'REPORTS_DEFINITIONS_FETCHED':
        {
            return {
                ...state,
                reports_definitions: action.payload,
            }
        }

        case 'REPORTS_DEFINITIONS_REJECTED':
        {
            return {
                ...state,
                reports_definitions: {},
            }
        }
    }
    return state
}