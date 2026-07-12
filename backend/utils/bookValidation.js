const LOKASI_RAK_REGEX = /^[A-Za-z]+[0-9]+$/
const ALLOWED_TEMA = ["Cerita & Dongeng", "Lainnya"]

function validateLokasiRak(value) {
  return LOKASI_RAK_REGEX.test(value)
}

function stripHTML(value) {
  return value.replace(/<[^>]*>/g, "")
}

function validateTemaBuku(value) {
  if (value === null || value === undefined || value === "") return { valid: true, sanitized: null }
  if (ALLOWED_TEMA.includes(value)) return { valid: true, sanitized: value }
  return { valid: false, message: "Tema buku tidak valid. Pilihan: Cerita & Dongeng atau Lainnya" }
}

function validateTingkatKelas(value) {
  if (value === null || value === undefined || value === "") return { valid: true, sanitized: null }
  const num = Number(value)
  if (!Number.isInteger(num) || num < 1 || num > 6) return { valid: false, message: "Tingkat kelas harus berupa angka 1-6" }
  return { valid: true, sanitized: num }
}

function validateStok(value) {
  const num = Number(value)
  if (!Number.isInteger(num) || num < 0) return { valid: false }
  return { valid: true, sanitized: num }
}

function validateTahunTerbit(value) {
  const num = Number(value)
  if (!Number.isInteger(num) || num < 1900) return { valid: false }
  return { valid: true, sanitized: num }
}

module.exports = {
  validateLokasiRak,
  stripHTML,
  validateTemaBuku,
  validateTingkatKelas,
  validateStok,
  validateTahunTerbit,
  ALLOWED_TEMA,
  LOKASI_RAK_REGEX
}
