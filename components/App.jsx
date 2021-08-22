import React, {useEffect, useState} from 'react';
import {
    BrowserRouter as Router,
    Switch, Route, Link } from 'react-router-dom';
import styled from 'styled-components';

import Cookie from 'js-cookie';

//comopnent inputs
import {TopBar} from './TopBar.jsx';
import {Game} from './Game.jsx';
import {Account} from './Account.jsx';

const url = 'https://www.flag.quest/flag-quest-backend';
//const url = 'http://localhost:5000';

export default function App(){

    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState(null);
    const [API_KEY, setAPI_KEY] = useState(null);

    useEffect(()=>{
        if(token == null){
            setToken(Cookie.get('auth_token') ? Cookie.get('auth_token') : null);
        } else {
            console.log('got token: '+token)
        }

        if(API_KEY == null){
            setAPI_KEY(process.env['FLAG_QUEST_API_KEY'])
        } else {
            console.log('got api key: '+API_KEY)
        }

        if(userData == null && token != null){
            fetch(url+'/authenticate_user?api_key='+API_KEY,{
                method:'POST',
                mode:'cors',
                headers:{'Content-Type': 'application/json'},
                body:JSON.stringify(token)
            }).then(res => res.json()).then((result)=>{
                setUserData(result);
            })
        }
    })

    return(
        <Router>
            <MainContainer>
                <TopBar/>
                <Switch>
                    <Route exact path="/">
                        <Game/>
                    </Route>
                    <Route path="/account">
                        <Account userData={userData} url={url} API_KEY={API_KEY}/>
                    </Route>
                </Switch>
                <Footer>
                    <span>TrentLS</span>
                    <GithubIcon className="fab fa-github"></GithubIcon>
                    <span>v0.2</span>
                </Footer>
            </MainContainer>
        </Router>
    )
}

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Footer = styled.div`
    color:#ffffff73;
`;

const GithubIcon = styled.i`
   margin-left:10px; 
   margin-right:10px; 
   cursor:pointer;
`;
