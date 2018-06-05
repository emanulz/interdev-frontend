/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import { getPaginationItemDispatch } from '../../utils/api.js'

@connect((store) => {
  return {
    pageSize: store.pagination.pageSize,
    total: store.pagination.total,
    currentPage: store.pagination.currentPage,
    nextUrl: store.pagination.next,
    previousUrl: store.pagination.previous
  }
})
export default class Pagination extends React.Component {

  paginationBtnAction (url, index, ev) {
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'SET_CURRENT_PAGE', payload: index})

    const productKwargs = {
      url: url,
      successType: this.props.successType,
      errorType: this.props.errorType
    }
    this.props.dispatch(getPaginationItemDispatch(productKwargs))
  }

  paginationNextAction (url, ev) {
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'SET_CURRENT_PAGE', payload: this.props.currentPage + 1})

    const productKwargs = {
      url: url,
      successType: this.props.successType,
      errorType: this.props.errorType
    }
    this.props.dispatch(getPaginationItemDispatch(productKwargs))
  }

  paginationPrevAction (url, ev) {
    this.props.dispatch({type: 'SET_CURRENT_PAGE', payload: this.props.currentPage - 1})

    const productKwargs = {
      url: url,
      successType: this.props.successType,
      errorType: this.props.errorType
    }
    this.props.dispatch(getPaginationItemDispatch(productKwargs))
  }

  generateButton(index) {

    const firstUrlToLink = `${this.props.url}?limit=${this.props.pageSize}`
    const urlToLink = `${this.props.url}?limit=${this.props.pageSize}&offset=${(index) * this.props.pageSize}`
    const paginationClass = index == this.props.currentPage ? 'pagination-item paginationActive' : 'pagination-item'

    if (index == 1) {
      return <div key={index} className={paginationClass} onClick={this.paginationBtnAction.bind(this, firstUrlToLink, index)}>
        {index}
      </div>
    }
    return <div key={index} className={paginationClass} onClick={this.paginationBtnAction.bind(this, urlToLink, index)}>
      {index}
    </div>
  }

  generateNextBtn (ev) {
    const btn = this.props.nextUrl
      ? <div key='next_btn' className='pagination-item' onClick={this.paginationNextAction.bind(this, this.props.nextUrl)}>
        <i className='fa fa-chevron-right' />
      </div>
      : <div key='next_btn' className='pagination-item itemDisabled'>
        <i className='fa fa-chevron-right' />
      </div>

    return btn
  }

  generatePrevBtn (ev) {
    const btn = this.props.previousUrl
      ? <div key='prev_btn' className='pagination-item' onClick={this.paginationPrevAction.bind(this, this.props.previousUrl)}>
        <i className='fa fa-chevron-left' />
      </div>
      : <div key='prev_btn' className='pagination-item itemDisabled'>
        <i className='fa fa-chevron-left' />
      </div>

    return btn
  }

  render() {
    const pageSize = this.props.pageSize
    const total = this.props.total

    const fullPages = Math.floor(total / pageSize)
    const remainder = total % pageSize
    const totalPages = remainder > 0 ? fullPages : fullPages - 1

    const renderItem = []
    const currentPage = this.props.currentPage
    const dots1 = <div className='pagination-item notPointer' key='dots1' >...</div>
    const dots2 = <div className='pagination-item notPointer' key='dots2' >...</div>
    const controlArray = []

    // DO PAGINATION ONLY IF THERE ARE PAGES
    if (totalPages > 0) {
      // PUSH THE FIRST ITEM
      renderItem.push(this.generateButton(1))
      controlArray.push(1)

      if ((currentPage - 1 > 0) && (controlArray.indexOf(currentPage - 1) == -1)) {
        renderItem.push(this.generateButton(currentPage - 1))
        controlArray.push(currentPage - 1)
      }

      if (controlArray.indexOf(currentPage) == -1) {
        renderItem.push(this.generateButton(currentPage))
        controlArray.push(currentPage)
      }

      if ((currentPage + 1 <= totalPages) && (controlArray.indexOf(currentPage + 1) == -1)) {
        renderItem.push(this.generateButton(currentPage + 1))
        controlArray.push(currentPage + 1)
      }

      if (controlArray.indexOf(totalPages) == -1) {
        renderItem.push(this.generateButton(totalPages))
        controlArray.push(totalPages)
      }
      // IF IM ON THE FIRST PAGE
      if (controlArray.length == 3 && currentPage == 1 && totalPages > 3) {
        renderItem.splice((controlArray.length - 1), 0, dots2)
      }
      // IF IM ON THE LAST PAGE
      if (controlArray.length == 3 && totalPages > 3 && currentPage != 1) {
        renderItem.splice(1, 0, dots1)
      }

      if (controlArray.length == 4 && totalPages > 4) {
        if (currentPage == 2) {
          renderItem.splice((controlArray.length - 1), 0, dots2)
        } else {
          renderItem.splice(1, 0, dots1)
        }
      }

      // IF IM ON THE THIRD
      if (controlArray.length == 5 && currentPage == 3) {
        renderItem.splice((controlArray.length - 1), 0, dots2)
      }
      // FULL ARRAY AND NOT THIRD
      if (controlArray.length == 5) {
        console.log(controlArray[controlArray.length - 3])
        if (currentPage > 3 && (currentPage + 2) != controlArray[controlArray.length - 1]) {
          renderItem.splice(1, 0, dots1)
          renderItem.splice((controlArray.length), 0, dots2)
        }
        if (currentPage > 3 && (currentPage + 2) == controlArray[controlArray.length - 1]) {
          renderItem.splice(1, 0, dots1)
        }
      }

      renderItem.splice(0, 0, this.generatePrevBtn())
      renderItem.push(this.generateNextBtn())

    }

    return <div className='pagination'>
      {renderItem}
    </div>

  }

}
