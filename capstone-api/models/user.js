const { UnauthorizedError, BadRequestError } = require("../utils/errors")
const db = require("../db")
const bcrypt = require("bcrypt")
const { BCRYPT_WORK_FACTOR } = require("../config")
const { generatePasswordResetToken } = require("../utils/tokens")

class User {

    static async makePublicUser(user){
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            create_at: user.create_at
        }
    }

    static async login (credentials) {
        const requireFields = ["email", "password"]
        requireFields.forEach((field) => {
            if (!credentials?.hasOwnProperty(field)) {
                throw new BadRequestError(`Missing ${field} in request body`)
            }
        }) 

        const user = await User.fetchUserByEmail(credentials.email)
        if (user) {
            const isValid = await bcrypt.compare(credentials.password, user.password)
            if (isValid) {
                return User.makePublicUser(user)
            }
        }

        throw new UnauthorizedError("Invalid email/password")
    }

    static async register (credentials) {
        const requireFields = ["email", "userName", "firstName", "lastName", "password"]
        requireFields.forEach((field) => {
            if (!credentials?.hasOwnProperty(field)) {
                throw new BadRequestError(`Missing ${field} in request body`)
            }
        }) 

        const existingUser = await User.fetchUserByEmail(credentials.email)
        if (existingUser) {
          throw new BadRequestError(`A user already exists with email: ${credentials.email}`)
        }
    
        
        const hashedPassword = await bcrypt.hash(credentials.password, BCRYPT_WORK_FACTOR)
        const lowercasedEmail = credentials.email.toLowerCase()

        const result = await db.query(`
            INSERT INTO users (
                email,
                username,               
                first_name,
                last_name,
                password

                
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, email, username, first_name, last_name, updated_at, created_at;
        `, [lowercasedEmail, credentials.userName, credentials.firstName, credentials.lastName, hashedPassword])

        const user = result.rows[0]

        return User.makePublicUser(user)
    }

    static async fetchUserByEmail(email) {
        if (!email) {  
            throw new BadRequestError("No email provided")
        }

        const query =  `SELECT * FROM users WHERE email = $1`

        

        const result = await db.query(query, [email.toLowerCase()])

        const user = result.rows[0]
        

        return user

        

    }

    static async savePasswordResetToken(email, resetToken){
        
        const result = await db.query(
            `
            UPDATE users
            SET pw_reset_token  =$1,
                pw_reset_token_exp  =$2
            WHERE email = $3
            RETURNING id,email,username,created_at;
            `,
            [resetToken.token, resetToken.expiresAt, email]
        )
        const user = result.rows[0]
        if (user) return User.makePublicUser(user)
    }

    static async resetPassword(token,newPassword){
        const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_WORK_FACTOR)
        
        const result = await db.query(
            `
            UPDATE users
            SET password =  $1,
                pw_reset_token = NULL,
                pw_reset_token_exp = NULL
            WHERE pw_reset_token = $2
            AND pw_reset_token_exp > NOW()
            RETURNING id, email, username, created_at;
            `,
            [hashedPassword, token]
        )
        const user = result.rows[0]
        if (user) return User.makePublicUser(user)
        throw new BadRequestError("That token is either expires or invalid")
    }
    
}

module.exports = User