require("dotenv").config()

module.exports = {
  DENDA_PER_HARI: parseInt(process.env.DENDA_PER_HARI, 10) || 500,
  DENDA_RUSAK_RINGAN: parseInt(process.env.DENDA_RUSAK_RINGAN, 10) || 2000,
  DENDA_RUSAK_BERAT: parseInt(process.env.DENDA_RUSAK_BERAT, 10) || 5000,
}
