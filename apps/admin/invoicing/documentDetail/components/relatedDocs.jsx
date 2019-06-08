/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    document: store.documentDetail.activeDocument,
    userProfile: store.userProfile.profile
  }
})
export default class RelatedDocs extends React.Component {

  // Main Layout
  render() {

    return <div className='documentDetail-related'>

      <div className='admin-invoicing-detail-header'>
        DOCS RELACIONADOS
      </div>

      {/* <table className=' table documentDetail-related-table'>
        <tbody>

        </tbody>
      </table> */}

    </div>

  }

}
