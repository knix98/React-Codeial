// import { useLocation } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { Loader } from '../components';
import styles from '../styles/settings.module.css';
import { useAuth } from '../hooks';
import { addFriend, removeFriend, fetchUserProfile } from '../api';

const UserProfile = () => {
  // //using useLocation we will be able to access the state object that is passed to the Link tag bringing us to this page
  // const location = useLocation();
  // //if location.state is null then user = {}
  // const { user = {} } = location.state;

  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true); //for initial page loading when userProfile page mounted for first time
  const [requestInProgress, setRequestInProgress] = useState(false); // for ongoing api request when adding/removing a friend. Will be used for add/remove friend button
  const { userId } = useParams(); //getting the userId from the params of url of this page(/user/:userId)
  const navigate = useNavigate();
  const auth = useAuth();

  //this useEffect hook will be executed whenever the userId changes
  //navigate is also passed in dependency array just to remove the warning
  useEffect(() => {
    const getUser = async () => {
      const response = await fetchUserProfile(userId);

      if (response.success) {
        setUser(response.data.user);
      } else {
        toast.error(response.message);
        return navigate('/');
      }

      setLoading(false);
    };

    getUser();
  }, [userId, navigate]);

  //function to check whether the user whose profile page we have visited, is a friend of logged in user or not
  const checkIfUserIsAFriend = () => {
    //friends is array of friendships of auth.user
    const friends = auth.user.friends;

    //means there are no friends of auth.user, so return false
    if (!friends) return false;

    //getting all the friend's(friends of auth.user) ids
    const friendIds = friends.map((friend) => friend.to_user._id);
    //checking whether the userId(id of user whose profile page we are on) is a friend of logged in user or not
    const index = friendIds.indexOf(userId);

    if (index !== -1) {
      return true;
    }

    return false;
  };

  const handleRemoveFriendClick = async () => {
    setRequestInProgress(true);

    const response = await removeFriend(userId);

    if (response.success) {
      //find the friendship to remove from auth.user.friends array
      const friendship = auth.user.friends.filter(
        (friend) => friend.to_user._id === userId
      );

      // .filter wud return a friendship array containing only 1 friend (that is the friend to be removed)
      auth.updateUserFriends(false, friendship[0]);
      toast.success('Friend removed successfully!');
    } else {
      toast.error(response.message);
    }
    setRequestInProgress(false);
  };

  const handleAddFriendClick = async () => {
    setRequestInProgress(true);

    const response = await addFriend(userId);

    if (response.success) {
      const { friendship } = response.data;

      auth.updateUserFriends(true, friendship);
      toast.success('Friend added successfully!');
    } else {
      toast.error(response.message);
    }
    setRequestInProgress(false);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.settings}>
      <div className={styles.imgContainer}>
        <img
          src="https://cdn-icons-png.flaticon.com/128/3893/3893170.png"
          alt=""
        />
      </div>

      <div className={styles.field}>
        <div className={styles.fieldLabel}>Email</div>
        <div className={styles.fieldValue}>{user.email}</div>
      </div>

      <div className={styles.field}>
        <div className={styles.fieldLabel}>Name</div>

        <div className={styles.fieldValue}>{user.name}</div>
      </div>

      <div className={styles.btnGrp}>
        {checkIfUserIsAFriend() ? (
          <button
            className={`button ${styles.saveBtn}`}
            onClick={handleRemoveFriendClick}
            disabled={requestInProgress}
          >
            {requestInProgress ? 'Removing friend...' : 'Remove friend'}
          </button>
        ) : (
          <button
            className={`button ${styles.saveBtn}`}
            onClick={handleAddFriendClick}
            disabled={requestInProgress}
          >
            {requestInProgress ? 'Adding friend...' : 'Add friend'}
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
