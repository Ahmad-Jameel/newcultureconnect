import React, { useState, useEffect } from "react";
import axios from "../../axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import "./home.css";
export default function Home() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [reportOptionVisible, setReportOptionVisible] = useState({});
  const baseURL = "http://localhost:5000/";

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${baseURL}native/allblogs`);
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

  const toggleReportOption = (blogId) => {
    setReportOptionVisible((prev) => ({
      ...prev,
      [blogId]: !prev[blogId],
    }));
  };

  const handleReportClick = (blog) => {
    const postId = blog.BlogsID;
    const postType = "blog";

    console.log("----------blogID", postId);

    navigate("/user/Feedback", { state: { postId, postType } });
  };

  const handleReportClick1 = (post) => {
    const postId = post.VideoID ? post.VideoID : post.ImageID;
    const postType = post.VideoID ? "video" : "image";
    navigate("/user/Feedback", { state: { postId, postType } });
  };

  return (
    <div>
      <section id="nav-sec-pic1" className="d-flex justify-content-center align-items-center">
    <div className="text-image">
        <h1>Culture Connect</h1>
    </div>
</section>


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
            <div className="col-12 col-lg-4 mt-5 px-4" key={blog.id}>
              <div className="text-end mt-3">
                <button
                  className="btn"
                  onClick={() => toggleReportOption(blog.id)}
                >
                  <i className="fas fa-ellipsis-v"></i>{" "}
                  {/* Adjust icon based on your icons library */}
                </button>
                {reportOptionVisible[blog.id] && (
                  <div>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleReportClick(blog)}
                    >
                      Report
                    </button>
                  </div>
                )}
              </div>
              <article>
                <div className="card ">
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
                      {(blog.Blog_Content.length > 100) && '...'}
                    </p>

                      <div className="text-center">
                        <a
                          href="#!"
                          className="btn bsb-btn-2xl btn-secondary "
                          style={{ fontSize: 20 }}
                          onClick={() => navigateToBlogs(blog.id)}
                        >
                          Read More
                        </a>
                      </div>
                      {/* Three-dotted button for report */}
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
