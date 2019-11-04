export default function PrintElem(elem, stylesList) {
  const mywindow = window.open('', 'PRINT', 'height=400,width=600')
  // fire print on all data loaded
  console.log("Window open --> ", mywindow);
  mywindow.document.write('<html><head><title>' + document.title + '</title>')
  for (const style of stylesList) {
    mywindow.document.write(`<link href="${style}" rel="stylesheet">`)
  }

  // mywindow.document.write('<link href="/css/sales.css" rel="stylesheet">')
  // mywindow.document.write('<link href="/css/reports.css" rel="stylesheet">')
  mywindow.document.write('</head><body >')
  mywindow.document.write(document.getElementById(elem).innerHTML)
  mywindow.document.write('</body></html>')

  mywindow.document.close() // necessary for IE >= 10
  mywindow.focus() // necessary for IE >= 10*/

  mywindow.onload = () => {
    mywindow.print()
    let isFirefox = typeof InstallTrigger !== 'undefined';
    if(isFirefox){
      mywindow.close()
    }
  }

  mywindow.oncancel = () => {
    mywindow.close()
  }

  mywindow.onafterprint = () =>{
    mywindow.close()
  }

  return true
}
