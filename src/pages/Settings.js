import { useState } from 'react';
import toast from 'react-hot-toast';

import styles from '../styles/settings.module.css';
import { useAuth } from '../hooks';

const Settings = () => {
  const auth = useAuth();
  const [editMode, setEditMode] = useState(false); //signifying whether user entered the update profile state
  const [name, setName] = useState(auth.user?.name ? auth.user.name : '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingForm, setSavingForm] = useState(false); //signifying whether the saving updated profile info request completed or not

  const updateProfile = async () => {
    setSavingForm(true);

    let error = false;
    if (!name || !password || !confirmPassword) {
      toast.error('Please fill all the fields');
      error = true;
    } else if (password !== confirmPassword) {
      toast.error('Password and confirm password does not match');
      error = true;
    }

    if (error) return setSavingForm(false);

    const response = await auth.updateUser(
      auth.user._id,
      name,
      password,
      confirmPassword
    );

    if (response.success) {
      setEditMode(false);
      //resetting the password and confirmPassword
      setPassword('');
      setConfirmPassword('');
      toast.success('User updated successfully!');
    } else {
      toast.error(response.message);
    }

    setSavingForm(false);
  };

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
        <div className={styles.fieldValue}>{auth.user?.email}</div>
      </div>

      <div className={styles.field}>
        <div className={styles.fieldLabel}>Name</div>

        {editMode ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          //'auth.user?.name' means if auth.user exists->return auth.user.name otherwise return undefined
          <div className={styles.fieldValue}>{auth.user?.name}</div>
        )}
      </div>

      {editMode && (
        <>
          <div className={styles.field}>
            <div className={styles.fieldLabel}>Password</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <div className={styles.fieldLabel}>Confirm Password</div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </>
      )}

      <div className={styles.btnGrp}>
        {editMode ? (
          <>
            <button
              className={`button ${styles.saveBtn}`}
              onClick={updateProfile}
              disabled={savingForm}
            >
              {savingForm ? 'Saving profile...' : 'Save profile'}
            </button>
            <button
              className={`button ${styles.editBtn}`}
              onClick={() => setEditMode(false)}
            >
              Go back
            </button>
          </>
        ) : (
          <button
            className={`button ${styles.editBtn}`}
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default Settings;
