require("dotenv").config()
require("colors")


const APPLICATION_NAME = "Capstone"
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001
const SECRET_KEY = process.env.SECRET_KEY || "secret_dev"
const IS_TESTING = process.env.NODE_ENV === "test"
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000"
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
const EMAIL_SERVICE_ACTIVE = IS_TESTING ? false : process.env.EMAIL_SERVICE_STATUS === "active"
const EMAIL_FROM_ADDRESS = process.env.EMAIL_FROM_ADDRESS
function getDatabaseUri() {
    const dbUser = process.env.DATABASE_USER || "nasradin"
    const dbPass = process.env.DATABASE_PASS ? encodeURI(process.env.DATABASE_PASS) : "postgres"
    const dbHost = process.env.DATABASE_HOST || "localhost"
    const dbPort = process.env.DATABASE_PORT || 5432
    const dbProdName = process.env.DATABASE_NAME || "capstone"
    const dbTestName = process.env.DATABASE_TEST_NAME|| "capstone_test"
    const dbName = process.env.NODE_ENV === "test" ? dbTestName : dbProdName

    return process.env.DATABASE_URL || `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`
}

const BCRYPT_WORK_FACTOR = IS_TESTING ? 1 : 13

console.log(`${APPLICATION_NAME} Config`.green)
console.log("CLIENT_URL".blue, CLIENT_URL)
console.log("EMAIL_FROM_ADDRESS".blue, EMAIL_FROM_ADDRESS)
console.log("IS_TESTING:".blue, IS_TESTING)
console.log("SENDGRID_API_KEY".blue, SENDGRID_API_KEY)
console.log("EMAIL_SERVICE_ACTIVE".blue, EMAIL_SERVICE_ACTIVE)
console.log("PORT:".blue, PORT)
console.log("Database URI:".blue, getDatabaseUri())
console.log("---")

module.exports = {
  PORT,
  SECRET_KEY,
  IS_TESTING,
  BCRYPT_WORK_FACTOR,
  SENDGRID_API_KEY,
  EMAIL_SERVICE_ACTIVE,
  EMAIL_FROM_ADDRESS,
  APPLICATION_NAME,
  CLIENT_URL,
  getDatabaseUri,
}