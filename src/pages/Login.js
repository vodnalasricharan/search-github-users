import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';
import loginImg from '../images/login-img.svg';
const Login = () => {
  const {loginWithRedirect,user,isAuthenticated} = useAuth0();
  if(isAuthenticated&&user){
    return <Navigate to='/' />;
  }
  return <Wrapper className='container'>
    <div className="container">
      <h1>search GitHub user</h1>
      <img src={loginImg} alt="github user"></img>
      <button className='btn' onClick={loginWithRedirect}>login/signup</button>
    </div>
  </Wrapper>;
};
const Wrapper = styled.section`
  min-height: 100vh;
  display: grid;
  place-items: center;
  .container {
    width: 90vw;
    max-width: 600px;
    text-align: center;
  }
  img {
    margin-bottom: 2rem;
  }
  h1 {
    margin-bottom: 1.5rem;
  }
`;
export default Login;
