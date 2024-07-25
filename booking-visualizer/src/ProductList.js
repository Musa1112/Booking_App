// src/ProductList.js
import React, { useEffect, useState } from 'react';

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('/products.json')
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    return (
        <div>
            <h1>Product List</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {products.map((product, index) => (
                    <div key={index} style={{ border: '1px solid #ccc', padding: '16px', margin: '16px', width: '300px' }}>
                        <img src={product.imageLink} alt={product.title} style={{ width: '100%' }} />
                        <h2>{product.title}</h2>
                        <p>{product.description}</p>
                        <p><strong>reviews:</strong> {product.reviews}</p>
                        <p><strong>Location:</strong> {product.location}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
