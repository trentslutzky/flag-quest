import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import styled from "styled-components";

//comopnent inputs
import { TopBar } from "./TopBar.jsx";
import { Game } from "./Game.jsx";
import { Leaderboard } from "./Leaderboard.jsx";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export default function App() {
  return (
    <Router>
      <MainContainer>
        <TopBar />
        <MainContent>
          <Switch>
            <Route exact path="/">
              <Game />
            </Route>
            <Route path="/leaderboard">
              <Leaderboard />
            </Route>
          </Switch>
        </MainContent>
        <Space/>
        <Footer>
          <GHLink href="https://github.com/trentslutzky" target="_blank">
            <span>TrentLS</span>
            <GithubIcon className="fab fa-github"></GithubIcon>
            <span>v2.0</span>
          </GHLink>
        </Footer>
      </MainContainer>
    </Router>
  );
}

const Space = styled.div`
  flex-grow:1;
`;

const GHLink = styled.a`
  color: #ffffff73;
  text-decoration: none;
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height:100vh;
  max-height:1400px;
`;

const MainContent = styled.div`
  width: 100%;
  height:100%;
  max-width:900px;
  padding-right:10px;
  padding-left:10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Footer = styled.div`
  width:100%;
  color: #ffffff73;
  padding:2vh;
  display:flex;
  align-items:center;
  flex-direction:column;
  font-size:2vh;
`;

const GithubIcon = styled.i`
  margin-left: 10px;
  margin-right: 10px;
  cursor: pointer;
`;

const LoadingY = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 500px;
`;

const LoadingStack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoadingX = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
`;

const LoadingHeading = styled.span`
  font-size: 50px;
  font-weight: bold;
  margin-bottom: 10px;
`;
const LoadingSub = styled.span`
  font-size: 25px;
`;
