import React, { useEffect, useState } from 'react';
import { getAllProducts, ProductDto } from '../api';

const PopularProducts: React.FC = () => {
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const allProducts = await getAllProducts();
                const shuffledProducts = allProducts.sort(() => 0.5 - Math.random());
                setProducts(shuffledProducts.slice(0, 5));
            } catch (error) {
                console.error('Ошибка при загрузке списка продуктов:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts().catch(error => {
            console.error('Ошибка при выполнении fetchProducts:', error);
        });
    }, []);

    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="popular-products">
            <h2>Популярное</h2>
            <div className="product-list">
                {products.map(product => (
                    <div key={product.id} className="product-item">
                        <img src={product.thumbUrl} alt={product.title} className="product-image" />
                        <h3>{product.title}</h3>
                        <p>{product.price}$ {product.currency}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PopularProducts;
