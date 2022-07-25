import * as React from "react"
import DonationDetailPage from "../DonationCard/DonationCard"
import NotFound from "../NotFound/NotFound"
import BookingPage from "../BookingPage/BookingPage"
import apiClient from "../../services/apiClient"
import "./BrowseDetail.css"
import { useParams, Link } from "react-router-dom"

export default function BrowseDetail(props) {
    const [donation, setDonation] = React.useState({})
    const [notFound, setNotFound] = React.useState(false)
    const [error, setError] = React.useState(false)
    const [isBooking, setIsBooking] = React.useState(false) // booking state of donation
    const {donationId} = useParams()

    async function getDonation(){
        const {data, err} = await apiClient.fetchDonationById(donationId)
        if(err) setError(err)
        if(data){
          setDonation(data.donation)
        }

        }
      
    const makeBooking = async () => {
      console.log(2983,donation.id)
      const request = async () => {

         await apiClient.newBooking(donationId)

      }
      request()
    }
    
    const handleBookingStartClick = () => {
      setIsBooking(true)
    }
        
    React.useEffect(() => {
      getDonation()
    }, []);
    return (
        <div className="Browse-Detail">
          <BookingPage  isOpen={isBooking} toggleModal={() => setIsBooking(false)} donation={donation} user={props.user}/>

            {notFound ? (<NotFound/>) : <DonationDetailPage quantity={donation.quantity} id={donation.id} name={donation.name} imageUrl={donation.image_url} donation_desc={donation.donation_desc} location={donation.location}
            avgRating={donation.avgRating} category={donation.category} created_at={donation.created_at} email={donation.email} />}

            {/* <Link to={'/bookingpage/' + donation.id}>  */}
              {/* <button className="bookingButton" onClick={makeBooking} >Book</button> */}
              <button className="bookingButton" onClick={handleBookingStartClick} >Book</button>
           
        </div>
        )
    }