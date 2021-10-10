import React from 'react';

import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer row">
      <div className="column lg-col-10">
        <div className="footer-content">
          <div className="footer-copyright">
            2012-2021 © ООО «Катпарт», ИНН&nbsp;5406814289 <br />
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
            <a className="footer-link" href="mailto:sales@catpart.ru">
              sales@catpart.ru
            </a>
          </div>

          <div className="footer-offer">
            <a className="footer-link" href="mailto:sales@catpart.ru">
              Оферта
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
