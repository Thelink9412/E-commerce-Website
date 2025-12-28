
function ProductCard({name, price, url, stock}) {

    return (<div className='product-card'>
        <h2>{name}</h2>
        <span className='product-url'>{url}</span>
        <span className='product-price'>Price: ${price}</span>
        <span className='product-quantity'>Quantity: {stock}</span>
        <button className='add-product-to-cart-btn'>Add to cart</button>
    </div>)
}

export default ProductCard