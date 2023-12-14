// App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/HomePage/HomePage';
import PostDetail from './Components/PostDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/postdetails/:postId"
          element={<PostDetail />}
        />
      </Routes>
    </Router>
  );
}

export default App;
