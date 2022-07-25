import { useContext, useRef } from 'react';
import classes from './ProfileForm.module.css';
import AuthContext from '../../contexts/auth-ctx';
import { useHistory } from 'react-router-dom';
const FIREBASE_API_KEY = "AIzaSyAtrVlrKNbUupJynsWA_zv8WqPvpyTNYHA"

const ProfileForm = () => {
  const authCtx = useContext(AuthContext);
  const userPassword = useRef();
  const history = useHistory();

  const changePasswordHandler = (e) => {
    e.preventDefault()

    fetch(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken: authCtx.token,
          password: userPassword.current.value,
          returnSecureToken: false
        })
      })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then(data => {
            console.log(data);
            let errMessage = "Password modification failed!"
            if (data && data.error && data.error.message) { errMessage = data.error.message }
            throw new Error(errMessage)
          })
        }
      })
      .then(data => {
        history.replace("/")
      })
      .catch(err => alert(err))
  }

  return (
    <form className={classes.form}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' ref={userPassword} />
      </div>
      <div className={classes.action}>
        <button onClick={changePasswordHandler}>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
