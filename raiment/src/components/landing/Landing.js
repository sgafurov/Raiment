import React from "react";
import Slideshow from "./Slideshow";
import "../../styles/landing.css";
import sneakersImage from "../../images/person-wearing-sneakers.jpg"
import sellerImage from "../../images/seller-sitting-down.jpg"
import bannerImage from "../../images/fall-essentials-copy.jpg";

// import firebase from "firebase/compat/app";
// import "firebase/analytics";
// const analytics = firebase.analytics;

import { getAnalytics, logEvent } from "firebase/analytics";

export default function Landing() {
  // analytics().setCurrentScreen(window.location.pathname); // sets `screen_name` parameter
  // analytics().logEvent("screen_view");
  const analytics = getAnalytics();
  logEvent(analytics, "screen_view", {
  });
  return (
    <div className="landingContainer">
      <div className="bannerContainer">
        <img className="bannerImage" src={bannerImage}></img>
        {/* <Slideshow /> */}
      </div>

      <div className="narrativeDiv">
        <section>
          <div className="narrativeCard">
            <div className="narrativeImage">
              <img src={sneakersImage}></img>
            </div>
            <div className="narrativeText">
              <h2>Discover your unique look</h2>
              <p>Explore top-notch brands you're familiar with, as well as emerging independent labels and the creative minds behind them. No matter your taste, locate the perfect item and seller on Raiment.</p>
              <a href="/signup"><span type="button" class="sc-pqjAT sc-csmWhv mRPEM dqsIjj">Shop now</span></a>
            </div>
          </div>

          <div className="narrativeCard">
            <div className="narrativeText">
              <h2>Pave your path</h2>
              <p>Whether you're looking to sell a few items or establish a thriving business, we're here to offer expert advice to guide you on your journey. Getting started is easy.</p>
              <a href="/signup"><span type="button" class="sc-pqjAT sc-csmWhv mRPEM dqsIjj">Sell now</span></a>
            </div>
            <div className="narrativeImage">
              <img src={sellerImage}></img>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}
