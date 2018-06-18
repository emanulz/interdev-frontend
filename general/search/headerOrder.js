export function getHeaderOrder(model) {
  const clientHeader = [
    {
      field: 'code',
      text: 'Código'
    }, {
      field: 'name',
      text: 'Nombre'
    }, {
      field: 'last_name',
      text: 'Apellido'
    }, {
      field: 'id_num',
      text: 'Identificación'
    }, {
      field: 'has_credit',
      text: 'Tiene Crédito',
      type: 'bool'
    }, {
      field: 'credit_limit',
      text: 'Límite de crédito',
      type: 'price'
    }, {
      field: 'credit_days',
      text: 'Días de crédito'
    }
  ]

  const productHeader = [
    {
      field: 'code',
      text: 'Código',
      width: '150px'
    }, {
      field: 'description',
      text: 'Descripción'
    }, {
      field: 'supplier_code',
      text: 'Cod Prov'
    }, {
      field: 'sell_price',
      text: 'Precio IVI',
      type: 'price'
    }
  ]
  // Return the header switching model cases
  switch (model) {

    case 'product': {
      return productHeader
    }
    case 'client': {
      return clientHeader
    }
  }

}