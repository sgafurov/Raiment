import React from "react";
import Dropdown from "react-bootstrap/Dropdown";

const FilterButtons = ({
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  selectedCondition,
  setSelectedCondition,
  selectedSize,
  setSelectedSize,
}) => {
  return (
    <nav className="filters-dropdown-container">
      <div className="filter-container">
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            {selectedCategory}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setSelectedCategory("Category")}>
              --Category--
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedCategory("Menswear")}>
              Menswear
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedCategory("Womenswear")}>
              Womenswear
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedCategory("Jewelry")}>
              Jewelry
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="filter-container">
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            {selectedBrand}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setSelectedBrand("Brand")}>
              --Brand--
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedBrand("Acne")}>
              Acne
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedBrand("Adidas")}>
              Adidas
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedBrand("Nike")}>
              Nike
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="filter-container">
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            {selectedCondition}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setSelectedCondition("Condition")}>
              --Condition--
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedCondition("Brand new")}>
              Brand new
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedCondition("Like new")}>
              Like new
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedCondition("Used - Excellent")}>
              Used - Excellent
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedCondition("Used - Good")}>
              Used - Good
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedCondition("Used - Fair")}>
              Used - Fair
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="filter-container">
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            {selectedSize}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setSelectedSize("Size")}>
              --Size--
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedSize("XS")}>
              XS
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedSize("S")}>
              S
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedSize("M")}>
              M
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedSize("L")}>
              L
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedSize("XL")}>
              XL
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </nav>
  );
};

export default FilterButtons;
