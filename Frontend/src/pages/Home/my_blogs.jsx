import React, { useState, useEffect } from "react";
import axios from "../../axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location.state);

  const { userId } = location.state || {};
  console.log("my blogs----------------", userId);

  const [blogs, setBlogs] = useState([]);
  const baseURL = "http://localhost:5000/";

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${baseURL}native/my_blogs`, {
          params: { id: userId },
        });
        setBlogs(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch blogs: ", error);
      }
    };

    fetchBlogs();
  }, []);

  const navigateToBlogs = (blogId) => {
    navigate("/user/seeBlogs", { state: { blogId: blogId } });
  };

  return (
    <div>
      <br />
      <h1
        className="mb-3 title mb-xl-4 text-uppercase text-center my-5"
        style={{ fontSize: "38px" }}
      >
        Blogs
      </h1>

      <div className="container overflow-hidden">
        <div className="row gy-4 gy-lg-0">
          {blogs.map((blog) => (
            <div className="col-12 col-lg-4 mt-5" key={blog.id}>
              <article>
                <div className="card border-0">
                  <img
                    className=" img-fluid m-0"
                    loading="lazy"
                    style={{height:300}}
                    src={`${baseURL}${blog.Blog_Title_Image}`}
                    alt=""
                  />
                  <div className="card-body border bg-white p-4">
                    <div className="entry-header mb-3">
                      <h2 className="card-title entry-title h4 mb-0">
                        <a className="link-dark text-decoration-none" href="#!">
                          {blog.Blog_Title}
                        </a>
                      </h2>
                    </div>
                    <div className="text-justify-center">
                      <p className="card-text entry-summary text-secondary mb-3">
                      {blog.Blog_Content.substring(0, 100)}
                        ...
                      </p>
                      <div className="text-center">
                        {/* Update the onClick handler to pass blog's ID */}
                        <a
                          href="#!"
                          className="btn bsb-btn-2xl btn-primary "
                          style={{ fontSize: 20 }}
                          onClick={() => navigateToBlogs(blog.id)}
                        >
                          Read More
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          ))}
          <div className="mb-5"></div>
        </div>
      </div>
    </div>
  );
}
