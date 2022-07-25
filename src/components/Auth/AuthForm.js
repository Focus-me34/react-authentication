import { useState, useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import classes from './AuthForm.module.css';
import AuthContext from '../../contexts/auth-ctx';
const FIREBASE_API_KEY = "AIzaSyAtrVlrKNbUupJynsWA_zv8WqPvpyTNYHA"

const AuthForm = () => {
  const emailInput = useRef();
  const passwordInput = useRef();
  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const enteredEmail = emailInput.current.value;
    const enteredPassword = passwordInput.current.value;

    setIsLoading(true)
    let url;
    if (isLogin) { // ! IF LOGIN PAGE
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`
    } else { // ! IF SIGNUP PAGE
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`
    }

    fetch(url, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true
      })
    })
      .then(res => {
        setIsLoading(false)
        if (res.ok) {   // ! IF CREDENTIALS ARE VALID
          return res.json()
        } else {        // ! IF CREDENTIALS ARE NOTVALID
          return res.json().then(data => {
            console.log(data);
            let errMessage = "Authentication failed"
            if (data && data.error && data.error.message) { errMessage = data.error.message }
            throw new Error(errMessage)
          })
        }
      }) // ! WE PERFORM A SPECIFIC ACTION WITH THE DATA RETURNED
      .then(data => {
        const expirationTime = new Date(new Date().getTime() + (+data.expiresIn * 1000));
        console.log(expirationTime);
        console.log(expirationTime.toISOString());
        authCtx.login(data.idToken, expirationTime.toISOString())
        history.replace("/profile")
      }) // ! WE CATCH ANY ERROR
      .catch(err => alert(err))
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>

      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInput} />
        </div>

        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInput} />
        </div>

        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p>Sending request ...</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
