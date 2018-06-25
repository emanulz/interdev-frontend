import React from 'react'
import {connect} from 'react-redux'
import {formatDateTimeAmPm} from '../../../../utils/formatDate.js'
import {loadWorkOrder, getPendingWorkOrders} from './actions.js'
import {productSelected, setProduct} from '../../general/product/actions.js'
import alertify from 'alertifyjs'

@connect((store) => {
  return {
    workOrders: store.workOrders.workOrders,
    isVisible: store.workOrders.isVisible,
    client: store.clients.clientSelected,
    itemsInCart: store.cart.cartItems,
    inputVal: store.products.inputVal,
    globalDiscount: store.cart.globalDiscount,
    warehouse_id: store.config.workshopWarehouse
  }
})
export default class WorkOrdersPanel extends React.Component {

  componentWillMount() {
    const kwargs = {
      url: '/api/listworkorders',
      ordering: '-updated',
      filterField: 'is_closed',
      filter: 'True',
      filterField2: 'payed',
      filter2: 'False',
      filterField3: 'is_null',
      filter3: 'False',
      successType: 'FETCH_WORK_ORDERS_FULFILLED',
      errorType: 'FETCH_WORK_ORDERS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getPendingWorkOrders(kwargs))
  }

  hidePanel() {
    this.props.dispatch({type: 'HIDE_WORK_ORDERS_PANEL', payload: -1})
  }

  loadWorkOrderItem(id, ev) {

    const _this = this
    const url = `/api/listworkorders/${id}`
    const loadPromise = new Promise((resolve, reject) => {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      this.props.dispatch(loadWorkOrder(url, resolve, reject))
    })
    loadPromise.then((data) => {
      this.props.dispatch({type: 'HIDE_WORK_ORDERS_PANEL', payload: -1})
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      this.props.dispatch({type: 'CLEAR_CART', payload: ''})
      data.work_order.client = JSON.parse(data.work_order.client)
      data.work_order.receiving_employee = JSON.parse(data.work_order.receiving_employee)
      _this.props.dispatch({type: 'CLIENT_SELECTED', payload: data.work_order.client})
      _this.loadCart(data)
      _this.props.dispatch({type: 'SET_WORK_ORDER_LOADED', payload: data})
      _this.props.dispatch({type: 'SET_WORK_ORDER_ID', payload: data.work_order.id})
      _this.props.dispatch({type: 'SET_WORK_ORDER_USER', payload: data.work_order.receiving_employee})
      _this.props.dispatch({type: 'PRESALE_LOADED', payload: ''})
    }).catch((err) => {
      if (err.response) {
        alertify.alert('ERROR', `${err.response.data}`)
        console.log(err.response)
      } else {
        alertify.alert('ERROR', `Hubo un error al cargar la preventa, error: ${err}`)
        console.log(err)
      }
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
    })
  }

  loadCart(workOrder) {
    console.log('LOAD WORK ORDER', workOrder)
    const laborList = workOrder.labor_objects
    const usedObjects = workOrder.used_objects
    const partRequest = workOrder.part_requests

    this.loadPartRequests(partRequest)
    this.loadUsedParts(usedObjects)
    this.loadLaborList(laborList)

  }

  loadPartRequests(partRequest) {
    for (const item in partRequest) {
      try {
        const product = JSON.parse(partRequest[item].product)
        this.props.dispatch(
          productSelected(
            product.code,
            partRequest[item].amount,
            product,
            this.props.itemsInCart,
            this.props.globalDiscount,
            this.props.client,
            this.props.warehouseId)
        )
      } catch (err) {
        console.log(err)
      }
    }
  }

  loadLaborList(laborList) {
    const _this = this
    const setProductPromise = new Promise((resolve, reject) => {
      const kwargs = {
        lookUpField: 'code',
        url: '/api/productslist/',
        lookUpValue: 'MO001',
        lookUpName: 'código',
        modelName: 'Productos'
      }
      setProduct(kwargs, resolve, reject)
    })

    setProductPromise.then((data) => {
      console.log(data)
      _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      const product = data.results[0]

      for (const item in laborList) {
        try {
          const productCopy = product
          productCopy.price = laborList[item].amount / 1.13
          productCopy.description = laborList[item].description
          this.props.dispatch(
            productSelected(
              productCopy.code,
              1,
              productCopy,
              this.props.itemsInCart,
              this.props.globalDiscount,
              this.props.client,
              this.props.warehouseId,
              false
            )
          )
        } catch (err) {
          console.log(err)
        }
      }

    }).catch((err) => {
      _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      console.log(err)
    })

  }

  loadUsedParts(usedObjects) {
    const _this = this
    const setProductPromise = new Promise((resolve, reject) => {
      const kwargs = {
        lookUpField: 'code',
        url: '/api/productslist/',
        lookUpValue: 'RU001',
        lookUpName: 'código',
        modelName: 'Productos'
      }
      setProduct(kwargs, resolve, reject)
    })

    setProductPromise.then((data) => {
      console.log(data)
      _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      const product = data.results[0]

      for (const item in usedObjects) {
        try {
          const productCopy = product
          productCopy.price = usedObjects[item].amount
          productCopy.description = usedObjects[item].description
          this.props.dispatch(
            productSelected(
              productCopy.code,
              1,
              productCopy,
              this.props.itemsInCart,
              this.props.globalDiscount,
              this.props.client,
              this.props.warehouseId,
              false
            )
          )
        } catch (err) {
          console.log(err)
        }
      }

    }).catch((err) => {
      _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      console.log(err)
    })

  }
  render() {

    const isVisible = (this.props.isVisible)
      ? 'workOrders-panel is-visible'
      : 'workOrders-panel'

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const workOrders = this.props.workOrders

    const itemsToRender = workOrders.map(workOrder => {
      const presellerName = workOrder.receiving_employee.first_name
        ? `${workOrder.receiving_employee.first_name} ${workOrder.receiving_employee.last_name}`
        : `${workOrder.receiving_employee.username}`
      return <tr key={workOrder.id}>
        <td className='loadRow'><i onClick={this.loadWorkOrderItem.bind(this, workOrder.id)} className='fa fa-download' /></td>
        <td>{workOrder.consecutive}</td>
        <td>{`${formatDateTimeAmPm(workOrder.created)}`}</td>
        <td>{`${workOrder.client.name} ${workOrder.client.last_name}`}</td>
        <td>{presellerName}</td>
        {/* <td>₡ {parseFloat(workOrder.cart.cartTotal).formatMoney(2, ',', '.')}</td> */}
      </tr>
    })

    return <div className={isVisible}>
      <div className='workOrders-panel-header'>
            ÓRDENES DE TALLER SIN FACTURAR
        <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
      </div>
      <div className='workOrders-panel-container'>
        <div className='col-xs-12'>
          <table className='table'>
            <thead>
              <tr>
                <td>Cargar</td>
                <td>#</td>
                <td>Fecha</td>
                <td>Cliente</td>
                <td>Vendedor</td>
                {/* <td>Monto</td> */}
              </tr>
            </thead>
            <tbody>
              {itemsToRender}
            </tbody>
          </table>
        </div>
      </div>
    </div>

  }

}
