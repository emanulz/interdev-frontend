export function getHeaderOrder(model, salesWarehouse) {

  let get_existences_closure = (item)=>{
      function getExistences(item){
      if(salesWarehouse === undefined || salesWarehouse ===''){
        return "0"
      }
      const parsed_inv = JSON.parse(item)
      return parsed_inv[salesWarehouse] === undefined?0:parsed_inv[salesWarehouse]
    }

    return getExistences(item)
  }

  item=>{return JSON.parse(item)}

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
      type: 'function_process',
      field: 'inventory_existent',
      text: 'Existencias',
      worker_method: get_existences_closure
    }, {
      field: 'supplier_code',
      text: 'Cod Prov'
    }, {
      field: 'sell_price',
      text: 'Precio IVI',
      type: 'price'
    }
  ]

  const supplierHeader = [
    {
      field: 'code',
      text: 'Código',
      width: '150px',
    }, {
      field: 'name',
      text: 'Nombre',
    }, {
      field: 'phone_number',
      text: 'Tel.',
    }, {
      field: 'agent_name',
      text: 'Nombre Agente'
    }, {
      field: 'agent_last_name',
      text: 'Apellido Agente'
    }, {
      field: 'agent_phone_number',
      text: 'Tel. Agente'
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
    case 'supplier': {
      return supplierHeader
    }
  }

}
