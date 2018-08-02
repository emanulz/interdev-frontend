    
    
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
