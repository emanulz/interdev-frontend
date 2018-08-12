import React from 'react'
import {connect} from 'react-redux'

@connect((store, ownProps) => {
  return {
    searchimageName: store[ownProps.namespace].activeImageName,
    searchImagecode: store[ownProps.namespace].activeImageCode
  }
})
export default class SearchImage extends React.Component {

  render() {
    const imageUrl = this.props.searchimageName !== '' ? `/media/productImages/${this.props.searchimageName}` : `/media/Imagenes/${this.props.searchImagecode}.jpg`
    return <div className='search-panel-image-container'>
      <img src={imageUrl} onError={(e) => { e.target.src = '/media/default/noimage.png' }} />
    </div>

  }

}
