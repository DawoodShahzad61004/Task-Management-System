function Loginpage() {
    return (
      <div className="login-wrapper">
        <div className="login-container">
          <h1 className="login-title">Welcome to SYNC-OPS</h1>
          <p className="login-para">Please enter your credentials to log in.</p>
  
          <form className="login-form">
            <input type="text" name="username" placeholder="Username" className="input-field" />
            <input type="password" name="password" placeholder="Password" className="input-field" />
            <button type="submit" className="login-button">Login</button>
          </form>
        </div>
      </div>
    );
  }
  
  export default Loginpage;
  