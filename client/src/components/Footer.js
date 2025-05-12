import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer className="bg-body-tertiary text-center text-lg-start mt-5 py-3 border-top">
            <Container className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                <div className="text-muted mb-2 mb-md-0">
                    © {new Date().getFullYear()} Craftista. Все права защищены.
                </div>
                <div>
                    <a
                        href="https://github.com/UnderSann/web_app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted text-decoration-none"
                    >
                        Мой GitHub
                    </a>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
