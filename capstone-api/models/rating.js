const db = require("../db")
const { BadRequestError } = require("../utils/errors")

class Rating {
    static async createRatingForDonation({ rating, user, donationId }) {
        if (!Number(rating) || Number(rating) <= 0 || Number(rating) > 10) {
          throw new BadRequestError(`Invalid rating provided. Must be an integer between 1-10.`)
        }
        // check if user has already added a rating for this donation
        const existingRating = await Rating.fetchRatingForDonationByUser({ user, donationId })
        if (existingRating) {
          throw new BadRequestError(`Users aren't allowed to leave multiple ratings for a single donation.`)
        }
        // otherwise insert a new record into the database
        const results = await db.query(
          `
            INSERT INTO ratings (rating, user_id, donation_id)
            VALUES ($1, (SELECT id FROM users WHERE email = $2), $3)
            RETURNING rating, user_id, donation_id, created_at;
          `,
          [rating, user.email, donationId]
        )
    
        return results.rows[0]
      }
    
      // fetch a user's rating of a donation
      static async fetchRatingForDonationByUser({ user, donationId }) {
        const results = await db.query(
          `
            SELECT rating, user_id, donation_id, created_at
            FROM ratings
            WHERE user_id = (SELECT id FROM users WHERE email = $1) AND donation_id = $2
          `,
          [user.email, donationId]
        )
    
        return results.rows[0]
      }
}

module.exports = Rating