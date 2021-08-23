import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import { Formik, Field, Form } from "formik";
import * as Yup from 'yup';
import Cookies from 'js-cookie'
    
export function Account(props){

    var userData = props.userData;
    var url = props.url;
    var API_KEY = props.API_KEY;

    const [isSubmitting, setSubmitting] = useState(false); 
    const [errorMessage, setErrorMessage] = useState(null);

    function RegisterFormSubmit(values){
        setSubmitting(true);
        delete values.password_confirm
        fetch(url+'/register?api_key='+API_KEY,{
            method:'POST',
            mode:'cors',
            headers:{'Content-Type': 'application/json'},
            body:JSON.stringify(values)
        }).then(res => res.json()).then((result)=>{
            if(result.status == true){
                Cookies.set('auth_token',result.token);
                window.location.reload(false);
                document.getElementById("register_form_form").reset();
                setSubmitting(false);
            } else {
                console.log(result.message)
                setErrorMessage(result.message)
                document.getElementById("register_form_form").reset();
                setSubmitting(false);
            }
        })
    }

    function handleLogOut(){
        Cookies.remove('auth_token');
        window.location.reload(false);
    }

    function LogInFormSubmit(values){
        setSubmitting(true);
        fetch(url+'/log_in?api_key='+API_KEY,{
            method:'POST',
            mode:'cors',
            headers:{'Content-Type': 'application/json'},
            body:JSON.stringify(values)
        }).then(res => res.json()).then((result)=>{
            if(result.status == true){
                Cookies.set('auth_token',result.token);
                window.location.reload(false);
                document.getElementById("login_form_form").reset();
                setSubmitting(false);
            } else {
                console.log(result.message)
                setErrorMessage(result.message)
                document.getElementById("login_form_form").reset();
                setSubmitting(false);
            }
    }

    function handleLoginSelected(){
        var options_div = document.getElementById("account_options");
        var login_form = document.getElementById("login_form");
        var back_button = document.getElementById("back_button");
        back_button.style.display = "block";
        options_div.style.display = "none";
        login_form.style.display = "flex";
    }
    function handleRegisterSelected(){
        var options_div = document.getElementById("account_options");
        var register_form = document.getElementById("register_form");
        var back_button = document.getElementById("back_button");
        back_button.style.display = "block";
        options_div.style.display = "none";
        register_form.style.display = "flex";
    }
    function handleBackButton(){
        var options_div = document.getElementById("account_options");
        var register_form = document.getElementById("register_form");
        var back_button = document.getElementById("back_button");
        back_button.style.display = "none";
        options_div.style.display = "flex";
        login_form.style.display = "none";
        register_form.style.display = "none";
    }

    const RegisterSchema = Yup.object().shape({
        username: Yup.string()
            .required('Required')
            .matches(/^(?=.{1,999}$)(?![_.-])(?!.*[_.-]{2})[a-zA-Z0-9_-]+$/,'Username contains invalid characters')
            .min(3,'Username too short.')
            .max(15,'Username too long.')
            .trim(),
        email: Yup.string()
            .required('Required')
            .email('Invalid email')
            .trim(),
        password: Yup.string()
            .min(8,'password should be at least 8 characters.')
            .required('Required'),
        password_confirm: Yup.string()
            .required('Required')
            .oneOf([Yup.ref("password")],'Passwords do not match')
    });

    if(userData == null){
    return(
        <AccountPage>
            <BackButton 
                className="fas fa-arrow-left" 
                id="back_button"
                onClick={handleBackButton}
            >
            </BackButton>
            <AccountOptions id="account_options">
                <LogInMessage>Register or log in to save and view account stats and place on the leaderboards.</LogInMessage>
                <AccountButton onClick={handleLoginSelected}>Log In</AccountButton>
                <OrText>or</OrText>
                <AccountButton onClick={handleRegisterSelected}>Register</AccountButton>
            </AccountOptions>
            <Formik
                initialValues={{username:"",email:"",password:"",password_confirm:""}}
                validationSchema={RegisterSchema}
                onSubmit={(values) => {RegisterFormSubmit(values);}}
            >
                {({errors,touched}) => (
                    <Form id="register_form_form">
                        <AccountForm id="register_form">
                            <FormHeading>Register</FormHeading>
                            <ErrorMessage id="error_message">{errorMessage}</ErrorMessage>
                            <AccountField 
                                name="username" 
                                type="text"
                                placeholder="username"
                            />
                            {errors.username && touched.username ? (
                                <FieldError>{errors.username}</FieldError>
                            ) : null}
                            <AccountField 
                                name="email" 
                                type="email"
                                placeholder="email"
                            />
                            {errors.email && touched.email ? (
                                <FieldError>{errors.email}</FieldError>
                            ) : null}
                            <AccountField 
                                name="password" 
                                type="password"
                                placeholder="password"
                            />
                            {errors.password && touched.password ? (
                                <FieldError>{errors.password}</FieldError>
                            ) : null}
                            <AccountField
                                name="password_confirm" 
                                type="password"
                                placeholder="confirm password"
                            />
                            {errors.password_confirm && touched.password_confirm ? (
                                <FieldError>{errors.password_confirm}</FieldError>
                            ) : null}
                            <AccountButton 
                                disabled = {isSubmitting}
                                type="submit"
                            >Register</AccountButton>
                        </AccountForm>
                    </Form>
                )}
            </Formik>
            <Formik
                initialValues={{email:'',password:'',remember:false}}
                onSubmit={(values) => {LogInFormSubmit(values);}}
            >
                {({errors,touched}) => (
                    <Form>
                        <AccountForm id="login_form">
                            <LogInHeading>Log In</LogInHeading>
                            <AccountField 
                                name="email" 
                                type="email"
                                placeholder="email"
                            />
                            {errors.email && touched.email ? (
                                <FieldError>{errors.email}</FieldError>
                            ) : null}
                            <AccountField 
                                name="password" 
                                type="password"
                                placeholder="password"
                            />
                            {errors.password && touched.password ? (
                                <FieldError>{errors.password}</FieldError>
                            ) : null}
                            <RememberLine>
                                <RememberCheckbox type="checkbox" name="remember"></RememberCheckbox>
                                <span>Stay logged in</span>
                            </RememberLine>
                            <AccountButton 
                                disabled = {isSubmitting}
                                type="submit"
                            >Log In</AccountButton>
                        </AccountForm>
                    </Form>
                )}
            </Formik>
            <BottomSpacer/>
        </AccountPage>
    )} else {
        return(
            <>
                <AccountPage>
                    <UsernameLine>
                        <UsernameHeading>{userData.username}</UsernameHeading>
                        <LogOutButton onClick={handleLogOut}>
                            <i className="fas fa-sign-out-alt"></i>
                            <p>Log Out</p>
                        </LogOutButton>
                    </UsernameLine>
                </AccountPage>
                <BottomSpacer/>
            </>
        )
    }
}

const AccountPage = styled.div`
    width:100%;
    max-width:490px;
    border-radius: 0.3em;
    margin-top: -10px;
`;

const AccountHeading = styled.h1`
    margin:0px;
    padding-left:9px;
    padding-top:4px;
`;

const LogInMessage = styled.p`
    margin-top:5px;
    padding-left:10px;
    padding-right:10px;
    font-size:18px;
`;

const FormHeading = styled(AccountHeading)`
    margin-bottom:5px;
`;

const LogInHeading = styled(FormHeading)`
`;

const AccountForm = styled.div`
    display:flex;
    flex-direction:column;
    display:none;
`;

const AccountField = styled(Field)`
    margin-left: 11px;
    margin-right: 11px;
    font-size: 20px;
    background-color: #00000029 !important;
    color: white !important;
    border: none;
    margin-top: 6px;
    border-radius: 5px;
    padding: 6px;
    max-width: 460px;
    width: 92%;
    font-family:'Montserrat', sans-serif;
`;

const AccountButton = styled.button`
    margin-left: 11px;
    margin-right: 11px;
    max-width: 460px;
    width: 95%;
    padding: 6px;
    margin-top: 6px;
    background: white;
    border-radius: 5px;
    border: none;
    font-size: 16px;
    cursor:pointer;
    &:hover{
        background:#e7e7e7;
    }
    &:disabled{
        background:#ffffff4f;
    }
    font-family:'Montserrat', sans-serif;
`;

const FieldError = styled.div`
    margin-left:11px;
`;

const RememberLine = styled.div`
    display:inline-flex;
    align-items:center;
`;

const RememberCheckbox = styled.input`
    margin-left: 11px;
    height: 20px;
    width: 20px;
    margin-right: 10px;
    margin-top: 9px;
`;

const AccountOptions = styled.div`
    display:flex;
    flex-direction:column;
`;

const OrText = styled.h3`
    font-size:20px;
    text-align:center;
    margin:0px;
    margin-top:3px;
`;

const Or = styled.p``;

const BottomSpacer = styled.div`
    width:100%;
    height:50px;
`;

const BackButton = styled.i`
    font-size: 25px;
    background: #0000002b;
    width: 55px;
    text-align: center;
    padding: 6px;
    border-radius: 10px;
    margin-left: 9px;
    display:none;
    cursor:pointer;
    &:hover{
        background: #0000005c;
    }
`;

const UsernameLine = styled.div`
    position:relative;
`;

const UsernameHeading = styled.h1`
    margin:0px;
    margin-top:-8px;
`;

const LogOutButton = styled.div`
    display: inline-flex;
    align-items: center;
    font-size: 17px;
    margin-left: 9px;
    background-color: #00000021;
    height: 14px;
    padding: 7px;
    border-radius: 7px;
    cursor:pointer;
    &:hover{
        background:#00000045;
    }
    position:absolute;
    right:0px;
    top:5px;
`;

const ErrorMessage = styled.p`
    margin:0px;
    margin-left:11px;
    color:black;
    font-size:19px;
`;
