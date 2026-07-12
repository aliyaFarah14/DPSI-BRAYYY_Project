const TZ = "Asia/Jakarta"

function todayWIB() {
  return new Date().toLocaleDateString("en-CA", { timeZone: TZ })
}

function dateFromWIB(dateStr) {
  return new Date(dateStr + "T00:00:00+07:00")
}

module.exports = { todayWIB, dateFromWIB }
