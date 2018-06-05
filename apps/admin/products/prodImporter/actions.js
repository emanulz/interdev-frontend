import axios from 'axios'
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'


export function generateProductInvMovs(movs){
    console.log("Creating inventory movements")
    const move_data = {
        user: '{"password":"pbkdf2_sha256$100000$0PISyOHVjG69$ertfTRsTOxjgBbDQrv+aDVvebJnnQ/hKahjEryPmUf0=","last_login":"2018-05-26T03:46:04.578Z","is_superuser":true,"username":"victor","first_name":"Victor","last_name":"Mora","email":"victor@interdevcr.com","is_staff":true,"is_active":true,"date_joined":"2018-05-05T19:57:56.690Z","groups":[],"user_permissions":[]}',
        movement_type: 'OUTPUT',
        amount: 0,
        product_id: '5833e945-c062-4489-8d7d-4b4fef4821a5',
        product: '{"id":"5833e945-c062-4489-8d7d-4b4fef4821a5","code":"01","description":"Arroz","unit":"uni","fractioned":false,"department":"0000000000","subdepartment":"0000000000","barcode":"01","internal_barcode":"","supplier_code":"","model":"","part_number":"","brand_code":"","inventory_enabled":true,"inventory_minimum":0,"inventory_maximum":0,"inventory_negative":true,"cost":450,"utility":20,"utility2":0,"utility3":0,"price":540,"price2":0,"price3":0,"ask_price":false,"use_taxes":true,"taxes":13,"use_taxes2":false,"taxes2":0,"pred_discount":0,"is_active":true,"consignment":false,"generic":false,"image":null,"observations":"","created":"2018-05-14T17:59:50.148449-06:00","updated":"2018-05-14T17:59:50.148449-06:00","max_sale_discount":0,"on_sale":false,"cost_based":true,"sell_price":610.2,"sell_price2":0,"sell_price3":0,"inventory":337,"inventory_by_warehouse":"{\"9d85cecc-feb1-4710-9a19-0a187580e15e\": 353.0, \"4a25f16d-0f1a-4e9e-95b0-a464c085a20c\": -16.0}"}',
        warehouse_id: '9d85ceccfeb147109a190a187580e15e',
        warehouse: '{"id":"4a25f16d-0f1a-4e9e-95b0-a464c085a20c","code":"02","name":"Taller","location":"","description":"","created":"2018-05-21T08:30:54.058706-06:00","updated":"2018-05-21T08:30:54.058763-06:00"}',
        description: 'test movement',
        is_null: false,
        id_generator: 'id_generator',
    }
    saveInvMoveBatch(0, 10, movs, move_data)
}

function  saveInvMoveBatch(start, temp_end, total, data){
    let mov_data = JSON.parse(JSON.stringify(data))
    let current = start
    if(current==0){
        mov_data.amount = total
        mov_data.movement_type = 'INPUT'
    }
    let promise_set = []
    while(current <= temp_end){
        promise_set.push(
            new Promise((resolve, reject)=>{
                axios({
                    method:'post',
                    url: '/api/inventorymovements/',
                    data: mov_data
                }).then(reponse=>{
                    resolve()
                }).catch(err=>{
                    console.log(err)
                    reject(err)
                })
            })
        )
        current+=1
        if(current>0){
            mov_data = JSON.parse(JSON.stringify(data))
            mov_data.amount = 1
            mov_data.movement_type = 'OUTPUT'
        }
    }
    //console.log('Save batch')
    Promise.all(promise_set).then(()=>{
        console.log('Batch saved')
        if(current<total){
            let next_end = current+10<total?current+10:total
            saveInvMoveBatch(current, next_end, total, mov_data)
        }else{
            console.log('All solved')
            return
        }
    })


}

export function importFakeSuppliers(start_code, end_code){
    console.log(`Import supplier data -> start code: ${start_code}, end code: ${end_code}`)

    let name = '0-Proveedor'
    let id_type = 'JUR'
    let id_num = 113789845
    let address = 'Dirección del proveedor'
    let phone_number = '506-2459-87965'
    let cell_number = '506-9865-4512'
    let email = 'example_email@example.com'
    let agent_name = 'John'
    let agent_lastname = 'Doe4'
    let agent_phone_number = '506-7895-6512'
    let agent_email = 'another_example@example.com'
    let bank_accounts = 'Bank accountes 45212457878-7845541212-7845451'
    let sinpe_accounts = 'SINPE-78452154578454323565'
    let observations = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit'

    let supData = {
        code :  start_code,
        name : `${start_code}-Proveedor`,
        id_type : 'JUR',
        id_num : 113789845,
        address : 'Dirección del proveedor',
        phone_number : '506-2459-87965',
        cellphone_number : '506-9865-4512',
        email : 'example_email@example.com',
        agent_name : 'John',
        agent_last_name : 'Doe4',
        agent_phone_number : '506-7895-6512',
        agent_email : 'another_example@example.com',
        bank_accounts : 'Bank accountes 45212457878-7845541212-7845451',
        sinpe_accounts : 'SINPE-78452154578454323565',
        observations : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit',      
    }
    const promise_step = 5

    saveSupBatch(start_code, end_code, promise_step, supData)
}

function saveSupBatch(start, end, step, supData){
    let code = start
    let promise_set = []
    let temp_end =  start+step<end?start+step:end
    while(code <= temp_end){
        promise_set.push(
            new Promise((resolve, reject)=>{
                axios({
                    method: 'post',
                    url: '/api/suppliers/',
                    data: supData
                }).then(response=>{
                    resolve(response.data)
                }).catch(err=>{
                    console.log(err.response)
                    reject(err)
                })
            })
        )     //end of push
        console.log('Promise built ' + code)
        code+=1
        //update data for next promise
        supData = JSON.parse(JSON.stringify(supData))
        supData.code = supData.code + 1
        supData.id_num =  supData.id_num + 1
        supData.name = `${supData.code}-Proveedor`

    }
    Promise.all(promise_set).then(()=>{
        if(start<end){
            let next_start = code<=end?code + step:end
            console.log('Set resolved ')
            return saveSupBatch(next_start, end, step, supData)
        }else{
            console.log('All solved')
            return
        }
    })
}

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