import axios from 'axios'
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'


export function importTestProducts(start_code, end_code){
    let start = start_code
    let part_number = 1
    let internal_barcode = 800000
    let barcode = 1500000
    let brand_code = 1800000
    let supplier_code = 2000000
    let cost = 9999
    let utility = 35.585
    let utility2 = 4.77575
    let utility3 = 65.98545
    let price = 11111
    let price2 = 22222
    let price3 = 33333
    let sell_price = 4444
    let sell_price2 = 5555
    let sell_price3 = 6666

    let prodData = {
        code:'00000',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        unit: 'unit',
        fractioned:true,
        department:'e1671c720a3745639bbad16b6f230398',
        subdepartment:'e1671c72123745639bbad16b6f230398',
        barcode: barcode,
        internal_barcode: internal_barcode,
        supplier_code: supplier_code,
        model:'model',
        part_number: part_number,
        inventory_enabled: true,
        inventory_minimum:0,
        inventory_maximum: 500,
        inventory_negative: true,
        cost: cost,
        cost_based: false,
        utility: utility,
        utility2: utility2,
        utility3: utility3,
        price: price,
        price2: price2,
        price3: price3,
        sell_price: sell_price,
        sell_price2: sell_price2,
        sell_price3: sell_price3,
        ask_price: false,
        use_taxes: true,
        taxes: 13.0,
        tax_code: '00',
        use_taxes2: false,
        taxes2: 11.5,
        tax_code2: '00',
        use_taxes3: false,
        taxes3: 12.5,
        tax_code3: '00',
        pred_discount: 15,
        max_sale_discount: 20,
        on_sale: false,
        is_active: true,
        consignement: false,
        generic: false,
        //image: `media/products/${data.code}.jpg`,
        observations: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        short_description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        brand_code: brand_code
    }
    const all_promises = []
    while(start<end_code){
        all_promises.push(
            new Promise((resolve, reject)=>{
                axios({
                    method:'post',
                    url:'/api/products/',
                    data: prodData
                }).then(response=>{
                    resolve(response.data)
                }).catch(err=>{
                    err.is_err= true
                    console.log(err)
                    resolve(err) //Rather deal with the failures than abort the saving process
                })
            })
        )

        start +=1
        part_number += 1
        internal_barcode += 1
        supplier_code +=1
        barcode += 1 
        brand_code += 1
        cost += 1
        price += 1
        price2 += 1
        price3 += 1
        sell_price += 1
        sell_price2 += 1
        sell_price3 += 1
        prodData = JSON.parse(JSON.stringify(prodData))
        prodData.code = start
        prodData.part_number = part_number
        prodData.internal_barcode = internal_barcode
        prodData.supplier_code = supplier_code
        prodData.barcode = barcode
        prodData.brand_code = brand_code
        prodData.cost = cost
        prodData.price = price
        prodData.price2 = price2
        prodData.price3 = price3

    }

    return all_promises

}

export function saveImportedProduct(data){

    const prodData = {
        code:data.code,
        description: data.description,
        unit: data.unit,
        fractioned:true,
        department:'',
        subdepartment:'',
        barcode:'',
        internal_barcode: data.code,
        supplier_code: data.supplier_code,
        model:'',
        part_number: '',
        inventory_enabled: true,
        inventory_minimum:0,
        inventory_maximum: 500,
        inventory_negative: true,
        cost: data.cost,
        cost_based: false,
        utility: data.utility,
        utility2: 0,
        utility3: 0,
        price: data.price,
        price2: 0,
        price3: 0,
        sell_price: data.price_ivi,
        sell_price2: 0,
        sell_price3: 0,
        ask_price: false,
        use_taxes: true,
        taxes: 13.0,
        tax_code: '00',
        use_taxes2: false,
        taxes2: 0,
        tax_code2: '00',
        use_taxes3: false,
        taxes3: 0,
        tax_code3: '00',
        pred_discount: 0,
        max_sale_discount: 20,
        on_sale: false,
        is_active: data.is_active,
        consignement: false,
        generic: false,
        //image: `media/products/${data.code}.jpg`,
        observations: '',
        short_description: data.short_description,
        brand_code:''
    }

    return new Promise((resolve, reject)=>{
        axios({
            method:'post',
            url:'/api/products/',
            data: prodData
        }).then(response=>{
            resolve(response.data)
        }).catch(err=>{
            err.is_err= true
            console.log(err)
            reject(err) //Rather deal with the failures than abort the saving process
        })
    })
}

export function joinINV_CAT(cat_data, inv_data){
    const patched_data = cat_data.map(item=>{
        let index_inv = inv_data.findIndex(a=>a.code === item.code)
        return index_inv==-1? parseElement(item) :adjustPrice(item, inv_data[index_inv])
    })

    return patched_data
}

function parseElement(item){
    return {
        code: item.code,
        description: item.description,
        short_description: item.short_description,
        price_ivi: parseFloat(item.price_ivi),
        supplier_code: item.supplier_code,
        unit: item.unit,
        cost: 0,
        utility:40,
        price: 0,
        is_active: false,

    }
}

function adjustPrice(cat_ele, inv_data){
    
    const cost = parseFloat(inv_data.cost)
    const final_price = parseFloat(cat_ele.price_ivi)
    const price = final_price/1.13
    const utility = ((price / cost) - 1)*100

    return {
        code: cat_ele.code,
        description: cat_ele.description,
        short_description: cat_ele.short_description,
        price_ivi: final_price,
        price: price,
        supplier_code: cat_ele.supplier_code,
        unit: cat_ele.unit,
        cost:cost,
        utility:utility,
        is_active: true,

    }
}