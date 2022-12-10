import { Link } from 'react-router-dom';

import { Comment, Loader, FriendsList, CreatePost } from '../components/index';
import styles from '../styles/home.module.css';
import { useAuth, usePosts } from '../hooks';

const Home = () => {
  const auth = useAuth();
  const posts = usePosts();

  //since the fetch call in useEffect (inside useProvidePosts hook) wud be running asynchronously in the background after first render,
  //we will show loader, and after fetch call completed, setLoading will set loading to false
  //and then after setLoading, Home page will be re-rendered
  if (posts.loading) {
    return <Loader />;
  }

  return (
    <div className={styles.home}>
      <div className={styles.postsList}>
        <CreatePost />
        {posts.data.map((post) => {
          return (
            // 'key' prop is added below in div to solve the warning we were getting that every item in list should contain a key prop
            <div className={styles.postWrapper} key={`post-${post._id}`}>
              <div className={styles.postHeader}>
                <div className={styles.postAvatar}>
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/3893/3893170.png"
                    alt="user-pic"
                  />
                  <div>
                    {/* for seeing the post object, look at the json response coming after getPosts() in the network tab of developer tools */}
                    {/* <Link
                    to={`/user/${post.user._id}`}
                    state={{ user: post.user }}
                    className={styles.postAuthor}
                  >
                    {post.user.name}
                  </Link> */}
                    <Link
                      to={`/user/${post.user._id}`}
                      className={styles.postAuthor}
                    >
                      {post.user.name}
                    </Link>

                    <span className={styles.postTime}>a minute ago</span>
                  </div>
                </div>
                <div className={styles.postContent}>{post.content}</div>

                <div className={styles.postActions}>
                  <div className={styles.postLike}>
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/889/889140.png"
                      alt="likes-icon"
                    />
                    <span>{post.likes.length}</span>
                  </div>

                  <div className={styles.postCommentsIcon}>
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/3114/3114810.png"
                      alt="comments-icon"
                    />
                    <span>2</span>
                  </div>
                </div>
                <div className={styles.postCommentBox}>
                  <input placeholder="Start typing a comment" />
                </div>

                <div className={styles.postCommentsList}>
                  {post.comments.map((comment) => {
                    return (
                      <Comment
                        comment={comment}
                        key={`comment-${comment._id}`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {auth.user && <FriendsList />}
    </div>
  );
};

export default Home;
