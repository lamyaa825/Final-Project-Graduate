import { Link, useLocation } from 'react-router-dom';
import './nav.css';

function Navbar() {
    const location = useLocation();

    return (
        <nav className="custom-navbar navbar navbar-expand-lg navbar-dark">
            <div className="container">
                <Link className="navbar-brand fw-bold fs-4" to="/">🛒 React Store</Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                                to="/"
                            >
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}
                                to="/products"
                            >
                                Products
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;