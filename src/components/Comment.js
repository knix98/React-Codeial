import PropTypes from 'prop-types';

import styles from '../styles/home.module.css';

const Comment = ({ comment }) => {
    return (
        <div className={styles.postCommentsItem} >
            <div className={styles.postCommentHeader}>
            <span className={styles.postCommentAuthor}>{comment.user.name}</span>
            <span className={styles.postCommentTime}>a minute ago</span>
            <span className={styles.postCommentLikes}>22</span>
            </div>

            <div className={styles.postCommentContent}>{comment.content}</div>
        </div>
    )
}

Comment.propTypes = {
  //setting: propType of posts should be array, and posts is required in props of Home(otherwise throw error)
  comment: PropTypes.object.isRequired,
}

export default Comment;