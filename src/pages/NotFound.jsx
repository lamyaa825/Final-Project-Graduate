import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

function NotFound() {
    return (
        <div className={styles.notFoundContainer}>
            <div className={styles.notFoundContent}>
                <h1 className={styles.notFoundTitle}>Error</h1>
                <p className={styles.notFoundText}>Oops! The page you're looking for doesn't exist.</p>
                <Link to="/" className={styles.notFoundButton}>Go Back Home</Link>
            </div>
        </div>
    );
}

export default NotFound;