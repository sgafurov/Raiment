import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Carousel from "react-bootstrap/Carousel";
import Dropdown from "react-bootstrap/Dropdown";
import { ref, onValue } from "firebase/database";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import { storage } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../store/userSlice";
import { useParams } from "react-router-dom";

export default function SelectedProduct() {
  // merge AllProducts and Products to be one component
  // listing id will be used as the params for this compoennt
  return <div></div>;
}
