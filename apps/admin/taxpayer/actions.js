
export function validateTaxPayerCreation(kwargs){
    //validate 
    let errors = []
    if(kwargs.legal_name == '' || kwargs.legal_name == undefined){
        errors.push("El nombre legal de la empresa debe definirise. ")
    }
    //the commercial name is not mandatory if none is registered
    if(kwargs.commercial_name == '' || kwargs.commercial_name == undefined){
        alertify.alert('Advertencia', `Si el negocio cuenta con un nombre comercial este debe indicarse. `) 
    }
    //an email must be registered to receive system notifications
    if(kwargs.email == '' || kwargs.email == undefined){
        errors.push("Se debe asociar un correo electrónico. ")
    }
    //check that the ID type was properly setup
    if(kwargs.id_type == '' || kwargs.id_type == undefined){
        errors.push("Se debe seleccionar el tipo de identificación. ")
    }
    //check that the id was set
    //TODO: write a proper validator for id type
    if(kwargs.id_number == '' || kwargs.id_number == undefined){
        errors.push('Se debe ingresar el número de identificación. ')
    }
    if(kwargs.provincia == 'Provincia'){
        errors.push("Se debe seleccionar la provincia. ")
    }
    if(kwargs.canton == 'Canton'){
        errors.push("Se debe seleccionar el cantón. ")
    }
    if(kwargs.distrito == 'Distrito'){
        errors.push("Se debe seleccionar el distrito. ")
    }
    if(kwargs.phone_number ==''){
        errors.push("Se debe ingresar un número de teléfono válido.")
    }
    
    if(errors.length>0){
        const error_message = errors.join('\n')
        alertify.alert("Error en datos Contribuyente", error_message)
        return false
    }else{
        return true
    }
}

export function getCantonsSelect(province, cantons){

    const filteredCantons = cantons.filter(el => {
        return el.province_code == province
        })
            // map the filtered cantons and return items to render in Select2
    const cantonsData = filteredCantons.map(canton => {
        return {text: `${canton.code} - ${canton.name}`, id: canton.code}
    })
    return cantonsData
}

export function getDistrictsSelect(canton, province, districts){

    const districtsData = districts.filter(el => {
        return el.province_code == province && el.canton_code == canton
    }).map(district => {
        return {text: `${district.code} - ${district.name}`, id: district.code}
    })

    return districtsData
}

export function getTownsSelect(district, canton, province, towns){


    const townsData = towns.filter(el => {
        return el.province_code == province && el.canton_code == canton && el.district_code == district
    }).map(town => {
        return {text: `${town.code} - ${town.name}`, id: town.code}
    })

    return townsData
}
