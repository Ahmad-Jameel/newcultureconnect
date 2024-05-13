import React from 'react'
import logo from '../../assets/logo.png'
import pic1 from '../../assets/door.jpg'
import pic2 from '../../assets/fade3.jpg'
import pic3 from '../../assets/img1.jpg'
import pic4 from '../../assets/haris.jpg'
import pic5 from '../../assets/user.jpg'
import "./about.css"
export default function aboutus() {
  return (
    <div>
    <section className="py-3 py-md-5 py-xl-8">
      <div className="container overflow-hidden">
        <h1
          className="mb-3 text-center mb-xl-4 text-uppercase"
          style={{ fontSize: 36 }}
        >
          About Us
        </h1>
        <div className="row gy-4 gy-lg-0">
          <div className="col-sm-12  col-lg-4">
            <article>
              <div className="card border-0" >
                <div className="img-div">
                  <img
                    className="card-img-top img-fluid m-0"
                    loading="lazy"
                    src={pic1}
                    alt=""
                  />
                </div>

                <div className="card-body border bg-white p-4" >
                  <div className="entry-header mb-3">
                    <h2 className="card-title entry-title h4 mb-0">
                      <a className="link-dark text-decoration-none" href="#!">
                        About Us
                      </a>
                    </h2>
                  </div>
                  <p className="card-text entry-summary text-secondary mb-3">
                    Welcome to Culture Connect, your gateway to the vibrant
                    tapestry of Pakistan's heritage. Immerse yourself in the
                    rich history, diverse traditions, and dynamic culture of
                    Pakistan, brought to life through our platform.
                  </p>
                </div>
              </div>
            </article>
          </div>
          <div className="col-sm-12  col-lg-4">
            <article>
              <div className="card border-0">
                <div className="img-div">
                  <img
                    className="card-img-top img-fluid m-0"
                    loading="lazy"
                    src={pic1}
                    alt=""
                  />
                </div>
                <div className="card-body border bg-white p-4">
                  <div className="entry-header mb-3">
                    <h2 className="card-title entry-title h4 mb-0">
                      <a className="link-dark text-decoration-none" href="#!">
                        Our Vision
                      </a>
                    </h2>
                  </div>
                  <p className="card-text entry-summary text-secondary mb-3">
                    From sleek modernism to timeless elegance, we infuse every
                    creation with a touch of our artistic ingenuity. As a
                    design agency, great design can shape perceptions, inspire
                    action, and leave an indelible mark on the world.
                  </p>
                </div>
              </div>
            </article>
          </div>
          <div className="col-sm-12  col-lg-4">
            <div className="card border-0">
              <div className="img-div">
                <img
                  className="card-img-top img-fluid m-0"
                  loading="lazy"
                  src={pic1}
                  alt=""
                />
              </div>
              <div className="card-body border bg-white p-4">
                <div className="entry-header mb-3">
                  <h2 className="card-title entry-title h4 mb-0">
                    <a className="link-dark text-decoration-none" href="#!">
                      Our Approach
                    </a>
                  </h2>
                </div>
                <p className="card-text entry-summary text-secondary mb-3">
                  

                Our approach combines cultural richness with contemporary design, crafting immersive experiences that celebrate Pakistan's heritage. With a focus on innovation and collaboration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <hr className="w-50 mx-auto mb-5 mb-xl-9 border-dark-subtle text-dark" />

    {/*Our Team*/}
    <section
      className="py-3 py-md-5 py-xl-8"
     
    >
      <div className="container">
        <div className="row justify-content-md-center">
          <div className="col-12 col-md-10 col-lg-8 col-xl-7 col-xxl-6">
            <h2 className="mb-4 display-5 text-center">Our Team</h2>
            <p className="text-secondary mb-5 text-center lead fs-4">
              We are a group of innovative, experienced, and proficient teams.
              You will love to collaborate with us.
            </p>
            <hr className="w-50 mx-auto mb-5 mb-xl-9 border-dark-subtle" />
          </div>
        </div>
      </div>

      <div className="container overflow-hidden">
        <div className="row gy-4 gy-lg-0 gx-xxl-5">
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card border-0 border-bottom border-primary shadow-sm overflow-hidden">
              <div className="card-body p-0">
                <figure className="m-0 p-0">
                <div className="img-div">
                      <img
                      className="card-img-top img-fluid m-0"
                      loading="lazy"
                      src={pic3}
                      alt=""
                  />
                  </div>
                 
                  <figcaption className="m-0 p-4">
                    <h4 className="mb-1">Uzman Zahid</h4>
                    <p className="text-secondary mb-0">Developer</p>
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card border-0 border-bottom border-primary shadow-sm overflow-hidden">
              <div className="card-body p-0">
                <figure className="m-0 p-0">
                <div className="img-div">
                      <img
                      className="card-img-top img-fluid m-0"
                      loading="lazy"
                      src={pic5}
                      alt=""
                  />
                  </div>
                 
                  <figcaption className="m-0 p-4">
                    <h4 className="mb-1">Muhammad Ahmad</h4>
                    <p className="text-secondary mb-0">Developer</p>
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card border-0 border-bottom border-primary shadow-sm overflow-hidden">
              <div className="card-body p-0">
                <figure className="m-0 p-0">
                <div className="img-div">
                      <img
                      className="card-img-top img-fluid m-0"
                      loading="lazy"
                      src={pic4}
                      alt=""
                  />
                  </div>
                  <figcaption className="m-0 p-4">
                    <h4 className="mb-1">Haris Iqbal</h4>
                    <p className="text-secondary mb-0">Developer</p>
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <hr className="w-50 mx-auto mb-5 mb-xl-9 border-dark-subtle text-dark" />

    {/*Services*/}
    <section className="py-3 py-md-5 py-xl-8">
      <div className="container overflow-hidden">
        <div className="row gy-4 gy-md-5 gy-lg-0 align-items-center">
          <div className="col-12 col-lg-5">
            <div className="row">
              <div className="col-12 col-xl-11">
                <h1
                  className="mb-3 mb-xl-4 text-uppercase "
                  style={{ fontSize: 36 }}
                >
                  {" "}
                  <b>Our Services</b>{" "}
                </h1>
                <h2 className="display-5 mb-3 mb-xl-4">
                  We are giving you perfect solutions with our proficient
                  services.
                </h2>
                <p className="mb-3 mb-xl-4">
                  Our comprehensive suite of services is designed to meet your
                  every need and help you thrive in today's dynamic business
                  landscape. Contact us today to embark on a journey of
                  growth, innovation, and unparalleled support. Your success
                  is our priority.
                </p>
                <a
                  href="#!"
                  className="btn bsb-btn-2xl btn-primary "
                  style={{ fontSize: 25 }}
                >
                  Discover More
                </a>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-7 overflow-hidden">
            <div className="row gy-4">
              <div className="col-12 col-sm-6">
                <div className="card border-2 border-bottom border-primary shadow-sm">
                  <div className="card-body text-center p-4 p-xxl-5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="56"
                      height="56"
                      fill="currentColor"
                      className="bi bi-textarea-resize text-primary mb-4"
                      viewBox="0 0 16 16"
                    >
                      <path d="M0 4.5A2.5 2.5 0 0 1 2.5 2h11A2.5 2.5 0 0 1 16 4.5v7a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 0 11.5v-7zM2.5 3A1.5 1.5 0 0 0 1 4.5v7A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 13.5 3h-11zm10.854 4.646a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708l3-3a.5.5 0 0 1 .708 0zm0 2.5a.5.5 0 0 1 0 .708l-.5.5a.5.5 0 0 1-.708-.708l.5-.5a.5.5 0 0 1 .708 0z" />
                    </svg>
                    <b style={{fontSize:24}} >Cultural Insigt & Blogs</b>
                    <p className="mt-3 text-secondary">
                      We can help you to understand your target market and
                      identify new opportunities for growth. We offer a
                      variety of research services.
                    </p>
                    <a
                      href="#!"
                      className="fw-bold text-decoration-none link-primary"
                    >
                      Learn More
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-arrow-right-short"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="card border-2 border-bottom border-primary shadow-sm">
                  <div className="card-body text-center p-4 p-xxl-5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="56"
                      height="56"
                      fill="currentColor"
                      className="bi bi-tablet text-primary mb-4"
                      viewBox="0 0 16 16"
                    >
                      <path d="M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h8zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4z" />
                      <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                    </svg>
                    <b  style={{fontSize:24}}>Social Connectivity</b>
                    <p className="mt-2 text-secondary">
                      We can help you to create a visually appealing and
                      user-friendly website. We take into account your brand
                      identity and target audience.
                    </p>
                    <a
                      href="#!"
                      className="fw-bold text-decoration-none link-primary"
                    >
                      Learn More
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-arrow-right-short"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="card border-2 border-bottom border-primary shadow-sm">
                  <div className="card-body text-center p-4 p-xxl-5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="56"
                      height="56"
                      fill="currentColor"
                      className="bi bi-repeat text-primary mb-4"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192Zm3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z" />
                    </svg>
                    <b style={{fontSize:24}} >Daily Updates</b>
                    <p className="mt-3 text-secondary">
                      We provide our clients with daily updates on their
                      business performance. This includes data on website
                      traffic and sales.
                    </p>
                    <a
                      href="#!"
                      className="fw-bold text-decoration-none link-primary"
                    >
                      Learn More
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-arrow-right-short"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="card border-2 border-bottom border-primary shadow-sm">
                  <div className="card-body text-center p-4 p-xxl-5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="56"
                      height="56"
                      fill="currentColor"
                      className="bi bi-shield-check text-primary mb-4"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z" />
                      <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
                    </svg>
                    <b style={{fontSize:24}} >Chatbot Support</b>
                    <p className="mt-3 text-secondary">
                      We offer free support to all of our clients. This means
                      that you can always get help when you need it, no matter
                      what time it is.
                    </p>
                    <a
                      href="#!"
                      className="fw-bold text-decoration-none link-primary"
                    >
                      Learn More
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-arrow-right-short"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/*Footer*/}
  </div>
  );
}
