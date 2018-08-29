import React from 'react'
import {connect} from 'react-redux'
import {checkProductData} from '../../actions'
import {updateItem, getItemDoubleDispatch, deleteItem} from '../../../../../utils/api'
import { withRouter } from 'react-router-dom'
import alertify from 'alertifyjs'

@connect((store) => {
  return {
    product: store.products.productActive,
    products: store.products.products,
    productOld: store.products.productActiveOld,
    user: store.user.user,
    permissions: store.products.permissions,
    file: store.products.file,
  }
})

class UpdateButtons extends React.Component {

  // BUTTONS
  updateBtn(redirect) {
    const user = this.props.user
    const product = this.props.product
    const productOld = this.props.productOld
    const products = this.props.products
    const fieldsOk = checkProductData(product, products)

    if (fieldsOk) {
      const kwargs = {
        url: `/api/products/${product.id}/`,
        baseUrl: `/api/products/`,
        item: product,
        logCode: 'PRODUCT_UPDATE',
        logDescription: 'Actualización Producto',
        logModel: 'PRODUCT',
        user: user,
        itemOld: productOld,
        sucessMessage: 'Producto actualizado Correctamente.',
        errorMessage: 'Hubo un error al actualizar el Producto, intente de nuevo.',
        dispatchType: 'CLEAR_PRODUCT'
      }

      if (redirect) {
        kwargs.redirectUrl = '/admin/products'
        kwargs.history = this.props.history
      }

      const _this = this
      const updatePromise = new Promise((resolve, reject) => {
        _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        const formData = new FormData()
        formData.append('file', this.props.file)
        formData.append('prod', JSON.stringify(kwargs.item))
        kwargs.item = formData
        _this.props.dispatch(updateItem(kwargs))
        resolve()
      })

      updatePromise.then(() => {
        const productKwargs = {
          url: '/api/productslist',
          successType: 'FETCH_PRODUCT_FULFILLED',
          successType2: 'CLEAR_PRODUCT',
          errorType: 'FETCH_PRODUCTS_REJECTED'
        }
        _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        _this.props.dispatch(getItemDoubleDispatch(productKwargs))
      }).catch((err) => {
        console.log(err)
      })

    }
  }

  deleteBtn() {

    const user = this.props.user
    const product = this.props.product
    const productOld = {noPrevious: 'No previous Item needed'}

    const _this = this
    const kwargs = {
      url: `/api/products/${product.id}/`,
      item: product,
      logCode: 'PRODUCT_DELETE',
      logDescription: 'Eliminación de Producto',
      logModel: 'PRODUCT',
      user: user,
      itemOld: productOld,
      modelName: 'Producto',
      dispatchType: 'CLEAR_PRODUCT',
      redirectUrl: '/admin/products',
      history: this.props.history
    }
    // ALERTIFY CONFIRM
    alertify.confirm('Eliminar', `Desea Eliminar el Producto ${product.code} - ${product.description}?
                                  Esta acción no se puede deshacer.`,
    function() {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      _this.props.dispatch(deleteItem(kwargs))
    }, function() {
      return true
    }).set('labels', {
      ok: 'Si',
      cancel: 'No'
    })
  }

  render() {
    // ********************************************************************
    // BUTTONS
    // ********************************************************************

    // IF HAVE PERISSION SHOW DELETE BTN
    const buttons = this.props.permissions.delete
      ? <div className='col-xs-12 row form-buttons-container-row'>
        <div className='col-xs-12 col-sm-4'>
          <button onClick={this.updateBtn.bind(this, true)}
            className='form-buttons-container-save form-control btn-success'>
            Actualizar
          </button>
        </div>

        <div className='col-xs-12 col-sm-4'>
          <button onClick={this.updateBtn.bind(this, false)}
            className='form-buttons-container-saveContinue form-control btn-primary'>
            Actualizar y Seguir
          </button>
        </div>

        <div className='col-xs-12 col-sm-4'>
          <button onClick={this.deleteBtn.bind(this)} className='form-buttons-container-cancel form-control btn-danger'>
            Eliminar
          </button>
        </div>
      </div>

      // IF DO NOT HAVE PERMISSION DONT SHOW DELETE BTN
      : <div className='col-xs-12 row form-buttons-container-row'>
        <div className='col-xs-12 col-sm-4'>
          <button onClick={this.updateBtn.bind(this, true)}
            className='form-buttons-container-save form-control btn-success'>
            Actualizar
          </button>
        </div>

        <div className='col-xs-12 col-sm-4'>
          <button onClick={this.updateBtn.bind(this, false)}
            className='form-buttons-container-saveContinue form-control btn-primary'>
            Actualizar y Seguir
          </button>
        </div>

      </div>

    // ********************************************************************
    // RETURN BLOCK
    // ********************************************************************
    return <div className='form-buttons-container'>
      {buttons}
    </div>

  }
}

// EXPORT THE CLASS WITH ROUTER
export default withRouter(UpdateButtons)
