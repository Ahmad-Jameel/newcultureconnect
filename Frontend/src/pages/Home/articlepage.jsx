import React, { useState, useEffect } from "react";
import axios from "../../axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation, useNavigate } from "react-router-dom";

export default function ArticlePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { blogId } = location.state || {};
  const [blogData, setBlogData] = useState(null);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/native/see_specific_blog?id=${blogId}`
        );
        setBlogData(response.data);
      } catch (error) {
        console.error("Failed to fetch blog data:", error);
      }
    };

    if (blogId) fetchBlogData();
  }, [blogId]);

  // Function to split the paragraph into two parts without breaking words
  const splitParagraph = (text) => {
    const halfwayIndex = Math.floor(text.length / 2);
    let firstPartEndIndex = halfwayIndex;
    // Find the nearest whitespace before the halfway point
    while (firstPartEndIndex > 0 && text[firstPartEndIndex] !== ' ') {
      firstPartEndIndex--;
    }
    // If no whitespace found, just split at the halfway point
    if (firstPartEndIndex === 0) {
      firstPartEndIndex = halfwayIndex;
    }
    const firstPart = text.slice(0, firstPartEndIndex);
    const secondPart = text.slice(firstPartEndIndex).trim(); // Trim any leading whitespace
    return [firstPart, secondPart];
  };

  // Split the first part of the blog content into two parts
  const [firstP, secondP] = blogData
    ? splitParagraph(blogData.Blogdata[0].Blog_Content)
    : ["", ""];

  // Function to handle navigation to the next page
  const handleNavigation = (userId) => {
    navigate("/user/NativeProfile", { state: { userId: userId } });
  };

  return (
    <div>
      {blogData ? (
        <article className="mb-4">
          <div className="container px-4 px-lg-5">
            <div className="row mt-5 gx-4 gx-lg-5 justify-content-center">
              <div className="col-md-10 col-lg-10 col-xl-10">
                <h1 className="my-5" style={{ fontSize: 36, fontWeight: "bold" }}>
                  {blogData.Blogdata[0].Blog_Title}
                </h1>
                <a className="mb-5"
                  href="#!"
                  style={{
                    display: "block",
                    height: "500px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    className="img-fluid mb-5"
                    src={`http://localhost:5000/${blogData.Blogdata[0].Blog_Title_Image}`}
                    alt="Blog Title"
                    style={{
                      objectFit: "cover",
                      objectPosition: "top",
                      width: "100%",
                      height: "100%",
                      borderRadius: 30
                    }}
                  />
                </a>
                {/* First half paragraph of firstPart shown here */}
                <p style={{ fontSize: "24px" }}>{firstP}</p>
                <a className="my-5"
                  href="#!"
                  style={{
                    display: "block",
                    height: "500px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    className="img-fluid mb-5"
                    src={`http://localhost:5000/${blogData.Blogdata[0].Blog_Content_Image}`}
                    alt="Blog Title"
                    style={{
                      objectFit: "cover",
                      objectPosition: "top",
                      width: "100%",
                      height: "100%",
                      borderRadius: 30
                    }}
                  />
                </a>
                <br />
                {/* Second half paragraph of firstPart shown here */}
                <p style={{ fontSize: "24px" }}>{secondP}</p>
                {/* Link to navigate to the next page with userId */}
                <p
                  style={{
                    textDecoration: "none",
                    color: "blue",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleNavigation(blogData?.BlogUserData[0]?.UserID)
                  }
                >
                   This blog is written by: {blogData?.BlogUserData[0]?.Name}
                </p>
              </div>
            </div>
          </div>
        </article>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
