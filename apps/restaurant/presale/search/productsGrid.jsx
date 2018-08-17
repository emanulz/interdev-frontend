import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    products: store.searchRestaurant.products,
    departmentActive: store.searchRestaurant.departmentActive
  }
})
export default class ProductsGrid extends React.Component {

  productDoubleClick(id) {
    console.log('doubleClick')
    console.log(this.props)
    this.props.onDoubleClick(id, this.props.dispatch)
  }

  render() {
    let filteredProducts = this.props.products.filter(product => {
      return product.department == this.props.departmentActive
    })
    if (this.props.departmentActive == 'noDepartment') {
      filteredProducts = this.props.products.filter(product => {
        return !product.department
      })
    }
    const productList = filteredProducts.map(product => {
      const imageUrl = product.image_name !== '' ? `/media/productImages/${product.image_name}` : `/media/default/noimage.png`
      return <div key={product.id} className='restaurant-search-products-single' onClick={this.productDoubleClick.bind(this, product.id)}>
        <div className='restaurant-search-products-single-image'>
          <img src={imageUrl} onError={(e) => { e.target.src = '/media/default/noimage.png' }} />
        </div>
        <div className='restaurant-search-products-single-description'>
          {product.description}
        </div>
        <div className='restaurant-search-products-single-price'>
          ₡ {parseFloat(product.sell_price).toFixed(2)}
        </div>
      </div>
    })

    return <div className='restaurant-search-products'>
      <div className='restaurant-search-products-container'>
        {productList}
      </div>
    </div>

  }

}
