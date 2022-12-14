import React, { useState, useEffect,useContext } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';


const GithubContext = React.createContext();

const GithubProvider = ({children})=>{
    const [githubUser,SetGithubUser] = useState(mockUser);
    const [followers,SetFollowers] = useState(mockFollowers);
    const [repos,SetRepos] = useState(mockRepos);
    const [requests,SetRequests] = useState(0);
    const [loading, SetIsLoading] = useState(false);
    const [error,SetError] = useState({show:false,msg:""});
    const SearchGithubUser = async(user)=>{
        
        toggleError();
        SetIsLoading(true);
        const response = await axios(`${rootUrl}/users/${user}`).catch(err=> console.log(err))
        if(response){
            SetGithubUser(response.data);
            const {login,followers_url} = response.data;
            //repos
            //https://api.github.com/users/john-smilga/repos?per_page=100
            //followers
            //https://api.github.com/users/john-smilga/followers
            // axios(`${rootUrl}/users/${login}/repos?per_page=100`).
            // then((response) => 
            //     SetRepos(response.data)
            // );
            // axios(`${followers_url}?per_page=100`).
            // then((response) => 
            //     SetFollowers(response.data)
            // );
            await Promise.allSettled([
                axios(`${rootUrl}/users/${login}/repos?per_page=100`),
                axios(`${followers_url}?per_page=100`)
            ]).then((results)=>{
                const [repos,followers] = results;
                const status = 'fulfilled';
                if(repos.status === status){
                    SetRepos(repos.value.data)
                }
                if(followers.status === status){
                    SetFollowers(followers.value.data)
                }
            }).catch(error => console.log(error));
        }
        else{
            toggleError(true,"user not found!")
        }
        CheckRequests();
        SetIsLoading(false);
    };
    const CheckRequests = ()=>{
        axios(`${rootUrl}/rate_limit`).then((data)=>{
            let {
                data: {rate:{remaining}},
            }=data;
            // remaining=0;
            SetRequests(remaining);
            if(remaining === 0){
                toggleError(true,"Sorry,You have exceeded your hourly rate limit!");
            }
            
        })
        .catch((error)=>
        {
            console.log(error);
        })
    };
    const toggleError = (show=false,msg='')=>{
        SetError({show,msg});
    };
    useEffect(()=>{
        CheckRequests();
    },[])
    return(
        <GithubContext.Provider value={{githubUser,followers,repos,requests,error,SearchGithubUser,loading}}>{children}</GithubContext.Provider>
    );
}
export const useGlobalGithubContext = () =>{
    return useContext(GithubContext);
}
export {GithubContext,GithubProvider};