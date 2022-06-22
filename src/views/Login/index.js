import React, { useEffect } from "react";
import logo from "../../assets/img/icon-logo.png";
import { useHistory } from "react-router-dom";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { apiEndPoint } from "../../config";
import axios from 'axios';

const Login = (props) => {
    let history = useHistory();
    const [emailValue, setEmail] = React.useState("");
    const [passwordValue, setPassword] = React.useState("");


    useEffect(() => {
        console.log(props);
        if(props.authed){
            history.push("/dashboard");
        }
    }, []);

    const login = (e) => {
        e.preventDefault();

        let payload = {
            email: emailValue,
            password: passwordValue
        }

        const apiUrl = `${apiEndPoint}/loginagent`;

        axios.post(apiUrl, payload).then((data) => {

            //console.log(data);
            let resp = data.data;
            localStorage.setItem("token", resp.token);
            localStorage.setItem("agentId", resp.agentId);
            localStorage.setItem("agentName", resp.agentName);
            let manager = false;
            if (resp.manager) {
                manager = true;
            }
            localStorage.setItem("manager", manager);
            window.location.reload();
        }).catch((error) => {
            //console.log(error.response);
            NotificationManager.error('', error.response.data);
        });
    }


    const handleInputChange = (e) => {
        if (e.target.name === 'email') {
            setEmail(e.target.value);
        } else if (e.target.name === 'password') {
            setPassword(e.target.value);
        }
    }


    return (
        <div className="container-fluid login-bg d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
            <div className="login-box">
                <div className="header text-center">
                    <img src={logo} style={{ width: 40 }} alt="Colive" />
                    <h3 className="text-uppercase">Colive</h3>
                    <div>Power of Co</div>
                    <h3 className="font-600">Agent Interaction Hub</h3>
                </div>
                <form onSubmit={login}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <i className="fa fa-envelope icon"></i>
                        <input type="email" name="email" value={emailValue} onChange={handleInputChange} className="form-control" id="email" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="pwd">Password</label>
                        <i className="fa fa-envelope icon"></i>
                        <input type="password" name="password" value={passwordValue} onChange={handleInputChange} className="form-control" id="pwd" required />
                    </div>
                    <div className="form-group text-center">
                        <button className="btn btn-custom">Login</button>
                    </div>
                </form>
            </div>
            <NotificationContainer />
        </div>
    )
};

export default Login;
