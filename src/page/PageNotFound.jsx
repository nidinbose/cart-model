import React from 'react';
import "./style/pageNotFound.css"

const PageNotFound = () => {
  return (
    <section className="pg-page_404">

   
            <div className=" pg-text-center">
              <div className="pg-four_zero_four_bg">
                <h1 className="pg-text-center">404</h1>
              </div>

              <div className="pg-contant_box_404">
                <h3 className="pg-h2">Look like you're lost</h3>

                <p>The page you are looking for is not available!</p>

                <a href="/" className="pg-link_404">
                  Go to Home
                </a>
              </div>
          
       
      </div>
    </section>
  );
};

export default PageNotFound;


