export function checkCashAdvance(advance){
    
    let OK = true
    if(advance ===''){return OK}
    let money_advance_valid = parseFloat(advance) ? true : false
    
    if(money_advance_valid){
        return OK
    }else{
        return !OK
    }


}