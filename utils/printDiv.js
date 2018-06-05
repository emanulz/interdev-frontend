export default function PrintElem(elem, styles_list) {
  const mywindow = window.open('', 'PRINT', 'height=400,width=600')
  //fire print on all data loaded
  mywindow.onload = ()=>{
    mywindow.print()
    mywindow.close()
  }
  mywindow.document.write('<html><head><title>' + document.title + '</title>')
  for (let style of styles_list){
    mywindow.document.write(`<link href="${style}" rel="stylesheet">`)
  }
  
  //mywindow.document.write('<link href="/css/sales.css" rel="stylesheet">')
  //mywindow.document.write('<link href="/css/reports.css" rel="stylesheet">')
  mywindow.document.write('</head><body >')
  mywindow.document.write(document.getElementById(elem).innerHTML)
  mywindow.document.write('</body></html>')
  
  mywindow.document.close() // necessary for IE >= 10
  mywindow.focus() // necessary for IE >= 10*/


  return true
}
