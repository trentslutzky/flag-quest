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

const GHLink = styled.a`
  color: #ffffff73;
  text-decoration: none;
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MainContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Footer = styled.div`
  color: #ffffff73;
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
