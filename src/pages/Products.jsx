import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Products.module.css';

function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : {};
    });
    const [showCart, setShowCart] = useState(false);
    const [addMessage, setAddMessage] = useState('');

    useEffect(() => {
        const getData = async () => {
            try {
                const [prodData, catData] = await Promise.all([
                    axios.get('https://fakestoreapi.com/products'),
                    axios.get('https://fakestoreapi.com/products/categories')
                ]);
                
                setProducts(prodData.data);
                setFilteredProducts(prodData.data);
                setCategories(['all', ...catData.data]);
            } catch (error) {
                console.error('Error getting data:', error);
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, []);

    useEffect(() => {
        if (activeCategory === 'all') {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(product => product.category === activeCategory));
        }
    }, [activeCategory, products]);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (productId) => {
        setCart((prevCart) => {
            const quantity = prevCart[productId] ? prevCart[productId] + 1 : 1;
            return { ...prevCart, [productId]: quantity };
        });
        setAddMessage('Added to cart!');
        setTimeout(() => setAddMessage(''), 2000);
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => {
            const newCart = { ...prevCart };
            delete newCart[productId];
            return newCart;
        });
    };

    const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    const cartItems = products.filter(product => cart[product.id]);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    return (
        <div className={styles.productsPage}>
            <div className="container">
                {/* Header Section */}
                <header className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>Our Products</h1>
                    <button 
                        className={styles.cartButton}
                        onClick={() => setShowCart(!showCart)}
                        aria-label="View cart"
                    >
                        <i className="fas fa-shopping-cart"></i>
                        {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
                    </button>
                </header>

                {/* Cart Popup */}
                {showCart && (
                    <div className={styles.cartOverlay}>
                        <div className={styles.cartModal}>
                            <div className={styles.cartHeader}>
                                <h3>Shopping Cart</h3>
                                <button 
                                    className={styles.closeButton}
                                    onClick={() => setShowCart(false)}
                                >
                                    &times;
                                </button>
                            </div>
                            
                            {cartItems.length === 0 ? (
                                <div className={styles.emptyCart}>
                                    <i className="fas fa-shopping-basket"></i>
                                    <p>Your cart is empty</p>
                                </div>
                            ) : (
                                <div className={styles.cartItems}>
                                    {cartItems.map((item) => (
                                        <div className={styles.cartItem} key={item.id}>
                                            <img 
                                                src={item.image} 
                                                alt={item.title} 
                                                className={styles.cartItemImage}
                                            />
                                            <div className={styles.cartItemInfo}>
                                                <h4>{item.title.substring(0, 30)}...</h4>
                                                <p>${item.price.toFixed(2)} × {cart[item.id]}</p>
                                            </div>
                                            <button
                                                className={styles.removeButton}
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            <div className={styles.cartFooter}>
                                <button 
                                    className={styles.checkoutButton}
                                    disabled={cartItems.length === 0}
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Message */}
                {addMessage && (
                    <div className={styles.notification}>
                        {addMessage}
                    </div>
                )}

                {/* Categories Filter */}
                <div className={styles.categoriesFilter}>
                    {categories.map((category) => (
                        <button
                            key={category}
                            className={`${styles.categoryButton} ${
                                activeCategory === category ? styles.active : ''
                            }`}
                            onClick={() => setActiveCategory(category)}
                        >
                            {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                <div className={styles.productsGrid}>
                    {filteredProducts.map((product, index) => (
                        <div 
                            className={styles.productCard}
                            key={product.id}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className={styles.productImageContainer}>
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className={styles.productImage}
                                />
                                <div className={styles.productOverlay}>
                                    <Link 
                                        to={`/products/${product.id}`}
                                        className={styles.viewDetailsButton}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        Details
                                    </Link>
                                </div>
                            </div>
                            <div className={styles.productInfo}>
                                <h3 className={styles.productTitle}>{product.title.substring(0, 40)}...</h3>
                                <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
                                <button
                                    className={styles.addToCartButton}
                                    onClick={() => addToCart(product.id)}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Products;