import React, { useEffect, useState } from "react";
import Countries from "countries-api";
import styled from "styled-components";

import { supabase } from "../supabaseClient";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export function Game() {
  const [allCountries, setAllCountries] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [randomCountries, setRandomCountries] = useState(null);
  const [activeCountryIndex, setActiveCountryIndex] = useState(null);
  const [streak, setStreak] = useState(0);

  // streak modal
  const [showStreakModal, setShowStreakModal] = useState(false);

  // stuff for scorekeeping
  const [username, setUsername] = useState("");
  const [savingScore, setSavingScore] = useState(false);
  const [savingText, setSavingText] = useState("Saving to leaderboard...");
  var username_max_length = 10;

  var correct_texts = ["Yes!", "Correct!", "Yep.", "Smart.", "Nice."];
  var incorrect_texts = ["Incorrect.", "Nope.", "No.", "Really?", "Wrong."];
  var hmm_texts = [
    "What country is this?",
    "You should know this one.",
    "Take a guess.",
    "An easy one.",
  ];

  // don't include these because they don't have 
  // flags, or they are territories or something else
  var blacklist = [
    "PM",
    "GP",
    "GF",
    "PF",
    "MQ",
    "YT",
    "RE",
    "BL",
    "MF",
    "BV",
    "CC",
    "FA",
    "FK",
    "SJ",
    "TC",
    "CX",
    "TF",
    "MP",
    "IO",
    "FO",
    "PN",
    "AX",
    "KY",
    "NF",
    "HM",
    "UM",
    "WF",
  ];

  const answer_delay = 1000;

  function newCountry() {
    var num_countries = allCountries.length;
    var country_ints = [];
    var countries = [];
    while (country_ints.length < 4) {
      var randomCountryIndex = getRandomInt(0, num_countries - 1);
      if (!country_ints.includes(randomCountryIndex)) {
        if (!blacklist.includes(allCountries[randomCountryIndex].cca2)) {
          country_ints.push(randomCountryIndex);
          countries.push(allCountries[randomCountryIndex]);
        }
      }
    }
    setActiveCountryIndex(Math.floor(Math.random() * 4));
    setRandomCountries(countries);
  }

  useEffect(() => {
    if (!loaded) {
      var res = Countries.findAll();
      setAllCountries(res.data);
      setLoaded(true);
    }
    if (allCountries != null && randomCountries == null) {
      newCountry();
    }
  });

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  if (randomCountries == null) {
    return (
      <>
        <p>Loading...</p>
      </>
    );
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function answerClicked(e) {
    var answer_correct = e.target.id == randomCountries[activeCountryIndex].id;
    var flag = document.getElementById("flag");
    var status_text = document.getElementById("status_text");

    flag.classList.remove("scale-in-center");

    var buttons = document.getElementsByClassName("answer_button");
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
      var this_correct =
        buttons[i].id == randomCountries[activeCountryIndex].id;
      if (this_correct) {
        buttons[i].style.backgroundColor = "#279900";
      }
    }

    if (answer_correct) {
      e.target.style.backgroundColor = "#279900";
      status_text.innerText =
        correct_texts[Math.floor(Math.random() * correct_texts.length)];
      setStreak(streak + 1);
      flag.classList.add("heartbeat");
    } else {
      flag.classList.add("shake-horizontal");
      e.target.style.backgroundColor = "#900";
      status_text.innerText =
        incorrect_texts[Math.floor(Math.random() * incorrect_texts.length)];
      if (streak < 5) {
        // streak less than 5. just restart.
        setStreak(0);
      } else {
        // streak > 5. trigger a score save.
        setShowStreakModal(true);
      }
    }
    sleep(answer_delay).then(() => {
      flag.style.display = "block";
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = false;
      }
      newCountry();
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].style.backgroundColor = "white";
      }
      status_text.innerText =
        hmm_texts[Math.floor(Math.random() * hmm_texts.length)];
      flag.classList.remove("shake-horizontal");
      flag.classList.remove("heartbeat");
    });
  }

  function usernameChange(username) {
    username = username.substring(0, username_max_length);
    username = username.replace(" ", "");
    setUsername(username);
  }

  async function saveScore() {
    setSavingText("Saving to leaderboard...");
    setSavingScore(true);
    const my_country = await getUserCountry()
    await delay(200);
    const { data, error } = await supabase
      .from("leaderboard")
      .insert({ username: username, score: streak });
    if (error) {
      setSavingText("something went wrong...");
      return;
    }
    setSavingText("Saved!");
    await delay(2000);
    setSavingScore(false);
    setShowStreakModal(false);
    setStreak(0);
  }

  function cancelSaveScore() {
    setShowStreakModal(false);
    setStreak(0);
  }

  return (
    <>
      <FlagContainer id="flag_container">
        {streak == 0 && <StreakText></StreakText>}
        {streak > 0 && streak <= 5 && <StreakText>Streak: {streak}</StreakText>}
        {streak > 5 && streak <= 10 && (
          <StreakTextBig>Streak: {streak} 🤓</StreakTextBig>
        )}
        {streak > 10 && (
          <StreakTextBigger>Streak: {streak} 🤯</StreakTextBigger>
        )}
        <MainFlag
          id="flag"
          src={
            "flags/" +
            randomCountries[activeCountryIndex].cca2.toLowerCase() +
            ".svg"
          }
          alt="couldn't load flag..."
          className="scale-in-center"
        />
      </FlagContainer>
      <StatusText id="status_text">Which country?</StatusText>
      <ButtonsRow>
        <CountryButton
          id={randomCountries[0].id}
          className="answer_button"
          onClick={answerClicked}
        >
          {randomCountries[0].name.common}
        </CountryButton>
        <CountryButton
          id={randomCountries[1].id}
          className="answer_button"
          onClick={answerClicked}
        >
          {randomCountries[1].name.common}
        </CountryButton>
      </ButtonsRow>
      <ButtonsRow>
        <CountryButton
          id={randomCountries[2].id}
          className="answer_button"
          onClick={answerClicked}
        >
          {randomCountries[2].name.common}
        </CountryButton>
        <CountryButton
          id={randomCountries[3].id}
          className="answer_button"
          onClick={answerClicked}
        >
          {randomCountries[3].name.common}
        </CountryButton>
      </ButtonsRow>
      {showStreakModal && (
        <ModalContainer>
          <ModalCard>
            <ModalHeading>wrong!</ModalHeading>
            <ModalScore>{streak}</ModalScore>
            <ModalHeadingTwo>Correct countries in a row.</ModalHeadingTwo>
            <ModalHeadingThree>
              Enter a username to save to leaderboard
            </ModalHeadingThree>
            <UsernameInput
              autocomplete="off"
              value={username}
              onChange={(e) => {
                usernameChange(e.target.value);
              }}
              disabled={savingScore}
            />
            {savingScore ? (
              <SavingText>{savingText}</SavingText>
            ) : (
              <>
                <ScoreSubmitButton onClick={saveScore}>
                  Submit
                </ScoreSubmitButton>
                <ScoreCancelButton onClick={cancelSaveScore}>
                  Cancel
                </ScoreCancelButton>
              </>
            )}
          </ModalCard>
        </ModalContainer>
      )}
    </>
  );
}

const FlagContainer = styled.div`
  background-color: #0000003b;
  display: flex;
  height:40%;
  min-height:40%;
  flex-direction: column;
  width: 100%;
  margin-bottom: 6px;
  border-radius: 0.25em;
`;

const ButtonsRow = styled.div`
  margin-right:-40px;
  margin-left:-40px;
  display:flex;
  width: 103%;
  max-width: 103%;
  height:25%;
`;

const CountryButton = styled.button`
  width: 50%;
  height: 95%;
  background-color: white;
  border: none;
  color:black;
  margin:10px;
  border-radius: 4px;
  padding: 6px;
  font-family: "Montserrat", sans-serif;
  cursor: pointer;
  &:hover {
    background-color: #e2e2e2;
    scale: 1.01;
  }
  &:disabled {
    color: white;
  }
  font-size: 30px;
  @media (max-width: 800px) {
    font-size: 4vw;
  }
`;

const MainFlag = styled.img`
  height:100%;
  display: block;
  margin-bottom:3%;
  margin-right:3%;
  margin-left:3%;
`;

const StatusText = styled.h1`
  text-align: center;
  margin: 10px;
  font-size: 30px;
  @media (max-width: 800px) {
    font-size: 4vw;
    margin:0;
  }
`;

const FlagIcon = styled.i`
  color: white;
  font-size: 25px;
  margin-left: 10px;
  margin-right: 10px;
`;

const StreakText = styled.h1`
  width: 100%;
  text-align: center;
  z-index: 999;
  transition: all 0.5s;
  font-size: 30px;
  @media (max-width: 800px) {
    font-size: 4vw;
  }
`;

const StreakTextBig = styled(StreakText)`
  color: #98ff98;
  font-size: 35px;
  @media (max-width: 800px) {
    font-size: 5vw;
  }
`;

const StreakTextBigger = styled(StreakText)`
  color: #ffde5b;
  font-size: 37px;
  @media (max-width: 800px) {
    font-size: 5vw;
  }
`;

const ModalContainer = styled.div`
  position: absolute;
  background: #000000d4;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 9999;
`;

const ModalCard = styled.div`
  width: 100%;
  background: #84bedae0;
  margin-top: 100px;
  border-radius: 5px;
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 15px;
  padding-bottom: 15px;
`;

const ModalHeading = styled.span`
  font-size: 23px;
  color: #e94747;
  text-align: center;
`;

const ModalHeadingTwo = styled(ModalHeading)`
  color:white;
  font-size: 16px;
`;

const ModalHeadingThree = styled(ModalHeading)`
  font-size: 17px;
  margin-top: 23px;
  color: #4863cc;
`;

const ModalScore = styled.span`
  font-size: 103px;
  margin: -3px;
  background: #003b4a;
  background: -webkit-linear-gradient(to top, #003b4a 0%, #165987 41%);
  background: -moz-linear-gradient(to top, #003b4a 0%, #165987 41%);
  background: linear-gradient(to top, #003b4a 0%, #165987 41%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const UsernameInput = styled.input`
  font-family: Montserrat;
  font-size: 20px;
  margin-top: 17px;
  background: #ffffffe8;
  border: none;
  border-radius: 4px;
  padding: 9px;
  text-align: center;
`;

const ScoreSubmitButton = styled.button`
  font-size: 20px;
  font-family: Montserrat;
  background: #4863cc;
  border: none;
  border-radius: 4px;
  margin-top: 16px;
  width: 59%;
  height: 35px;
  color: white;
  cursor: pointer;
  margin-bottom: 9px;
  &:hover {
    background: #3151cd;
  }
  &:active {
    background: #1b40ce;
  }
`;

const ScoreCancelButton = styled(ScoreSubmitButton)`
  background: #d36666;
  &:hover {
    background: #d83e3e;
  }
  &:active {
    background: #d32f2f;
  }
`;

const SavingText = styled.span`
  margin: 50px;
  font-size: 17px;
  color: white;
`;
