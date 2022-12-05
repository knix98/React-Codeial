import { useEffect } from 'react';
import { getPosts } from '../api/index';
import { Home } from '../pages/index';

function App() {
  useEffect(() => {
    //making a function and then calling it, because the callback function passed to used effect has to be synchronous(so can't be async one)
    const fetchPosts = async () => {
      const response = await getPosts();
      console.log('response', response);
    };

    fetchPosts();
  }, []);

  return (
    <div className="App">
      <Home />
    </div>
  );
}

export default App;
