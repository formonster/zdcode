export const getMonthDays = (dateTime?: number | string) => {
  var date = new Date(dateTime as any);  
  date.setMonth(date.getMonth() + 1)
  date.setDate(0)
  return date.getDate()
}