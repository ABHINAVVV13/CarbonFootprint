import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';  // Import the CSS file
import LoginPage from './pages/LoginPage';
import RoutePage from './pages/RoutePage';
import StatisticsPage from './pages/StatisticsPage';
import RegisterPage from './pages/RegisterPage';
import { auth } from './firebase';

const App = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="app-background">
            <Router>
                <Navbar bg="dark" variant="dark" expand="lg" className="navbar-fixed">
                    <Navbar.Brand as={Link} to="/">GreenStep</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            {user ? (
                                <>
                                    <Nav.Link as={Link} to="/route">Route</Nav.Link>
                                    <Nav.Link as={Link} to="/statistics">Statistics</Nav.Link>
                                    <Nav.Link onClick={() => auth.signOut()}>Logout</Nav.Link>
                                </>
                            ) : (
                                <>
                                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                    <Nav.Link as={Link} to="/register">Register</Nav.Link>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <div className="content-wrapper">
                    <Routes>
                        <Route path="/" element={user ? <Navigate to="/route" /> : <Navigate to="/register" />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/route" element={user ? <RoutePage /> : <Navigate to="/login" />} />
                        <Route path="/statistics" element={user ? <StatisticsPage /> : <Navigate to="/login" />} />
                    </Routes>
                </div>
            </Router>
        </div>
    );
};

export default App;
