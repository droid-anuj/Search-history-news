import React, { useState, useEffect } from "react";
import SearchHeader from "../../Components/SearchHeader/SearchHeader";
import "./HomePage.css";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); 
        const response = await fetch(
          `http://hn.algolia.com/api/v1/search?query=${searchQuery}`
        );
        const data = await response.json();
        setResponseData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, [searchQuery]);

  const formatTimeAgo = (createdAt) => {
    return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div>
      <SearchHeader onSearch={handleSearch} />

      <div>
        {loading && <div class="loader"></div>}

        {responseData && responseData.hits && (
          <ul>
            {responseData.hits.map((hit) => (
              <li key={hit.objectID} className="SearchResult">
                <div>
                  <Link
                    to={`/postdetails/${hit.objectID}`}
                    style={{ textDecoration: "none", fontWeight: "bold", color: "#000" }}
                  >
                    {hit.title}
                  </Link>
                  (
                  <a href={hit.url} target="_blank" rel="noopener noreferrer">
                    {hit.url}
                  </a>
                  )
                </div>
                {hit.points &&
                  hit.author &&
                  hit.created_at &&
                  hit.num_comments && (
                    <div className="ResultInfo">
                      {hit.points} points | {hit.author} |{" "}
                      {formatTimeAgo(hit.created_at)} | {hit.num_comments}{" "}
                      comments
                    </div>
                  )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HomePage;
