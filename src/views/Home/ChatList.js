import React from 'react';
import DocumentList from './DocumentList';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dp from "../../assets/img/dp_placeholder.png";
import Moment from 'react-moment';
import { faSearch, faTimes, faChevronLeft, faChevronDown } from '@fortawesome/free-solid-svg-icons';
library.add(faSearch, faTimes, faChevronLeft, faChevronDown);

const ChatList = (props) => {

    const { tab, hasJoined, showHideDocs, showSavedChats, selectChat, showDocuments, setTabs, showChatDetails, openDoc, showMore, conversation, conversations, search, onChangeHandler, savedChatsList, fetchConversationList, fetchSavedChats, deleteSavedChat } = props;

    const renderConversationsList = (conversations, selectedChat) => {
        return conversations.filter((conversation) => {
            const query = search.toLowerCase();
            const name = conversation.name;
            const lastTranscript = transcriptFormatter(conversation);

            return ((name && name.includes(query)) || (lastTranscript && lastTranscript.includes(query)));
        }).map((conversation, key) => {

            const lastTranscript = transcriptFormatter(conversation);

            return (
                <li key={key} onClick={() => { selectChat(conversation, "watch") }} className={`${selectedChat.convId === conversation.convId ? 'active' : ''}`}>
                    <a href="#" >
                        <div className="profile-image">
                            <img src={dp} alt="Profile picture" />
                        </div>
                        <div className="content">
                            <span><strong>{conversation.name}</strong></span>
                            {/* <span><strong>{conversation.name}</strong> srinath@colive.com</span> */}
                            <p>{lastTranscript}</p>
                        </div>

                        <div className="timestamp">
                            <Moment format="hh:mm A">
                                {conversation.timestamp}
                            </Moment>
                        </div>
                        {
                            showSavedChats ? (
                                <div className="action ml-2">
                                    <FontAwesomeIcon icon={["fa", "times"]} onClick={(e) => { deleteSavedChat(e, conversation) }} />
                                </div>
                            ) : ('')
                        }

                    </a>
                </li>
            )
        })
    }

    //Handle different formats of 'transcript' key in conversation object 
    const transcriptFormatter = (conversation) => {
        let lastTranscript = "";
        if (Array.isArray(conversation.lastTranscript)) {
            lastTranscript = conversation.lastTranscript[0].text;
        } else {
            lastTranscript = conversation.lastTranscript;
        }
        return lastTranscript;
    }



    return (
        <div className={`mobile ${tab === "list" ? "active" : ""} col-lg-4 shadow full-height p-0`}>
            <div className="p-2 d-flex justify-content-between">
                <button className={`btn btn-custom btn-capsule flex-1 ml-1 mr-1 chat-docs ${hasJoined ? 'chat-active' : ''}`} onClick={showHideDocs}>{showDocuments ? 'Show Chats' : 'Show Documents'}</button>
                <button className={`btn btn-custom btn-capsule flex-1 ml-1 mr-1 mobile-only ${hasJoined ? 'chat-active' : ''}`} onClick={() => { setTabs("chat") }}>Back to chat</button>
                <button className="header-icon ml-2 open-sidebar" onClick={showChatDetails}><FontAwesomeIcon icon={["fa", "chevron-left"]} /></button>
            </div>
            {showDocuments ? (
                <DocumentList openDoc={openDoc}></DocumentList>) : (
                    <div className={`${hasJoined ? 'disabled' : ''} chat-list-container`}>
                        <div className="search-box">
                            <FontAwesomeIcon icon={["fa", "search"]} />
                            <input type="text" value={search} name="search" onChange={onChangeHandler} placeholder="Type in to search" />
                        </div>
                        <div className="d-flex justify-content-between show-chat">
                            <a onClick={fetchConversationList} className={`${hasJoined ? 'disabled' : ''} ${showSavedChats ? '' : 'selected'}`}>Recent chats <FontAwesomeIcon icon={["fa", "chevron-down"]} /></a>
                            <a onClick={fetchSavedChats} className={`${hasJoined ? 'disabled' : ''} ${showSavedChats ? 'selected' : ''}`}>Saved chats <FontAwesomeIcon icon={["fa", "chevron-down"]} /></a>
                        </div>
                        <div className="conversation-container" >
                            <ul>
                                {showSavedChats ? (
                                    renderConversationsList(savedChatsList, conversation)
                                ) : (
                                        renderConversationsList(conversations, conversation)
                                    )}

                            </ul>
                        </div>
                        <div className="d-flex justify-content-center p-2">
                            {
                                <button disabled={hasJoined || (showSavedChats && savedChatsList.length < 150) || (!showSavedChats && conversations.length < 150)} className="btn btn-custom btn-capsule" onClick={showMore}>Show previous chats</button>

                            }
                        </div>
                    </div>
                )}
        </div>
    )
};

export default ChatList;