import React, { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import img1 from "../../images/closet-and-logo-2.png";
import img2 from "../../images/bedford-ave.jpg";

export default function Slideshow() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      <Carousel.Item>
        <img className="d-block w-100" src={img1} alt="First slide" />
      </Carousel.Item>

      <Carousel.Item>
        <img className="d-block w-100" src={img2} alt="Second slide" />
      </Carousel.Item>
    </Carousel>
  );
}
