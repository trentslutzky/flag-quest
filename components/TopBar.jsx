import React from "react";
import styled from "styled-components";
import Link, { useHistory } from "react-router-dom";

export function TopBar() {
  let history = useHistory();

  function goToLocation(loc) {
    history.push(loc);
  }

  return (
    <TopBarContainer>
      <TitleLine onClick={() => goToLocation("/")}>
        <FlagIcon className="fas fa-flag"></FlagIcon>
        <Title>Flag Quest</Title>
      </TitleLine>
      <ButtonsLine>
        <RightIcon
          onClick={() => goToLocation("/leaderboard")}
          className="fas fa-list-ol"
        ></RightIcon>
      </ButtonsLine>
    </TopBarContainer>
  );
}

const TopBarContainer = styled.div`
  width: 100%;
  max-width: 900px;
  margin-top: 10px;
  margin-bottom: 15px;
  font-size: 30px;
  @media (max-width: 800px) {
    font-size: 4vw;
  }
`;

const TitleLine = styled.div`
  display: inline-flex;
  align-items: center;
  &:hover {
    transform: scale(1.03);
  }
  cursor: pointer;
`;

const FlagIcon = styled.i`
  margin-right: 15px;
  margin-left: 7px;
`;

const RightIcon = styled.i`
  margin-left: 15px;
  margin-right: 7px;
  &:hover {
    transform: scale(1.03);
  }
  cursor: pointer;
`;

const Title = styled.p`
  margin: 0px;
`;

const ButtonsLine = styled.div`
  float: right;
`;
