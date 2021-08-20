import React, {useEffect, useState} from 'react';
import Countries from 'countries-api';
import styled from 'styled-components';

export default function App(){

    const [allCountries, setAllCountries] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [randomCountries, setRandomCountries] = useState(null);
    const [activeCountryIndex, setActiveCountryIndex] = useState(null);
    const [streak, setStreak] = useState(0);

    var correct_texts = ['Yes!','Correct!','Yep.','Smart.','Nice.']
    var incorrect_texts = ['Incorrect.','Nope.','No.','Really?','Wrong.']
    var hmm_texts = ['What country is this?','You should know this one.','Take a guess.','An easy one.']

    // don't include these because they don't have flags
    var french_overseas = ['PM','GP','GF','PF','MQ','YT','RE','BL','MF']

    function newCountry(){
        var num_countries = allCountries.length;
        var country_ints = []
        var countries = []
        while(country_ints.length < 4){
            var randomCountryIndex = getRandomInt(0,num_countries-1);
            if(!country_ints.includes(randomCountryIndex)){
                if(!french_overseas.includes(allCountries[randomCountryIndex].cca2)){
                    country_ints.push(randomCountryIndex);
                    countries.push(allCountries[randomCountryIndex]);
                }
            }
        }
        setActiveCountryIndex(Math.floor(Math.random() * 4));
        setRandomCountries(countries);
    }

    useEffect(()=>{
        if(!loaded){
            var res = Countries.findAll();
            setAllCountries(res.data);
            setLoaded(true);
        }
        if(allCountries != null && randomCountries == null){
            newCountry();
        }
    })

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

    if(randomCountries == null){
        return(
            <>
                <p>Loading...</p>
            </>
        )
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function answerClicked(e){
        var answer_correct = (e.target.id == randomCountries[activeCountryIndex].id);
        var flag = document.getElementById("flag");
        var status_text = document.getElementById("status_text");

        flag.classList.remove("scale-in-center");

        var buttons = document.getElementsByClassName("answer_button");
        for(let i = 0; i < buttons.length; i++){
            buttons[i].disabled = true;
            var this_correct = (buttons[i].id == randomCountries[activeCountryIndex].id);
            if(this_correct){
                buttons[i].style.backgroundColor = "#279900";
            }
        }

        if(answer_correct){
            e.target.style.backgroundColor = "#279900";
            status_text.innerText = correct_texts[Math.floor(Math.random() * correct_texts.length)];
            setStreak(streak+1);
            flag.classList.add("heartbeat");
        } else {
            e.target.style.backgroundColor = "#900";
            status_text.innerText = incorrect_texts[Math.floor(Math.random() * incorrect_texts.length)];
            setStreak(0);
            flag.classList.add("shake-horizontal");
        }
        sleep(1000).then(()=>{
            flag.style.display = "block";
            for(let i = 0; i < buttons.length; i++){
                buttons[i].disabled = false;
            }
            newCountry();
            for(let i = 0; i < buttons.length; i++){
                buttons[i].style.backgroundColor = "white";
            }
            status_text.innerText = hmm_texts[Math.floor(Math.random() * hmm_texts.length)];
            flag.classList.remove("shake-horizontal");
            flag.classList.remove("heartbeat");
            flag.classList.add("scale-in-center");
        })
    }

    return(
        <>
            <MainContainer>
                <TitleContainer>
                    <Title>Flag Quest</Title>
                    <StreakText>Streak: {streak}</StreakText>
                </TitleContainer>
                <FlagContainer id="flag_container">
                    <MainFlag 
                        id="flag" 
                        src={randomCountries[activeCountryIndex].cca2.toLowerCase()+".svg"}
                        className="scale-in-center"
                    />
                </FlagContainer>
                <StatusText id="status_text">Which country?</StatusText>
                <ButtonsRow>
                    <CountryButton 
                        id={randomCountries[0].id}
                        className="answer_button"
                        onClick={answerClicked}>
                        {randomCountries[0].name.common}
                    </CountryButton>
                    <CountryButton 
                        id={randomCountries[1].id}
                        className="answer_button"
                        onClick={answerClicked}>
                        {randomCountries[1].name.common}
                    </CountryButton>
                </ButtonsRow>
                <ButtonsRow>
                    <CountryButton 
                        id={randomCountries[2].id}
                        className="answer_button"
                        onClick={answerClicked}>
                        {randomCountries[2].name.common}
                    </CountryButton>
                    <CountryButton 
                        id={randomCountries[3].id}
                        className="answer_button"
                        onClick={answerClicked}>
                        {randomCountries[3].name.common}
                    </CountryButton>
                </ButtonsRow>
                <BottomSpace/>
                <Footer>
                    <p>Created by TrentLS</p>
                </Footer>
            </MainContainer>
        </>
    )
}

const FlagContainer = styled.div`
    background-color: #0000000f;
    max-width:490px;
    display:flex;
    flex-direction:column;
    width:98%;
    margin-bottom:6px;
    border-radius:0.25em;
`;

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ButtonsRow = styled.div`
    display:flex;
    width:100%;
    max-width:500px;
`;

const CountryButton = styled.button`
    width: 50%;
    height: 110px;
    background-color: white;
    border: none;
    font-size: 18px;
    margin:10px;
    border-radius:4px;
    padding:6px;
    font-family: 'Montserrat', sans-serif;
    cursor:pointer;
    &:hover{
        background-color: #e2e2e2;
        scale:1.01;
    }
    &:disabled{
        color:white;
    }
`;

const MainFlag = styled.img`
    height:200px;
    margin:25px;
    display:block;
`;

const Title = styled.h1`
    text-align:center;
    color:white;
    margin:0px;
`;

const TitleContainer = styled.div`
    background: transparent;
    width: 98%;
    max-width: 490px;
    margin-bottom: 20px;
    margin-top: 20px;
    border-radius: 0.5em;
    color:white;
`;

const StatusText = styled.h1`
    text-align:center;
    margin:10px;
    font-size:20px;
`;

const Footer = styled.div`
   position:absolute;
   bottom:0px;
`;

const StreakText = styled.p`
    text-align:center;
    margin:0px;
    font-size:20px;
`;

const BottomSpace = styled.div`
    width:100%;
    height:52px;
`;
