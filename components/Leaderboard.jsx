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
      temp_rows.push({ username: "-", score: "-" });
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
            {r.country &&
              <MiniFlag
                src={
                  "flags/" +
                    r.country.toLowerCase() +
                  ".svg"
                }
                alt={r.country}
              />
            }
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
  max-width: 490px;
  border-radius: 0.3em;
  margin-top: -10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LeaderboardContainer = styled.div`
  width: 100%;
  max-width: 350px;
  margin-bottom: 10px;
  min-height: 461px;
`;

const LeaderboardRow = styled.div`
  padding: 12px;
  background: #00000026;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 4px;
`;

const Crown = styled.span`
  width: 25px;
`;

const PlaceNum = styled.span`
  width: 12px;
  margin-right: 12px;
  text-align: center;
`;

const Space = styled.div`
  flex-grow: 1;
`;

const Username = styled.span`
`;

const Score = styled.span`
  margin-right: 10px;
  text-align: center;
`;

const MiniFlag = styled.img`
  height:15px;
  margin-left:10px;
  font-size:9px;
`;
