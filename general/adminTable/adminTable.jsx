/*
 * Module dependencies
 */
import React from 'react'
import {Link} from 'react-router-dom'
import {formatDateTimeAmPm} from '../../utils/formatDate.js'
import {connect} from 'react-redux'
import axios from 'axios'
import alertify from 'alertifyjs'

const uuidv1 = require('uuid/v1')

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

  componentDidMount() {
    this.setState({
      ascending: !this.props.defaultDescending
    })
  }

  rowDoubleClick(item, ev) {
    if (this.props.onRowDoubleClick) {
      this.props.onRowDoubleClick(item, this.props.dispatch)
      return true
    }
  }

  rowClick(index, ev) {
    if (this.props.onRowClick) {
      this.props.onRowClick(index, this.props.dispatch)
      return true
    }
  }

  activeItemAction(el) {
    if (this.props.onActiveItem) {
      this.props.onActiveItem(el, this.props.dispatch)
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

  // FIXME READY TO DELETE
  // downloadPdf(baseUrl, item) {
  //   const url = `${baseUrl}/${item}_signed.pdf`
  //   axios.get(url).then(response => {
  //     console.log(response)
  //   }).catch(err => {
  //     console.log(err)
  //   })
  // }

  // downloadXML(baseUrl, item) {
  //   const url = `${baseUrl}/${item}_signed.xml`
  //   console.log(url)
  // }

  // downloadHaciendaResponseXML(baseUrl, item) {
  //   const url = `${baseUrl}/${item}_response.xml`
  //   console.log(url)
  // }

  resetHuman(id) {
    const docList = []
    docList.push(id)
    const data = {
      docs_list: docList
    }
    axios({
      method: 'post',
      url: '/api/docactionrequired/reset_human_required/',
      data: data
    }).then((response) => {
      alertify.alert('COMPLETADO', 'Elemento Reintentando...')
    }).catch((err) => {
      alertify.alert('ERROR', `Error al reintentar el documento ${err}`)
    })
  }

  reprintServiceOrder(id) {
    const data = {
      id: id
    }
    axios({
      method: 'post',
      url: '/api/restaurantserviceorderactions/set_for_reprint_SO/',
      data: data
    }).then((response) => {
      alertify.alert('COMPLETADO', 'Elemento enviado para reimpresión...')
    }).catch((err) => {
      alertify.alert('ERROR', `Error al enviar el documento para reimpresión: ${err}`)
    })
  }

  resendMail(id, mails) {
    const noSpacesMails = mails.replace(/\s/g, '')
    const extraMails = noSpacesMails.split(',')
    const data = {
      extra_emails: extraMails,
      doc_consecutive: id
    }
    axios({
      method: 'post',
      url: `/api/facturareception/resendemails/`,
      data: data
    }).then((response) => {
      alertify.alert('COMPLETADO', 'Correos en proceso de reenvío.')
    }).catch((err) => {
      alertify.alert('ERROR', `Error al procesasar el reenvío ${err}`)
    })
  }

  sendQuotingMail(id, mails) {
    const noSpacesMails = mails.replace(/\s/g, '')
    const extraMails = noSpacesMails.split(',')
    axios({
      method: 'get',
      url: `/api/presales/buildAndEmailQuotation/?presale=${id}&to=${extraMails}`
    }).then((response) => {
      alertify.alert('COMPLETADO', 'Correos en proceso de envío.')
    }).catch((err) => {
      alertify.alert('ERROR', `Error al procesasar el envío ${err}`)
    })
  }

  resendMailPrompt(id) {
    const _this = this
    alertify.prompt('CORREOS ADICIONALES', `El correo se reenviará a los receptores originales, si hay otros receptores
      digite la lista de correos adicionales a enviar, separados por comas (,)`, '',
    function(evt, value) { _this.resendMail(id, value) },
    function(evt, value) { })
  }

  sendQuotingMailPrompt(id) {
    const _this = this
    alertify.prompt('CORREOS ADICIONALES', `Digite la lista de correos a los cuales necesite enviar la proforma, separados por comas (,)`, '',
      function(evt, value) { _this.sendQuotingMail(id, value) },
      function(evt, value) { })
  }

  determinClientName(client, extraClient) {
    if (client.client) { client = client.client }
    if (client) {
      if (client.code == '00') {
        return extraClient.name
      }
      return client.name
    }
    return 'Cliente'
  }

  determinClientLastName(client, extraClient) {
    if (client.client) { client = client.client }
    if (client) {
      if (client.code == '00') {
        return extraClient.last_name
      }
      return client.last_name
    }
    return 'General'
  }

  dropdownWidget = (id, elements, itemToRender) => {
    const elementsToRender = elements.map(element => {
      return <Link key={element.url} className='dropdownWidget-element' to={{pathname: `${element.url}/${itemToRender}`}}>
        <i className={element.iconClass} />
        {element.text}
      </Link>
    })
    return <div key={`dropdownWidget_${id}`} id={id} className='dropdownWidget'>
      {elementsToRender}
    </div>
  }

  toggleDropdown(id) {
    const element = document.getElementById(id)
    element.classList.toggle('visible')
  }

  render() {
    const headerOrder = this.props.headerOrder
    const model = this.props.model
    const app = this.props.app ? this.props.app : 'admin'
    const unsortedData = this.props.data.length
      ? this.props.data
      : []
    const sortedBy = this.state.sortedBy ? this.state.sortedBy : this.props.defaultSorting
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
          key={uuidv1()}
          onClick={this.changeSortBy.bind(this, item.field)}
        >
          {item.text}
        </th>
        : <th
          className={orderingClass}
          onClick={this.changeSortBy.bind(this, item.field)}
          style={itemStyleBool}
          key={uuidv1()}>
          {item.text}
        </th>
      return ret
    })

    const idField = this.props.idField
    let currentIndex = 0
    const bodyRows = data.map(el => {
      const activeClass = this.props.activeIndex == currentIndex ? 'admin-table-active-row' : ''
      // IN CASE IT IS THE ACTIVE INDEX, EXECUTE THE FUNCTION FOR ACTIVE INDEX
      if (currentIndex == this.props.activeIndex) {
        this.activeItemAction(el)
      }
      // ADD 1 TO CURRENT INDEX BEFORE CYCLE ENDS
      currentIndex += 1
      return <tr className={activeClass} key={el[idField]} onDoubleClick={this.rowDoubleClick.bind(this, el[idField])} onClick={this.rowClick.bind(this, currentIndex - 1)} >
        { headerOrder.map(header => {
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
            case 'REPRINT_SERVICE_ORDER':
            {
              item = <td key={`${el[idField]}_${header.field}_reprintSO`}>
                <button className='btn btn-primary' onClick={this.reprintServiceOrder.bind(this, itemToRender)} >Reimprimir</button>
              </td>
              break
            }
            case 'SEND_QUOTING_MAIL':
            {
              item = <td key={`${el[idField]}_${header.field}_resend`}>
                <button className='btn btn-success' onClick={this.sendQuotingMailPrompt.bind(this, itemToRender)}>Enviar</button>
              </td>
              break
            }
            case 'RESEND_MAIL':
            {
              item = <td key={`${el[idField]}_${header.field}_resend`}>
                <button className='btn btn-success' onClick={this.resendMailPrompt.bind(this, itemToRender)} >Reenviar</button>
              </td>
              break
            }
            case 'RESET_HUMAN':
            {
              item = <td key={`${el[idField]}_${header.field}_retry`}>
                <button className='btn btn-primary' onClick={this.resetHuman.bind(this, itemToRender)} >Reintentar</button>
              </td>
              break
            }
            case 'PDF':
            {
              const url = `${header.base_url}/${itemToRender}_signed.pdf`
              item = <td key={`${el[idField]}_${header.field}_pdf`}>
                <a download={`${itemToRender}.pdf`} href={url}><i className='fa fa-file-pdf-o' /></a>
              </td>
              break
            }

            case 'XML':
            {
              const url = `${header.base_url}/${itemToRender}_signed.xml`
              item = <td key={`${el[idField]}_${header.field}_xml`}>
                <a download={`${itemToRender}.xml`} href={url}><i className='fa fa-file-code-o' /></a>
              </td>
              break
            }
            case 'XML_HACIENDA':
            {
              const url = `${header.base_url}/${itemToRender}_response.xml`
              item = <td key={`${el[idField]}_${header.field}_xml_response`}>
                <a download={`${itemToRender}_respuesta.xml`} href={url}><i className='fa fa-file-code-o' /></a>
              </td>
              break
            }

            case 'XML_HACIENDA_PURCHASE':
            {
              const url = `${header.base_url}/${itemToRender}-${itemToRender2}_response.xml`
              item = <td key={`${el[idField]}_${header.field}_xml_response`}>
                <a download={`${itemToRender}_respuesta.xml`} href={url}><i className='fa fa-file-code-o' /></a>
              </td>
              break
            }
            case 'CLIENT_NAME_EXTRAS':
            {
              // PRELOAD SOME EXTRAS IN CASE SALE DOES NOT HAVE ONE
              let extras = {
                notes: '',
                client: {
                  last_name: 'General',
                  name: 'Cliente',
                  email: ''
                }
              }
              try {
                extras = el.extras ? JSON.parse(el.extras) : extras
              } catch (err) { console.log('ERROR PARSE', err) }
              // PARSE THE CLIENT
              let client = itemToRender
              try {
                client = JSON.parse(client)
              } catch (err) { console.log(err) }
              // DETERMIN THE NAME AND LAST_NAME
              const name = this.determinClientName(client, extras.client)
              const lastName = this.determinClientLastName(client, extras.client)
              item = <td key={`${el[idField]}_extras_name`}>
                {`${name} ${lastName}`}
              </td>
              break
            }
            case 'price':
            {
              item = <td key={`${el[idField]}_${header.field}`}>
                ₡ {parseFloat(itemToRender).formatMoney(2, ',', '.')}
              </td>
              break
            }

            case 'toFixed2':
            {
              item = <td key={`${el[idField]}_${header.field}`}>
                {parseFloat(itemToRender).toFixed(2)}
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
              let date = 'Indefinida'
              if (itemToRender) {
                date = formatDateTimeAmPm(itemToRender)
              }
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

                <a target='_blank' href={`${header.baseLink}/${itemToRender}`}>
                  {itemToRender}
                </a>
              </td>
              break
            }
            case 'link_params':
            {
              let anchor;

              let params = []
              // console.log("El --> ", el)
              if(header.fieldAsParams){
                header.fieldAsParams.forEach(param => {
                  params.push(
                    {
                      paramName: param.name,
                      value: el[param.field]
                    }
                  )
                })
              }

              if(header.extraParams){
                header.extraParams.forEach(element => {
                  params.push(
                    {
                      paramName: element.name,
                      value: element.value
                    }
                  )
                });
              }

              if(params.length < 1){
                anchor = <a target='_blank' href={`${header.baseLink}`}>
                    {header.textToRender}
                  </a>
              }else{
                let href = '/?'
                params.forEach(param => {
                  href += `${param.paramName}=${param.value}&`
                })
                href = href.substring(0, href.length-1)
                anchor = <a target='_blank' href={`${header.baseLink}${href}`}>
                  {header.textToRender}
                </a>
              }

              item = <td key={`${el[idField]}_${header.field}_lp`}>
                {anchor}
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
              const idUnique = header.idUnique ? header.idUnique : Math.random()
              const amount = header.worker_method(itemToRender)
              item = <td key={`${el[idField]}_${header.field}_${idUnique}`}>
                {amount}
              </td>
              break
            }
            case 'function_on_click':
            {
              const visible = header.textToRender ? header.textToRender : itemToRender
              const ref = header.href ? header.href : '#'
              const idUnique = header.idUnique ? header.idUnique : 1
              item = <td key={`${el[idField]}_${header.field}_fclick_${idUnique}`}>
                <a onClick={header.onClickFunction.bind(this, itemToRender)} href={ref} >{visible}</a>
              </td>
              break
            }
            case 'function_on_click_pass_element':
            {
              const visible = header.textToRender ? header.textToRender : itemToRender
              const ref = header.href ? header.href : '#'
              item = <td key={`${el[idField]}_${header.field}_fclick_pass`}>
                <a onClick={header.onClickFunction.bind(this, el)} href={ref} >{visible}</a>
              </td>
              break
            }
            case 'function_element':
            {
              const element = header.worker_method(el)
              item = <td className='functionElement' key={`${el[idField]}_${header.field}`}>
                {element}
              </td>
              break
            }
            case 'select2':
            {
              const element = header['builder'](el[header['value']], header.handler, el[idField])

               item = <td className="select2-container" key={`${el[idField]}_select2-container`}>
              {element}
              </td>
              break
            }
            case 'button':
            {
              let onclickMeta = header.onClick
              let click_handler = undefined
              let click_kwargs = {}
              if(onclickMeta){
                click_handler = onclickMeta.method
                for(let param of onclickMeta.method_params){
                  if(param.type === "raw"){
                    click_kwargs[param.name] = param.value
                  }else{
                    click_kwargs[param.name] = el[param.key]
                  }
                }
              }

              const element = header['builder'](
                header['text'], //button text
                header['class_names'], //css classes to apply
                click_handler, //click handler
                click_kwargs //dictionary with params passed to the handler
                )

              item = <td className="button-container" key={`${el[idField]}${header['text']}_b-container`}>
              {element}
              </td>
              break
            }
            case 'function_element_double':
            {
              const element = header.worker_method(el)
              item = <td className='functionElement' key={`${el[idField]}_${header.field}_${header.number}`}>
                {element}
              </td>
              break
            }
            case 'link_mask':
            {
              const uniqueId = header.uniqueId ? header.uniqueId : 0
              item = <td key={`${el[idField]}_${header.field}_link_mask_${uniqueId}`}>
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
            case 'link_mask_target2':
            {

              item = <td key={`${el[idField]}_${header.field}_link_mask_target2`}>
                {/* <Link to={`/admin/${model}/edit#${itemToRender}`}>
                                              {itemToRender}
                                          </Link> */}
                <Link to={{
                  pathname: `/${app}/${header.target}/${itemToRender}/${header.target2}`
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

            case 'dropdown':
            {
              const uniqueId = header.uniqueId ? header.uniqueId : 0
              const id = `adminTable-dropdown-${itemToRender}`
              // const dropdownElementId = `dropdown-element-${itemToRender}`
              const dropDownBody = this.dropdownWidget(id, header.elements, itemToRender)
              item = <td className=' dropdownAdminCell relativeAdminCell' key={`${el[idField]}_${header.field}_${uniqueId}`} onClick={this.toggleDropdown.bind(this, id)}>
                {header.textToRender}
                <i className='fa fa-chevron-down' />
                {dropDownBody}
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
        })
        }
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
