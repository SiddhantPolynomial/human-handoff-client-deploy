import React, { useEffect, useState } from "react";
import user from "../../assets/img/profile.svg";
import Header from "../Header";
import { useHistory } from "react-router-dom";
import { apiEndPoint } from "../../config";
import axios from 'axios';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';



const Dashboard = () => {
  let history = useHistory();
  const moveToChat = () => {
    history.push("/conversation");
  }


  //analytics default structure
  const obj = {
    goals: {
      yesterdaysPerformance: {},
      todaysPerformance: {}
    },
    todaysUpdates: {}
  }

  const agentId = localStorage.getItem('agentId');

  const filterLabels = {
    noOfUsers: "Number of users",
    noOfLeads: "Number of leads",
    noOfConversations: "Number of conversations",
    avgConversationLength: "Average conversation length",
    channelWisePerformance: "Channel wise performance"
  }

  const [agentName, setAgentName] = useState(null);
  const [analytics, setAnalytics] = useState(obj);
  const [data, setChartData] = useState([]);
  const [filter, setFilter] = useState("noOfUsers");
  
  useEffect(() => {
    let agentName = localStorage.getItem('agentName');
    
    setAgentName(agentName);
    getAnalytics(agentId);
    getCharts(filter, "month");
    //getCharts("noOfConversations", "month");
    //getCharts("avgConversationLength", "month");
  }, []);


  const getAnalytics = (agentId) => {
    let apiUrl = `${apiEndPoint}/api/updatesandgoals?agentId=${agentId}`;
    axios.get(apiUrl).then((data) => {
      console.log(data.data);
      setAnalytics(data.data);
    }).catch((error) => {
      console.log(error.response);
    });
  }

  const selectFilter = (type) => {
    setFilter(type);
    getCharts(type, "month");
  }

  const getCharts = (type, duration) => {

    let apiUrl = `${apiEndPoint}/api/stats?type=${type}&&duration=${duration}&&agentId=${agentId}`;
    axios.get(apiUrl).then((data) => {
      console.log(data.data);
      setChartData(data.data.Overall);
    }).catch((error) => {
      console.log(error.response);
    });
  }




  return (
    <React.Fragment>
      {console.log(analytics)}
      <Header></Header>
      <div className="container-fluid dashboard">
        <h3 className="text-center pt-3">Hello {agentName ? agentName : 'Agent'}! Welcome to Agent Interaction Hub</h3>
        <h5 className="mt-3 mb-3">Today's updates</h5>
        <div className="row">
          <div className="col-lg-3">
            <div className="small-card">
              <div className="image">
                <img src={user} alt="Users" style={{ width: 30 }} />
              </div>
              <div className="content">
                <h4>{analytics.todaysUpdates.totalChats}</h4>
                <div>Total chats</div>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="small-card">
              <div className="image">
                <img src={user} alt="Users" style={{ width: 30 }} />
              </div>
              <div className="content">
                <h4>{analytics.todaysUpdates.successfulChats}</h4>
                <div>Successful Chats</div>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="small-card">
              <div className="image">
                <img src={user} alt="Users" style={{ width: 30 }} />
              </div>
              <div className="content">
                <h4>{analytics.todaysUpdates.noOfHandoffs}</h4>
                <div>No. of Handoffs</div>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="small-card">
              <div className="image">
                <img src={user} alt="Users" style={{ width: 30 }} />
              </div>
              <div className="content">
                <h4>{analytics.todaysUpdates.noOfEscalations}</h4>
                <div>Number of Escalations</div>
              </div>
            </div>
          </div>
        </div>
        <h5 className="mt-3 mb-3">Your goal for the day</h5>
        <div className="row">
          <div className="col-lg-6 mb-3">
            <div className="large-card">
              <h6 className="text-center">Yesterday's performance</h6>
              <div className="body">
                <div className="text-center flex-1">
                  <h4>{analytics.goals.yesterdaysPerformance.chatsClosed}</h4>
                  <div className="indicator left"></div>
                  <div className="description">No. of chats closed</div>
                </div>
                <div className="text-center flex-1">
                  <h4>{analytics.goals.yesterdaysPerformance.usersHandled}</h4>
                  <div className="indicator middle"></div>
                  <div className="description">No. of users handled</div>
                </div>
                <div className="text-center flex-1">
                  <h4>{analytics.goals.yesterdaysPerformance.reassignments}</h4>
                  <div className="indicator right"></div>
                  <div className="description">No. of reassignments</div>
                </div>
              </div>
              <div className="footer text-center">
                <h6>Avg time spent on each user</h6>
                <h3 className="m-0">{analytics.goals.yesterdaysPerformance.avgTimeSpent} min</h3>
              </div>
            </div>
          </div>
          <div className="col-lg-6 mb-3">
            <div className="large-card">
              <h6 className="text-center">Today's performance</h6>
              <div className="body">
                <div className="text-center flex-1">
                  <h4>{analytics.goals.todaysPerformance.chatsClosed}</h4>
                  <div className="indicator left"></div>
                  <div className="description">No. of chats closed</div>
                </div>
                <div className="text-center flex-1">
                  <h4>{analytics.goals.todaysPerformance.usersHandled}</h4>
                  <div className="indicator middle"></div>
                  <div className="description">No. of users handled</div>
                </div>
                <div className="text-center flex-1">
                  <h4>{analytics.goals.todaysPerformance.reassignments}</h4>
                  <div className="indicator right"></div>
                  <div className="description">No. of reassignments</div>
                </div>
              </div>
              <div className="footer text-center">
                <h6>Avg time spent on each user</h6>
                <h3 className="m-0">{analytics.goals.todaysPerformance.avgTimeSpent} min</h3>
              </div>
            </div>
          </div>
        </div>
        <h5 className="mt-3 mb-3">Your statistics</h5>
        <div className="row">
          <div className="col-lg-12">
            <div className="buttons-container">
              <button className={`btn btn-custom btn-capsule mr-2 mb-2 ${filter === 'noOfUsers' ? 'active' : ''}`} onClick={() => { selectFilter("noOfUsers") }}>No. of users</button>
              <button className={`btn btn-custom btn-capsule mr-2 mb-2 ${filter === 'noOfLeads' ? 'active' : ''}`} onClick={() => { selectFilter("noOfLeads") }}>No. of leads</button>
              <button className={`btn btn-custom btn-capsule mr-2 mb-2 ${filter === 'noOfConversations' ? 'active' : ''}`} onClick={() => { selectFilter("noOfConversations") }}>No. of conversations</button>
              <button className={`btn btn-custom btn-capsule mr-2 mb-2 ${filter === 'avgConversationLength' ? 'active' : ''}`} onClick={() => { selectFilter("avgConversationLength") }}>Average conversation length</button>
              <button className={`btn btn-custom btn-capsule mb-2 ${filter === 'channelWisePerformance' ? 'active' : ''}`} onClick={() => { selectFilter("channelWisePerformance") }}>Channel wise performance</button>
            </div>

          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="large-card">
              <div className="filter-container">
                {/* <ul className="filter">
                  <li> Region Wise:</li>
                  <li className="active"><a href="#">All</a></li>
                  <li>|</li>
                  <li><a href="#">Bangalore</a></li>
                  <li>|</li>
                  <li><a href="#">Chennai</a></li>
                  <li>|</li>
                  <li><a href="#">Hyderabad</a></li>
                </ul> */}
                {/* <ul className="filter">
                  <li className="active"><a href="#">Month</a></li>
                  <li>|</li>
                  <li><a href="#">Year</a></li>
                </ul> */}
              </div>
              <ResponsiveContainer width="99%" aspect={10}>
                <AreaChart
                  data={data}
                  margin={{
                    top: 10, right: 30, left: 0, bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="x" />
                  <YAxis />
                  <Tooltip formatter={(value, name, props) => [value, filterLabels[filter]]} />
                  <Area type="monotone" dataKey="y" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </div>


          </div>

        </div>
        {/* <div className="row">
          <div className="col-12">
            <div className="large-card d-flex mt-3 mb-3 justify-content-center p-4">
              <button className="btn btn-custom text-uppercase mr-5" onClick={moveToChat}>Join a conversation</button>
              <button className="btn btn-custom text-uppercase" onClick={moveToChat}>Accept a conversation</button>
            </div>
          </div>
        </div> */}

      </div>
    </React.Fragment>
  )
};

export default Dashboard;
