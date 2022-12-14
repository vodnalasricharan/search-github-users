import React from 'react';
import { Info, Repos, User, Search, Navbar } from '../components';
import loadingImage from '../images/preloader.gif';
import { GithubContext, useGlobalGithubContext} from '../context/context';
const Dashboard = () => {
  const {githubUser,loading} = useGlobalGithubContext();
  const {public_repos,followers,following,public_gists}= githubUser
  if(loading){
    return(
      <main>
        <Navbar></Navbar>
        <Search></Search>
        <img src={loadingImage} alt='loading-img' class='loading-img' />
      </main>
    )
  }
  return (
    <main>
      <Navbar></Navbar>
      <Search/>
      <Info/>
      <User/>
      <Repos/>
    </main>
  );
};

export default Dashboard;
