import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { supabase } from "../supabaseClient";

export function Leaderboard(props) {
  const [rows, setRows] = useState([
    { username: "loading...", score: "" ,country:null},
    { username: "loading...", score: "" ,country:null},
    { username: "loading...", score: "" ,country:null},
    { username: "loading...", score: "" ,country:null},
    { username: "loading...", score: "" ,country:null},
    { username: "loading...", score: "" ,country:null},
    { username: "loading...", score: "" ,country:null},
    { username: "loading...", score: "" ,country:null},
    { username: "loading...", score: "" ,country:null},
    { username: "loading...", score: "" ,country:null},
  ]);

  async function getRows() {
    const { data, error } = await supabase.rpc("get_leaderboard");
    if (error) {
      console.log(error);
      return;
    }
    var temp_rows = data;
    while (temp_rows.length < 10) {
      temp_rows.push({ username: "", score: "-" });
    }
    setRows(temp_rows);
  }

  useEffect(() => {
    getRows();
  }, []);

  return (
    <Page>
      <LeaderboardContainer>
        {rows.map((r, i) => (
          <LeaderboardRow key={i}>
            <PlaceNum>{i + 1}</PlaceNum>
            <Username>{r.username}</Username>
            <Space/>
            {i == 0 && <Crown>👑</Crown>}
            <Score>{r.score}</Score>
          </LeaderboardRow>
        ))}
      </LeaderboardContainer>
    </Page>
  );
}

const Page = styled.div`
  width: 100%;
  border-radius: 0.3em;
  display: flex;
  flex-direction: column;
  align-items: center;
  height:90%;
`;

const LeaderboardContainer = styled.div`
  width: 100%;
  margin-top: 5px;
  height:100%;
`;

const LeaderboardRow = styled.div`
  background: #00000026;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 4px;
  height:10%;
  padding-left:3%;
  padding-right:3%;
  font-size: 3vh;
`;

const Crown = styled.span`
  width: 10%;
`;

const PlaceNum = styled.span`
  margin-right: 5%;
  text-align: center;
`;

const Space = styled.div`
  flex-grow: 1;
`;

const Username = styled.span`
`;

const Score = styled.span`
  text-align: center;
`;

const MiniFlag = styled.img`
  height:40%;
  margin-left:3%;
  font-size:9px;
`;
