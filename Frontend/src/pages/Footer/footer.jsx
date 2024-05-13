import React from "react";
import logo from "../../assets/logo.png";
import GoogleTranslate from "../../DualLanguage";

export default function footer() {
  return (
    <div>
      <footer className="footer">
        <section className="py-4 py-md-5 py-xl-8 bg-light border-top">
          <div className="container overflow-hidden">
            <div className="row gy-4 gy-lg-0">
              <div className="col-12 col-md-6 col-lg-4">
                <div className="widget">
                  <h4 className="widget-title mb-4">
                    <b>Get in Touch</b>
                  </h4>
                  <address className="mb-4">
                  National University of Computer & Emerging Sciences, Islamabad, Pakistan
                  </address>
                  <p className="mb-1">
                    <a
                      className="link-secondary text-decoration-none"
                      href="tel:+15057922430"
                    >
                      <b>(505) 792-2430</b>
                    </a>
                  </p>
                  <p className="mb-0"> <b>For Ads Promotion contects with us on</b></p>
                  <p className="mb-0">
                    <a
                      className="link-secondary text-decoration-none"
                      href="mailto:demo@yourdomain.com"
                    >
                      <b>CultureConnect@gmail.com</b>
                    </a>
                  </p>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-3 col-lg-2">
                <div className="widget">
                  <h4 className="widget-title mb-4">
                    <b>Services</b>
                  </h4>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <a
                        href="#!"
                        className="link-secondary text-decoration-none"
                      >
                        Blogs
                      </a>
                    </li>
                    <li className="mb-2">
                      <a
                        href="#!"
                        className="link-secondary text-decoration-none"
                      >
                        Social Media
                      </a>
                    </li>
                    <li className="mb-2">
                      <a
                        href="#!"
                        className="link-secondary text-decoration-none"
                      >
                        Chatbot
                      </a>
                    </li>
                    <li className="mb-2">
                      <a
                        href="#!"
                        className="link-secondary text-decoration-none"
                      >
                        Natives
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-3 col-lg-2">
                <div className="widget">
                  <h4 className="widget-title mb-4">
                    <b>Company</b>
                  </h4>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <a
                        href="#!"
                        className="link-secondary text-decoration-none"
                      >
                        About Us
                      </a>
                    </li>
                    <li className="mb-2">
                      <a
                        href="#!"
                        className="link-secondary text-decoration-none"
                      >
                        Feedback
                      </a>
                    </li>
                    <li className="mb-2">
                      <a
                        href="#!"
                        className="link-secondary text-decoration-none"
                      >
                        Services
                      </a>
                    </li>
                    <li className="mb-0">
                      <a
                        href="#!"
                        className="link-secondary text-decoration-none"
                      >
                        Privacy Policy
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-12 col-lg-4">
                <div className="widget">
                  <h4 className="widget-title mb-4">
                    {" "}
                    <b>Become Our Working Member</b>{" "}
                  </h4>
                  <p className="mb-4">
                    Click! And Enter the World of Diverse Culture.
                  </p>
                  <form action="#!">
                    <div className="row gy-4">
                      <div className="col-12">
                        <div className="d-grid">
                          <a
                            href="#!"
                            className="btn bsb-btn-2xl btn-primary "
                            style={{ fontSize: 22 }}
                          >
                            Get Started With Us
                          </a>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="bg-light py-4 py-md-5 py-xl-8 border-top border-light-subtle">
          <div className="container overflow-hidden">
            <div className="row gy-4 gy-md-0">
              <div className="col-xs-12 col-sm-6 col-md-4 order-0 order-md-0">
                <div className="footer-logo-wrapper text-center text-sm-start">
                  <a href="#!">
                    <img
                      src={logo}
                      alt="CultureConnect Logo"
                      style={{ width: "55px", height: "55px" }}
                    />
                  </a>
                </div>
                {/* <div className="h-20 overflow-hidden">
                  <GoogleTranslate />
                </div> */}
              </div>

              <div className="col-xs-12 col-md-4 order-2 order-md-1">
                <div className="footer-copyright-wrapper text-center">
                  &copy; 2024. All Rights Reserved.
                </div>
                <div className="credits text-secondary text-center mt-2 fs-7">
                  Built by{" "}
                  <a href="" className="link-secondary text-decoration-none">
                    Culture Connect
                  </a>{" "}
                  with <span className="text-primary">&#9829;</span>
                </div>
              </div>

              <div className="col-xs-12 col-sm-6 col-md-4 order-1 order-md-2"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
