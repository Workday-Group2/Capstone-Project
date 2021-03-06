import React from 'react'
import "./Resource.css"

export default function Resource() {
  return (
    <div className="resource-container">
        <h3>Resources</h3>

        <div className="safety-wrapper">

        <div className="donators">
        <h2 className="donation-guidelines">Food Donation Guidelines</h2>
        <div className="donator-text">
        <p>The food must meet all quality and labeling standards imposed by federal, state and local laws and regulations.</p>
        <p>For food safety reasons we cannot accept cooked food/meals (food that has been heated/reheated), food that has previously been served to the public (hot bar items, food from a serving/buffet line, etc.) and prepared food that is not in individually sealed packaging. </p>
        </div>
          <div className="donator-image1">
              <img className="donator-image2" src="https://previews.123rf.com/images/nattyblissful/nattyblissful2001/nattyblissful200100080/136850365-woman-character-volunteer-hold-big-box-of-foods-food-donation-concept-flat-vector-cartoon-illustrati.jpg" alt=""/>
            </div>
        </div>


          <div className="safety">
            <h2 className="safety-title">Safety First</h2>
          <p className="emergency">EMERGENCY - call 911</p>
          <p>If you believe you or you're loved ones are in danger from a donator/receiver, please call 911 and report</p>
        </div>
        
        <div className="donation-safety">
          <h2>How to safely receive/donate a donation</h2>
            <p>It is best practice to meet in a public area to receive/donate a donation to mitigate any issues</p>
          </div>

        </div>

    </div>
  )
}

 