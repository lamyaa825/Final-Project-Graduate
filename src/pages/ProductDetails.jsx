import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './ProductDetails.module.css';

function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : {};
    });
    const [addMessage, setAddMessage] = useState('');
    const [showCart, setShowCart] = useState(false);

    useEffect(() => {
        const getProduct = async () => {
            try {
                const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        getProduct();
    }, [id]);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = () => {
        if (product) {
            setCart((prevCart) => {
                const quantity = prevCart[String(product.id)] ? prevCart[String(product.id)] + 1 : 1;
                return { ...prevCart, [String(product.id)]: quantity };
            });
            setAddMessage(`${product.title.substring(0, 20)}... added to cart!`);
            setTimeout(() => setAddMessage(''), 2000);
        }
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => {
            const newCart = { ...prevCart };
            delete newCart[String(productId)];
            return newCart;
        });
    };

    const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    const cartItems = product ? [product].filter(p => Object.prototype.hasOwnProperty.call(cart, String(p.id))) : [];

    if (loading) {
        return <div className={styles.loadingSpinner}>Loading...</div>;
    }

    if (!product) {
        return <div className={styles.notFound}>Product not found</div>;
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Product Details</h1>
                <button className={styles.cartButton} onClick={() => setShowCart(!showCart)}>
                    <span className={styles.cartIcon}>🛒</span>
                    {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
                </button>
            </header>

            {showCart && (
                <div className={styles.cartModal}>
                    <div className={styles.cartContent}>
                        <h2>Your Cart</h2>
                        {cartItems.length === 0 ? (
                            <div className={styles.emptyCart}>
                                <p>Your cart is empty</p>
                            </div>
                        ) : (
                            <div className={styles.cartItems}>
                                {cartItems.map((item) => (
                                    <div key={item.id} className={styles.cartItem}>
                                        <img src={item.image} alt={item.title} />
                                        <div className={styles.itemDetails}>
                                            <h3>{item.title.substring(0, 30)}</h3>
                                            <p>${item.price} × {cart[item.id]} = ${(item.price * cart[item.id]).toFixed(2)}</p>
                                        </div>
                                        <button 
                                            className={styles.removeButton}
                                            onClick={() => removeFromCart(item.id)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <button 
                            className={styles.closeCart}
                            onClick={() => setShowCart(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <main className={styles.productContainer}>
                <div className={styles.productImage}>
                    <img src={product.image} alt={product.title} />
                </div>
                <div className={styles.productInfo}>
                    <h2>{product.title}</h2>
                    <p className={styles.price}>${product.price}</p>
                    <p className={styles.category}>{product.category}</p>
                    <p className={styles.description}>{product.description}</p>
                    <div className={styles.buttons}>
                        <button className={styles.addButton} onClick={addToCart}>
                            Add to Cart
                        </button>
                        <Link to="/products" className={styles.backButton}>
                            Back to Products
                        </Link>
                    </div>
                </div>
            </main>

            {addMessage && <div className={styles.notification}>{addMessage}</div>}
        </div>
    );
}

export default ProductDetails;