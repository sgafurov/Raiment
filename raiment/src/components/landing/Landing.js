import React from "react";
import Slideshow from "./Slideshow";
import "../../styles/landing.css";

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
    <div>
      <Slideshow />
    </div>
  );
}
