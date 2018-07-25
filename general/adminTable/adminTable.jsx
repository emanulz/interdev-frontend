/*
 * Module dependencies
 */
import React from 'react'
import {Link} from 'react-router-dom'
import {formatDateTimeAmPm} from '../../utils/formatDate.js'
import {connect} from 'react-redux'

@connect((store) => {
  return {
  }
})
export default class AdminTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sortedBy: props.sortedBy,
      ascending: true
    }
  }

  rowDoubleClick(item, ev) {
    if (this.props.onRowDoubleClick) {
      this.props.onRowDoubleClick(item, this.props.dispatch)
      return true
    }
  }

  generateBody(headerOrder, data) {}

  generateRow() {}

  changeSortBy(value, ev) {
    // IF: IS CLICKED ON THE SAME OBJECT CHANGE THE SORTING DIRECTION
    if (this.state.sortedBy == value) {
      this.setState({ascending: !this.state.ascending})
    // ELSE: UPDATE THE SORTING CRITERIA
    } else {
      this.setState({sortedBy: value, ascending: !this.setState.ascending})
    }
  }

  render() {
    const headerOrder = this.props.headerOrder
    const model = this.props.model
    const app = this.props.app ? this.props.app : 'admin'
    const unsortedData = this.props.data.length
      ? this.props.data
      : []
    const sortedBy = this.state.sortedBy
    const ascending = this.state.ascending
    const data = unsortedData.sort((a, b) => {
      // IF IS ASCENDING SORTING
      if (ascending) {
        if (a[sortedBy] > b[sortedBy]) {
          return 1
        }
        if (a[sortedBy] < b[sortedBy]) {
          return -1
        }
        return 0
      }
      // IF IS DESCENDING SORTING
      if (a[sortedBy] < b[sortedBy]) {
        return 1
      }
      if (a[sortedBy] > b[sortedBy]) {
        return -1
      }
      return 0
    })

    const tableHeader = headerOrder.map(item => {
      // Ordering ClassName
      const orderingClass = item.field == this.state.sortedBy && this.state.ascending ? 'sortingActiveUp'
        : item.field == this.state.sortedBy && !this.state.ascending ? 'sortingActiveDown' : ''
      // Inline Styles
      const itemStyle = item.width ? {width: item.width} : {}
      const itemStyleBool = item.width ? {width: item.width, textAlign: 'center'} : {textAlign: 'center'}
      // Apply Styles and class wether is bool or not
      const ret = item.type != 'bool'
        ? <th
          className={orderingClass}
          style={itemStyle}
          key={`${item.field}_${item.type}`}
          onClick={this.changeSortBy.bind(this, item.field)}
        >
          {item.text}
        </th>
        : <th
          className={orderingClass}
          onClick={this.changeSortBy.bind(this, item.field)}
          style={itemStyleBool}
          key={`${item.field}_${item.type}`}>
          {item.text}
        </th>
      return ret
    })

    const idField = this.props.idField
    const bodyRows = data.map(el => {

      return <tr key={el[idField]} onDoubleClick={this.rowDoubleClick.bind(this, el[idField])} >
        {headerOrder.map(header => {

          // const fieldName = header.field
          // const itemToRender = el[fieldName]

          const fieldNames = header.field.split('.')
          let itemToRender = ''

          if (fieldNames.length == 1) itemToRender = el[fieldNames[0]]
          if (fieldNames.length == 2) itemToRender = el[fieldNames[0]][fieldNames[1]]
          if (fieldNames.length == 3) itemToRender = el[fieldNames[0]][fieldNames[1]][fieldNames[2]]
          if (fieldNames.length == 4) itemToRender = el[fieldNames[0]][fieldNames[1]][fieldNames[2]][fieldNames[3]]

          const fieldNames2 = header.field2 ? header.field2.split('.') : []
          let itemToRender2 = ''

          if (fieldNames2.length == 1) itemToRender2 = el[fieldNames2[0]]
          if (fieldNames2.length == 2) itemToRender2 = el[fieldNames2[0]][fieldNames2[1]]
          if (fieldNames2.length == 3) itemToRender2 = el[fieldNames2[0]][fieldNames2[1]][fieldNames2[2]]
          if (fieldNames2.length == 4) itemToRender2 = el[fieldNames2[0]][fieldNames2[1]][fieldNames2[2]][fieldNames2[3]]

          let item
          switch (header.type) {
            case 'price':
            {
              item = <td key={`${el[idField]}_${header.field}`}>
                ₡ {parseFloat(itemToRender).formatMoney(2, ',', '.')}
              </td>
              break
            }

            case 'priceAbs':
            {
              item = <td key={`${el[idField]}_${header.field}`}>
                ₡ {Math.abs(parseFloat(itemToRender)).formatMoney(2, ',', '.')}
              </td>
              break
            }

            case 'date':
            {
              // const date = moment(itemToRender).format('DD-MM-YYYY HH:mm:ss')
              const date = formatDateTimeAmPm(itemToRender)
              item = <td key={`${el[idField]}_${header.field}`}>
                {date}
              </td>
              break
            }

            case 'bool':
            {
              const icon = itemToRender
                ? 'fa fa-check'
                : 'fa fa-minus-square'
              item = <td style={{
                textAlign: 'center'
              }} key={`${el[idField]}_${header.field}`}>
                <span className={icon} />
              </td>
              break
            }

            case 'primary':
            {

              item = <td key={`${el[idField]}_${header.field}`}>
                {/* <Link to={`/admin/${model}/edit#${itemToRender}`}>
                                              {itemToRender}
                                          </Link> */}
                <Link to={{
                  pathname: `/${app}/${model}/edit/${itemToRender}`,
                  state: {
                    el: el
                  }
                }}>
                  {itemToRender}
                </Link>
              </td>
              break
            }

            case 'primaryNoEdit':
            {

              item = <td key={`${el[idField]}_${header.field}`}>
                {/* <Link to={`/admin/${model}/edit#${itemToRender}`}>
                                              {itemToRender}
                                          </Link> */}
                <Link to={{
                  pathname: `/${app}/${model}/${itemToRender}`,
                  state: {
                    el: el
                  }
                }}>
                  {itemToRender}
                </Link>
              </td>
              break
            }

            case 'link':
            {

              item = <td key={`${el[idField]}_${header.field}`}>
                {/* <Link to={`/admin/${model}/edit#${itemToRender}`}>
                                              {itemToRender}
                                          </Link> */}
                <a target='_blank' href={`${header.baseLink}/${itemToRender}`}>
                  {itemToRender}
                </a>
              </td>
              break
            }

            case 'link_text':
            {

              item = <td key={`${el[idField]}_${header.field}_tl`}>
                {/* <Link to={`/admin/${model}/edit#${itemToRender}`}>
                                              {itemToRender}
                                          </Link> */}
                <a target='_blank' href={`${header.baseLink}/${itemToRender}`}>
                  {header.textToRender}
                </a>
              </td>
              break
            }

            case 'function_process':
            {
              const amount = header.worker_method(itemToRender)
              item = <td key={`${el[idField]}_${header.field}`}>
                {amount}
              </td>
              break
            }
            case 'function_on_click':
            {
              item = <td key={`${el[idField]}_${header.field}_fclick`}>
                <a onClick={header.onClickFunction.bind(this, itemToRender)} href='#' >{header.textToRender}</a>
              </td>
              break
            }
            case 'link_mask':
            {

              item = <td key={`${el[idField]}_${header.field}`}>
                {/* <Link to={`/admin/${model}/edit#${itemToRender}`}>
                                              {itemToRender}
                                          </Link> */}
                <Link to={{
                  pathname: `/${app}/${header.target}/${itemToRender}`
                }}>
                  {header.textToRender}
                </Link>
              </td>
              break
            }

            case 'textLink':
            {

              item = <td key={`${el[idField]}_${header.field}_${header.type}`}>
                <Link to={{
                  pathname: `/${app}/${model}/${itemToRender}`
                }}>
                  {header.textToRender}
                </Link>
              </td>
              break
            }

            case 'foreingKey':
            {
              const code = header.split ? itemToRender.split(header.split)[header.splitIndex] : itemToRender

              const filtered = header.iterable.filter(item => {
                return item[header.lookUpField] == code
              })

              const returnItem = filtered.length ? filtered[0][header.foreingKeyField] : '-'
              item = <td key={`${el[idField]}_${header.field}`} data-order={returnItem}>
                {returnItem}
              </td>
              break
            }

            case 'composed':
            {
              item = <td key={`${el[idField]}_${header.field}`}>
                {`${itemToRender} ${itemToRender2}`}
              </td>
              break
            }

            default:
            {
              item = <td key={`${el[idField]}_${header.field}`}>
                {itemToRender}
              </td>
            }

          }

          return item
        })}
      </tr>
    })

    return <div className='admin-table'>

      {/* <h3>Resultados de la busqueda:</h3> */}

      <table ref='table' cellSpacing='0' width='100%'>
        <thead>
          <tr>
            {tableHeader}
          </tr>
        </thead>

        <tfoot>
          <tr>
            {tableHeader}
          </tr>
        </tfoot>

        <tbody>
          {bodyRows}
        </tbody>

      </table>

    </div>
  }
}
