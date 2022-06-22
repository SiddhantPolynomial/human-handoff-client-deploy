import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
library.add(faChevronRight);
const ChatControls = (props) => {

    const { chatDetails,leaveChatRef, hideChatDetails, online, switchChangeHandler, isOldChat, phoneNo, joinConversation, isWatching, hasJoined, manager, escalateToManager, saveChat, leaveChat } = props;

    return (
        <div className={`mobile chat-details ${chatDetails ? 'open' : ''} col-lg-3 shadow full-height  d-flex flex-column p-0`}>
            <button onClick={hideChatDetails} className="close-sidebar"><FontAwesomeIcon icon={["fa", "chevron-right"]} /></button>
            <div className="basic-details d-flex flex-column justify-content-center align-items-center">
                <label className="switch">
                    <input type="checkbox" checked={online} onChange={switchChangeHandler} />
                    <div className="slider round">
                        <span className="on">Online</span>
                        <span className="off">Offline</span>
                    </div>
                </label>
            </div>
            <div className="personal-info">
                <h5>Personal info</h5>
                <ul>
                    <li>
                        <span className="title">Phone no.</span>
                        <span style={{ "color": "#9b9b9b" }}>{phoneNo}</span>
                    </li>
                    <li>
                        <span className="title">IP address</span>
                        <span style={{ "color": "#9b9b9b" }}>Not available</span>
                    </li>
                </ul>
            </div>
            <div className="chat-controls d-flex justify-content-center">
                <ul>
                    <li><button className="btn btn-custom btn-capsule" disabled title="Coming soon">Important chats</button></li>
                    <li><button className="btn btn-custom btn-capsule" disabled title="Coming soon">Important Info</button></li>
                    <li>Actions</li>
                    <li><button className="btn btn-custom btn-capsule" onClick={() => { joinConversation()}} disabled={!isWatching || hasJoined || isOldChat}>Join conversation</button></li>
                    {
                        manager ? null : (
                            <li><button className="btn btn-custom btn-capsule" onClick={escalateToManager} disabled={!hasJoined}>Escalate to manager</button></li>
                        )
                    }

                    <li><button className="btn btn-custom btn-capsule" onClick={saveChat}>Save chat for later</button></li>
                    <li><button className="btn btn-custom btn-capsule" onClick={leaveChat} disabled={!hasJoined} ref={leaveChatRef}>Leave chat</button></li>
                </ul>
            </div>
        </div>
    )
};

export default ChatControls;