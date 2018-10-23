import React from 'react'
import {connect} from 'react-redux'
import {formatDateTimeAmPm} from '../../../../utils/formatDate.js'
import {loadWorkOrder, getPendingWorkOrders, reopenWorkOrder} from './actions.js'
import {productSelected, setProduct} from '../../general/product/actions.js'
import {getFullClientById} from '../../general/clients/actions.js'
import alertify from 'alertifyjs'

@connect((store) => {
  return {
    workOrders: store.workOrders.workOrders,
    isVisible: store.workOrders.isVisible,
    client: store.clients.clientSelected,
    itemsInCart: store.cart.cartItems,
    inputVal: store.products.inputVal,
    globalDiscount: store.cart.globalDiscount,
    warehouse_id: store.config.workshopWarehouse,
    priceListSelected: store.priceList.listSelected,
    usePriceListAsDefault: store.priceList.useAsDefault
  }
})
export default class WorkOrdersPanel extends React.Component {

  componentWillMount() {
    const kwargs = {
      url: '/api/listworkorders',
      ordering: '-updated',
      filterField: 'is_closed',
      filter: 'True',
      filterField2: 'paid',
      filter2: 'False',
      filterField3: 'is_null',
      filter3: 'False',
      filterField4: 'is_warranty',
      filter4: 'False',
      filterField5: 'closed_no_repair',
      filter5: 'False',
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
      _this.props.dispatch({type: 'SET_WORK_ORDER_ID', payload: data.work_order.id})
      data.work_order.client = JSON.parse(data.work_order.client)
      data.work_order.receiving_employee = JSON.parse(data.work_order.receiving_employee)
      _this.props.dispatch({type: 'CLEAR_PAY', payload: ''})
      _this.props.dispatch({type: 'CLEAR_PAY_OBJECT', payload: ''})
      _this.props.dispatch({type: 'SET_WORK_ORDER_LOADED', payload: data})
      _this.props.dispatch({type: 'SET_WORK_ORDER_USER', payload: data.work_order.receiving_employee})
      _this.props.dispatch({type: 'PRESALE_LOADED', payload: ''})
      _this.props.dispatch({type: 'WORK_ORDER_LOADED', payload: ''})

      // LOAD CLIENT AND PRODUCTS FROM BACKEND
      getFullClientById(data.work_order.client.id, _this.props.dispatch)
      _this.loadCart(data)
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
    const cashAdvances = workOrder.cash_advances

    this.loadPartRequests(partRequest)
    this.loadUsedParts(usedObjects)
    this.loadLaborList(laborList)
    this.loadCashAdvances(cashAdvances)

  }

  loadPartRequestsDEPRECATED(partRequest) {
    const _this = this
    for (const item in partRequest) {

      const product = JSON.parse(partRequest[item].product)
      const setProductPromise = new Promise((resolve, reject) => {
        const kwargs = {
          lookUpField: 'code',
          url: '/api/productslist/',
          lookUpValue: product.code,
          lookUpName: 'código',
          modelName: 'Productos'
        }
        _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        setProduct(kwargs, resolve, reject)
      })
      setProductPromise.then((data) => {
        _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
        const product = data.results[0]
        console.log('PRODUCTTT', product)
        try {
          _this.props.dispatch(
            productSelected(
              product.code,
              parseFloat(partRequest[item].amount),
              product,
              _this.props.itemsInCart,
              _this.props.globalDiscount,
              _this.props.client,
              _this.props.warehouse_id)
          )
        } catch (err) {
          console.log(err)
        }
      }).catch((err) => {
        _this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
        console.log(err)
      })

    }
  }

  loadPartRequests(partRequest) {
    const _this = this
    for (const item in partRequest) {

      const product = JSON.parse(partRequest[item].product)
      const price1 = product.price1 ? product.price1 : product.price
      product.price1 = price1
      const lineData = {
        default_discount: '0',
        id: product.id,
        max_discount: '0',
        product: product,
        table_price: '0',
        target_price_list: 'price1'
      }
      try {
        _this.props.dispatch(
          productSelected(
            lineData,
            parseFloat(partRequest[item].amount),
            _this.props.itemsInCart,
            _this.props.client,
            _this.props.warehouse_id,
            false,
            _this.props.priceListSelected,
            _this.props.usePriceListAsDefault
          )
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
          const productCopy = {
            ...product
          }
          productCopy.price = laborList[item].amount / 1.13
          productCopy.price1 = laborList[item].amount / 1.13
          productCopy.description = laborList[item].description
          const lineData = {
            default_discount: '0',
            id: productCopy.id,
            max_discount: '0',
            product: productCopy,
            table_price: '0',
            target_price_list: 'price1'
          }
          _this.props.dispatch(
            productSelected(
              lineData,
              1,
              _this.props.itemsInCart,
              _this.props.client,
              _this.props.warehouse_id,
              false,
              this.props.priceListSelected,
              this.props.usePriceListAsDefault
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
          const productCopy = {
            ...product
          }
          productCopy.price = usedObjects[item].amount
          productCopy.price1 = usedObjects[item].amount
          productCopy.description = usedObjects[item].description
          const lineData = {
            default_discount: '0',
            id: productCopy.id,
            max_discount: '0',
            product: productCopy,
            table_price: '0',
            target_price_list: 'price1'
          }
          _this.props.dispatch(
            productSelected(
              lineData,
              1,
              _this.props.itemsInCart,
              _this.props.client,
              _this.props.warehouse_id,
              false,
              _this.props.priceListSelected,
              _this.props.usePriceListAsDefault
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

  loadCashAdvances(cashAdvances) {
    const _this = this
    for (const item in cashAdvances) {
      const advance = {'type': 'CSHA', 'amount': parseFloat(cashAdvances[item].amount), 'cashAdvanceId': cashAdvances[item].id}
      _this.props.dispatch({type: 'ADD_CASH_ADVANCE', payload: advance})
    }
  }

  reopenSingelWorkOrder(id, consecutive) {
    alertify.confirm(`RE-ABRIR ORDEN #${consecutive}`, `¿Desea reabrir la orden de taller #${consecutive}? Esta acción no se puede deshacer.`, function() {
      const reopenWOPromise = new Promise((resolve, reject) => {
        reopenWorkOrder(id, resolve, reject)
      })
      reopenWOPromise.then((data) => {
        alertify.alert('COMPLETADO', `Orden de trabajo re-abierta correctamente`, function() { location.reload() })
      }).catch(err => {
        console.log(err)
        alertify.alert('ERROR', `Hubo un error al intentar re-abrir la order ERROR: ${err}`)
      })
    }, function() {
      return true
    }).set('labels', {
      ok: 'Re-abrir',
      cancel: 'No'
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
        <td className='loadRow'><i onClick={this.reopenSingelWorkOrder.bind(this, workOrder.id, workOrder.consecutive)} className='fa fa fa-share' /></td>
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
                <td>Re-Abrir</td>
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
