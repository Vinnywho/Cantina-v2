import './ProductCard.css';

const ProductCard = ({ image, title, price, description }) => {
  return (
    <div className="product-card">
      <div className="product-card-content">
        <div className="product-image-container">
          <img 
            src={image} 
            alt={title}
            className="product-image"
          />
        </div>
        
        <div className="product-details">
          <h3 className="product-title">
            {title}
          </h3>
          <p className="product-price">
            {price}
          </p>
          <p className="product-description">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;