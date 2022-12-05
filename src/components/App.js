import { useEffect, useState } from 'react';
import { getPosts } from '../api/index';
import { Home } from '../pages/index';
import Loader from './Loader';
import Navbar from './Navbar';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //making a function and then calling it, because the callback function passed to used effect has to be synchronous(so can't be async one)
    const fetchPosts = async () => {
      const response = await getPosts();
      if (response.success) {
        setPosts(response.data.posts);
      }

      setLoading(false); //even if response.success is false, we stop loading when fetch call completed
    };

    fetchPosts();
  }, []);

  //since the fetch call in useEffect wud be running asynchronously in the background after first render,
  //we will show loader, and after fetch call completed, setLoading will set loading to false
  //and then after setLoading, App component will be re-rendered and this time the App component will be rendered
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="App">
      <Navbar />
      <Home posts={posts} />
    </div>
  );
}

export default App;
