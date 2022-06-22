import React, { useEffect, useState } from 'react'
import logo from "../../assets/img/icon-logo.png";
import power from "../../assets/img/icon-switch-colored.png";
import { useLocation, Link } from 'react-router-dom';
import { apiEndPoint } from "../../config";
import user from "../../assets/img/profile.svg";
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from '@fortawesome/free-solid-svg-icons';
library.add(faBars);

const style = {
  imgContainer: {
    width: 40
  },
  navbarBrand: {
    fontSize: 15,
    padding: 0,
    margin: 0
  }
}
const Header = (props) => {
  const location = useLocation();
  const [agentName, setAgentName] = useState("");
  const [isManager, setManager] = useState(false);
  const [online, setAgentOnline] = useState(false);
  const [nav, setNav] = useState(false);

  useEffect(() => {
    const agentName = localStorage.getItem("agentName");
    const isManager = JSON.parse(localStorage.getItem("manager"));
    setAgentName(agentName);
    setManager(isManager);
    setAgentOnline(props.online);
  });

  const logout = () => {
    setAgentOffline();
  }

  const setAgentOffline = (status) => {
    let agentId = localStorage.getItem("agentId");
    let payload = {
      agentId: agentId,
      status: false
    }

    const apiUrl = `${apiEndPoint}/api/enqueueagent`;

    axios.post(apiUrl, payload).then((data) => {
      localStorage.clear();
      window.location.reload();
    }).catch((error) => {
      console.log(error);
    });
  }

  const toggleNav = () => {
    setNav(!nav);
  }

  return (
    <React.Fragment>
      <nav className="navbar navbar-custom">
        <div className="container-fluid" style={{ height: 59 }}>
          <div className="navbar-header d-flex">
            <div className="img-container" style={style.imgContainer} >
              <img src={logo} style={{ width: 35 }} alt="Colive" />
            </div>
            <div className="brand-container">
              <a className="navbar-brand text-uppercase" style={style.navbarBrand} href="#">Colive</a>
              <div className="sub-header" style={{ fontSize: 7 }}>Power of Co.</div>
            </div>
          </div>
          <ul className="nav navbar-nav mr-auto ml-5 custom-tabs">
            <li className={`${location.pathname === '/dashboard' ? 'active' : ''}`}>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className={`${location.pathname === '/conversation' ? 'active' : ''}`}>
              <Link to="/conversation">Conversation</Link>
            </li>
            {/* <li className={`${location.pathname === '/chat-settings' ? 'active' : ''}`}>
              <Link to="/chat-settings">Chat Settings</Link>
              </li> */}
          </ul>
          <ul className="profile ml-auto">
            <li className="image-container mr-2 position-relative">
              <img src={user} alt={agentName} />
              <span className={`status ${online ? 'online' : null}`}></span>
            </li>
            <li className="flex-column">
              <span>{agentName}</span>
              {isManager ? (
                <span className="manager">Manager</span>
              ) : ('')}
            </li>
          </ul>
          <ul className="nav navbar-nav small nav-icons-container">
            {/* <li><Link to="/faq" ><button className="icon"><div className="help-icon">?</div></button></Link></li> */}
            {/* <li><button className="icon"><img src={home} alt="home" /></button></li> */}
            <li><button className="icon"><img src={power} alt="Logout" onClick={logout} /></button></li>
          </ul>
          <button className="navbar-toggler" type="button" onClick={toggleNav} aria-label="Toggle navigation">
            <span className="navbar-toggler-icon">
              <FontAwesomeIcon icon={["fa", "bars"]} />
            </span>
          </button>
        </div>
        {
          nav ? (
            <div className="container-fluid p-0 mobile-menu">
              <div className="navbar-collapse">
                <ul className="navbar-nav">
                  <li className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                    <Link className="nav-link" to="/dashboard">Dashboard</Link>
                  </li>
                  <li className={`nav-item ${location.pathname === '/conversation' ? 'active' : ''}`}>
                    <Link className="nav-link" to="/conversation">Conversation</Link>
                  </li>
                </ul>
              </div>
            </div>
          ) : null
        }

      </nav>
    </React.Fragment>
  )
};

export default Header;
