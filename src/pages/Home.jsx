import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import styles from './Home.module.css';

function HomePage() {
    const [catList, setCatList] = useState([]);
    const [prodList, setProdList] = useState([]);
    const [filteredProds, setFilteredProds] = useState([]);
    const [activeCat, setActiveCat] = useState('all');
    const [currentTesti, setCurrentTesti] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes, productsRes] = await Promise.all([
                    axios.get('https://fakestoreapi.com/products/categories'),
                    axios.get('https://fakestoreapi.com/products')
                ]);
                setCatList(categoriesRes.data);
                setProdList(productsRes.data);
                setFilteredProds(productsRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

        const timer = setInterval(() => {
            setCurrentTesti((prev) => (prev + 1) % testiArray.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        setFilteredProds(
            activeCat === 'all' 
                ? prodList 
                : prodList.filter(prod => prod.category === activeCat)
        );
    }, [activeCat, prodList]);

    const testiArray = [
        { text: 'Amazing store with incredible deals!', author: 'Jane Doe' },
        { text: 'The best shopping experience online.', author: 'John Smith' },
        { text: 'Great variety and service!', author: 'Emily Johnson' }
    ];

    if (!prodList.length && !catList.length) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <div className={styles.homeContainer}>
            {/* Hero Section */}
            <section className={styles.heroSection}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-12 col-md-6">
                            <h1 className={styles.heroTitle}>Welcome to Your Shopping Haven</h1>
                            <p className={styles.heroSubtitle}>Step into a world of fashion with us.</p>
                            <Link to="/products" className={styles.ctaButton}>
                                Discover Now
                            </Link>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className={styles.heroImage}></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <nav className={styles.categoriesNav}>
                <div className="container">
                    <div className={styles.categoriesWrapper}>
                        <button
                            className={`${styles.categoryButton} ${activeCat === 'all' ? styles.activeCategory : ''}`}
                            onClick={() => setActiveCat('all')}
                        >
                            All
                        </button>
                        {catList.map((cat) => (
                            <button
                                key={cat}
                                className={`${styles.categoryButton} ${activeCat === cat ? styles.activeCategory : ''}`}
                                onClick={() => setActiveCat(cat)}
                            >
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Products Grid */}
            <section className={styles.productsSection}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Featured Products</h2>
                    <div className="row">
                        {filteredProds.slice(0, 4).map((prod) => (
                            <div className="col-12 col-md-6 col-lg-3 mb-4" key={prod.id}>
                                <div className={styles.productCard}>
                                    <img src={prod.image} alt={prod.title} className={styles.productImage} />
                                    <h3 className={styles.productTitle}>{prod.title}</h3>
                                    <p className={styles.productPrice}>${prod.price}</p>
                                    <Link to={`/products/${prod.id}`} className={styles.productButton}>
                                        Buy Now
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className={styles.testimonialsSection}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>What Our Customers Say</h2>
                    <div className={styles.testimonialCard}>
                        <p className={styles.testimonialText}>"{testiArray[currentTesti].text}"</p>
                        <p className={styles.testimonialAuthor}>- {testiArray[currentTesti].author}</p>
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className={styles.newsletterSection}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Stay Updated</h2>
                    <p className={styles.newsletterText}>Subscribe for the latest news and offers.</p>
                    <div className={styles.newsletterForm}>
                        <input type="email" placeholder="Enter your email" className={styles.newsletterInput} />
                        <button className={styles.newsletterButton}>Subscribe</button>
                    </div>
                </div>
            </section>

            {/* Social Media */}
            <section className={styles.socialSection}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Follow Us</h2>
                    <div className={styles.socialIcons}>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                            <i className="fab fa-instagram"></i>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePage;