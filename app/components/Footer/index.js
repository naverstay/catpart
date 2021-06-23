import React from 'react';

import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer row">
      <div className="column lg-col-8">
        <div className="footer-content">
          <div className="footer-copyright">
            2012-2021 © ООО «Сибэлком-Логистик», ИНН&nbsp;5404462899 <br />
            Для повышения удобства сайт использует cookies. Оставаясь на сайте, вы соглашаетесь с{' '}
            <Link className="footer-link" to="/privacy-policy">
              политикой конфиденциальности
            </Link>
            .
          </div>

          <div className="footer-phone">
            <a className="footer-link" href="tel:88005057388">
              8-800-505-73-88
            </a>
          </div>

          <div className="footer-sales">
            <a className="footer-link" href="mailto:sales@sibelcom54.com">
              sales@sibelcom54.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
