export function getElementStatus(document) {
  let text = 'PROCESANDO'
  let className = 'processing'
  try {
    const splittedHistory = document.process_history.split('_')
    const accepted = splittedHistory.find((el) => { return el == '4' })
    const rejected = splittedHistory.find((el) => {
      const num = parseInt(el)
      return !accepted && num >= 5
    })
    if (accepted) {
      text = 'ACEPTADO'
      className = 'accepted'
    }
    if (rejected) {
      text = 'RECHAZADO'
      className = 'rejected'
    }
  } catch (err) {}

  return { text: text, className: className }
}
