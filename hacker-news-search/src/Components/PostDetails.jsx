import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';

import { useParams } from 'react-router-dom';

// Comment component renders individual comments
const Comment = ({ comment, isChild }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Toggle comment expansion
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  // Styles for comment component
  const commentStyle = {
    background: '#f4f4f4',
    padding: '10px',
    marginBottom: isChild ? '5px' : '10px', 
    color: '#000',
  };

  const timestampStyle = {
    color: '#777',
    fontSize: '0.9em',
  };

  const linkStyle = {
    textDecoration: 'none',
    wordBreak: 'break-all',
    color: '#000',
  };

  const authorStyle = {
    color: '#777',
    marginRight: '5px', 
  };

  const arrowStyle = {
    cursor: 'pointer',
    marginRight: '5px',
    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)',
    transition: 'transform 0.3s ease',
  };

  // Sanitize HTML content
  const sanitizedHTML = DOMPurify.sanitize(comment.text, {
    FORBID_ATTR: ['style'],
    FORBID_TAGS: ['style'],
  });

  // Function to calculate time ago
  const timeAgo = (timestamp) => {
    const now = new Date();
    const commentDate = new Date(timestamp * 1000);
    const diff = Math.floor((now - commentDate) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1,
    };

    for (const [unit, seconds] of Object.entries(intervals)) {
      const count = Math.floor(diff / seconds);
      if (count > 0) {
        return `${count} ${unit}${count !== 1 ? 's' : ''} ago`;
      }
    }

    return 'just now';
  };

  // Render comment component
  return (
    <div style={commentStyle}>
      <span style={{ ...timestampStyle, ...authorStyle }}>
        <span style={arrowStyle} onClick={toggleExpansion}>
          {comment.children && comment.children.length > 0 && (
            <span>{isExpanded ? '▼' : '►'}</span>
          )}
        </span>
        {comment.author} | {timeAgo(comment.created_at_i)}  
      </span>
      <p dangerouslySetInnerHTML={{ __html: sanitizedHTML }} style={linkStyle} />
      {comment.children && comment.children.length > 0 && isExpanded && (
        <div style={{ marginTop: '2px', marginLeft: '20px' }}>
          {comment.children.map((child) => (
            <Comment key={child.id} comment={child} isChild={true} />
          ))}
        </div>
      )}
    </div>
  );
};

// Loader style for displaying loading animation
const loaderStyle = {
  margin: "auto",
  border: "20px solid #EAF0F6",
  borderRadius: "50%",
  borderTop: "20px solid #FF7A59",
  width: "50px",
  height: "50px",
  animation: "spinner 4s linear infinite",
  marginTop: "80px",
};

// PostDetail component fetches and displays post details
const PostDetail = () => {
  const { postId } = useParams();
  console.log(postId);
  const [post, setPost] = useState(null);

  // Fetch post details on component mount
  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const response = await axios.get(`https://hn.algolia.com/api/v1/items/${postId}`);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post detail:', error);
      }
    };

    if (postId) {
      fetchPostDetail();
    }
  }, [postId]);

  // Render PostDetail component
  return (
    <div>
      {post ? (
        <div>
          <h2>{post.title}</h2>
          <p>
            {post.points} points by {post.author} | {post.num_comments} comments
          </p>
          {post.children.map((comment) => (
            <Comment key={comment.id} comment={comment} isChild={false} />
          ))}
        </div>
      ) : (
        <p><div style={loaderStyle}></div></p>
      )}
    </div>
  );
};

export default PostDetail;
