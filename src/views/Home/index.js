import React, { useEffect, useState, useRef } from 'react'
import Header from "../Header";
import ChatList from "./ChatList";
import Chat from "./Chat";
import ChatControls from "./ChatControls";
import { directlineTokenURL, directlineURL, apiEndPoint, botMngmtAPIURL, token as directlineToken } from "../../config";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import socketIOClient from "socket.io-client";
import {io} from "socket.io-client";
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import { animateScroll } from "react-scroll";
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
let client;
let streamURL;
let timeoutId;//used to cancel setTimeout
let token;//conversation token
let agentConvIdVar;//agent conversation ID
let expires_in_ms;//conversation token expiry time in milliseconds
const Home = () => {

    let agentName = localStorage.getItem("agentName");
    let agentId = localStorage.getItem("agentId");



    let [isWatching, setIsWatching] = useState(false);//keep track of the watched chats. true: agent is watching a chat but can't send message, false: agent is neither watching chat not joined a chat 
    let [hasJoined, setHasJoined] = useState(false);//keep track of the joined chats. true: agent is connected to some user and can send messages, false: agent is not connected to any user
    const timeOut = 300000;//5 minutes
    let [savedChatsList, setSavedChatsList] = useState([]);
    let [conversation, setConversation] = useState({});
    let [search, setSearch] = useState('');
    let [message, setMessage] = useState('');
    let [phoneNo, setPhoneNo] = useState('Not Available');
    let [online, setOnline] = useState(false);
    let [userConvId, setUserConvId] = useState(null);
    let [agentConvId, setAgentConvId] = useState(null);
    let [userId, setUserId] = useState(null);
    let [chatArray, setChatArray] = useState([]);
    let [manager, setManager] = useState([]);
    let [isOldChat, setIsOldChat] = useState(false);
    let [showDocuments, setShowDocuments] = useState(false);
    let [attachmentPanel, setAttachmentPanel] = useState(false);
    let [reqAgentConvId, setreqAgentConvId] = useState([]);//requesting agent conversation id
    let [reqAgentId, setreqAgentId] = useState([]);//requesting agent conversation id
    let [tab, setTabs] = useState("list");//tabs for mobile screen."list": chat list screen ,"chat": Single chat screen
    let [chatDetails, setChatDetails] = useState(false);//sidebar for mobile screen: true: show chat details sidebar, false: hide chat details sidebar
    let [conversations, setConversationList] = useState([]);
    let [showSavedChats, setShowSavedChats] = useState(false);
    let [clicked,setClicked]=useState(false);
    let [timer,setTimer]=useState('');
    let ref=useRef();
    let leaveChatRef=useRef();
    //Time out
    
    const botType = 'U2FsdGVkX18EFkqMXPRq7jhhHuOqPnlVOY/VZ2S+mBg=';

    const [open, setOpen] = useState(false);
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);
    const imageInput = useRef(null)
    const docInput = useRef(null)
    // const endpoint=process.env.handoffServer||"http://localhost:5000/"
    // var socket = io.connect('localhost:3000', {
    //     'path': '/path/to/socket.io';
    //   });
    const endpoint=process.env.handoffServer||"https://lenskits.polynomial.ai/humanhandoffBackend/"
    useEffect(() => {
        global.socket1=io(endpoint,{query: {type: 'client'}})
        global.socket1.emit("howdy","hello from human-handoff-client")
        console.log("socketio client",global.socket1)
        // generateToken();
        fetchConversationList();
        const manager = JSON.parse(localStorage.getItem("manager"));
        const online = JSON.parse(localStorage.getItem("online"));
        setManager(manager);//if true: this agent is manager otherwise not
        //set agent status based on stored flag. Used to retain status even if page refreshed
        global.socket1.on("endChat",()=>{
            leaveChatRef.current.click();
        })
        global.socket1.on('getWatchConversation', (activities) => {
            console.log("activities",activities);
           
            setChatArray(chatArray => [...chatArray, ...activities]);
            
            scrollToBottom();
        })
        global.socket1.on("leaveChat",()=>{
            leaveChat();
        })
        //Socket event 'notification' looks for chat notification by any user or a non manager agent
        global.socket1.on("enableChat", () => {
            setHasJoined(true);
        })
        const socket = socketIOClient(apiEndPoint);
       global.socket1.on("notifications", data => {
            console.log(data);
            
            if (data.managerId) {
                if (data.managerId === agentId) {
                    //this condition means following two things are true
                    //1. agent is manager
                    //2. the chat request is escalated from previous agent

                    onOpenModal();
                    setreqAgentConvId(data.agentConvId); //save conversationId of the conversation between user and agent who escalated chat
                    setreqAgentId(data.agentId);// save agentId of agent who escalated chat
                }
            } else if (data.agentId === agentId) {//if agent is not manager
                onOpenModal();
            }
            setUserConvId(data.convId);
            setUserId(data.userId);
            const timerId=setTimeout(()=>{
                ref.current.click();
            },3000);
            setTimer(timerId);
        });
        socket.on("help", data => {
            console.log(data);//for debugging
        });
        socket.on("watch", data => {
            console.log(data);//for debugging
        });
        socket.on("join", data => {
            console.log(data);//for debugging
        });
        socket.on("agent-inactive", data => {
            console.log(data);//for debugging
        });
        socket.on("user-inactive", data => {
            console.log(data);//for debugging
        });
        socket.on("conversationUpdate", data => {
            //update conversation list socket event
            //On first time page load this data is fetched from  from API fetchConversationList()
            //After that it is fetched in realtime from this socket event
            setConversationList(data);
        });

    }, [])

    const setAgentOnline = (status) => {
        
        setOnline(status);
        console.log("******",status);
        localStorage.setItem("online", status);
          if (status) {
            global.socket1.emit("enqueueAgent",{agentId,botType,agentName,manager});
            
        }else{
            console.log("dequeueAgent")
            global.socket1.emit("dequeueAgent",agentId) 
           
        }
       
    }

    const fetchConversationList = (e, timestamp) => {
        
        global.socket1.on("updateConversationList", data => {
            console.log("updating..",data);
            setConversationList(data);
            setShowSavedChats(false);
        })
    }

    const fetchSavedChats = (e, timestamp) => {
        let apiUrl = `${apiEndPoint}/api/getsavedchats?agentId=${agentId}`;
        if (timestamp) {
            //if you want to fetch past saved chat list then pass timestamp of the last chat of current list
            //150 chats are fetched at once
            apiUrl = `${apiEndPoint}/api/getsavedchats?timestamp=${timestamp}&agentId=${agentId}`;
        }
        axios.get(apiUrl).then((data) => {
            setSavedChatsList(data.data);
            setShowSavedChats(true);
        }).catch((error) => {
            console.log(error.response);
        });
    }

    const deleteSavedChat = (e, conversation) => {

        let apiUrl = `${apiEndPoint}/api/deletesavedchat`;

        const payload = {
            agentId: agentId,
            userId: conversation.userId
        }

        axios.delete(apiUrl, { data: payload, headers: { Authorization: `Bearer ${token}` } }).then((data) => {
            console.log(data);
            NotificationManager.success('', "Removed from saved chat");
            fetchSavedChats();
        }).catch((error) => {
            console.log(error);
        });
        e.stopPropagation();
    }


    const scrollToBottom = () => {
        animateScroll.scrollToBottom({
            containerId: "chat-container"
        });
    }

    const leaveChat = () => {
        
        global.socket1.emit("leaveConversation",{
            botType, 
            manager,
            value: {
            sender: "agent",
            name: agentName
        },})
        setHasJoined(false);
    }

    const findChat = () => {
        //find chat for which notification is accepted, in conversations list and highlight it
        
        let conversation = conversations.find(conv => conv.convId === userConvId);
        selectChat(conversation, "join");
    }

    const selectChat = (conversation, type) => {
        console.log("type", type);
        const { convId, userId } = conversation;
        setChatArray([]);//Empty chat array
        setConversation(conversation);
        setUserConvId(convId);
        //if it is an old chat possibly a few hours old then don't show input box
        const isOldChat = checkIsOldChat(conversation.timestamp);
        setIsOldChat(isOldChat);
        if (type === "watch") {
            //watch only when selecting an existing conversation
            //don't call it when accepting request for new chat
            //otherwise both watch and join will be called and it will show multiple instances of chat
            watchConversation(convId, userId);
        }
        setTabs("chat");//for mobile view. Show single chat screen
        setPhoneNo("Not Available");//reset phone number
    }

    const acceptChat = () => {
        clearTimeout(timer);
        setClicked(true);
        setChatArray([]);//Empty chat array
        setConversation({});//remove any selected chat from list
        global.socket1.emit('watchConversation', {query:{conversationId: userConvId}});
        joinConversation();
        onCloseModal();
        findChat();
    }

  

    const declineChat = () => {
        clearTimeout(timer);
        setClicked(true)
        console.log("*****",userConvId,agentId)
        global.socket1.emit('declineAgent', {agentId: agentId, conversationId: userConvId,manager});
        onCloseModal();
    }

    const setAgentInactive = () => {
        const apiUrl = `${directlineURL}/v3/directline/conversations/${agentConvIdVar}/activities`;
        const payload = {
            type: "event",
            name: 'agent/inactive',
            value: {}
        };
        console.log(token);
        axios.post(apiUrl, payload, { headers: { Authorization: `Bearer ${token}` } }).then((data) => {
            console.log(data);
            setAgentOnline(false);
        }).catch((error) => {
            console.log(error);
        });
    }

    const uploadAttachment = (e) => {
        let files = e.target.files;
        if (files.length > 0) {
            let file = files[0];
            let formData = new FormData();
            formData.append("file", file);
            const headers = {
                headers: {
                    Authorization: "Bearer qP0qsYX9_Ho.PGotiqdrD_L2wPddgXe7Ym1lgW6y0XZZTdMN7PGZwxM"
                }
            }
            const apiUrl = `${botMngmtAPIURL}/upload`;
            axios.post(apiUrl, formData, headers).then((data) => {
                sendAttachment(data.data);
                setAttachmentPanel(false);
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    //Generate token which will be used to get websocket streamURL and another token
    //which will allow user to connect to chat stream
    const generateToken = () => {
        let payload = {
            id: agentId,
            name: agentName
        }
        const headers = {
            headers: {
                Authorization: directlineToken
            }
        }
        const apiUrl = directlineTokenURL;

        axios.post(apiUrl, payload, headers).then((data) => {
            //after getting token, start conversation by passing this to directline 
            startConversation(data.data.token);
        }).catch((error) => {
            console.log(error);
        });
    }

    const getChatStatus = (obj) => {
        //match status to determine which buttons to enable/disable
        let status = "";
        if (obj.activities[0].value && obj.activities[0].value.status) {
            status = obj.activities[0].value.status
        }
        if (status === "Chat Started") {
            setHasJoined(true);
            setIsWatching(true);
        } else if (status === "Chat Ended") {
            setHasJoined(false);
            setIsWatching(false);
        } else if (status === "Escalation Failed") {
            setHasJoined(true);
            setIsWatching(true);
        } else if (status === "Escalation Initiated") {
            setHasJoined(false);
            setIsWatching(false);
        }
    }

    const refreshConvToken = () => {
        const apiUrl = `${directlineURL}/v3/directline/tokens/refresh`;
        const payload = {};
        axios.post(apiUrl, payload, { headers: { Authorization: `Bearer ${token}` } }).then((data) => {
            token = data.data.token;
            let { expires_in } = data.data;
            expires_in = expires_in - 300;//refresh token 5 minutes before expiry
            expires_in_ms = expires_in * 1000;
            setTimeout(() => {
                refreshConvToken();
            }, expires_in_ms);
        }).catch((error) => {
            console.log(error);
        });
    }

    //extract phone number from chat
    //match for anything that looks like a phone number and display in chat details
    const extractPhoneNo = (text) => {
        if (text) {
            let regExp = /(?:[-+() ]*\d){10,13}/gm;
            let result = text.match(regExp);
            if (result) {
                result = result.map(function (s) { return s.trim(); });
                return result[0];
            }
            return false;
        }
        return false;
    }

    const startConversation = (one_time_token) => {
      
        const apiUrl = `${directlineURL}/v3/directline/conversations`;
        const payload = {};
        axios.post(apiUrl, payload, { headers: { Authorization: `Bearer ${one_time_token}` } }).then((data) => {
            streamURL = data.data.streamUrl;
            token = data.data.token;
            let { expires_in } = data.data;
            expires_in = expires_in - 300;//refresh token 5 minutes before expiry
            expires_in_ms = expires_in * 1000;
            setTimeout(() => {
                refreshConvToken();
            }, expires_in_ms);
            setAgentConvId(data.data.conversationId);
            agentConvIdVar = data.data.conversationId
            
            client = new W3CWebSocket(data.data.streamUrl);
            client.onopen = () => {
                console.log('WebSocket Client Connected');
                timeoutId = setTimeout(() => {
                    setAgentInactive();
                    // if (isWatching) {
                    //     leaveChat();
                    // }

                }, timeOut);
            };
            client.onmessage = (message) => {
                if (message.data && message.data !== "") {
                    let obj = JSON.parse(message.data);
                    console.log(obj);
                    let phoneNo = extractPhoneNo(obj.activities[0].text);
                    if (phoneNo) {
                        setPhoneNo(phoneNo);
                    }
                    getChatStatus(obj);
                    setChatArray(chatArray => [...chatArray, obj]);
                    scrollToBottom();
                }
            };
            client.onerror = (error) => {
                console.log(error);
            };
        }).catch((error) => {
            console.log(error);
        });
    }

    const joinConversation = () => {
        
        global.socket1.emit('joinConversation',{
            conversationId: userConvId,
            agentId: agentId,
            message: 'Agent connected',
            manager,
            botType,
            value: {
                        sender: "agent",
                        name: agentName
                    },
        })
        // setHasJoined(true);
        
    }

    const watchConversation = (conv_id, user_id) => {
        // const apiUrl = `${directlineURL}/v3/directline/conversations/${agentConvIdVar}/activities`;
        // const payload = {
        //     "type": "event",
        //     name: 'agent/watch',
        //     value: {
        //         convId: conv_id,
        //         userId: user_id
        //     }
        // };
        // axios.post(apiUrl, payload, { headers: { Authorization: `Bearer ${token}` } }).then((data) => {
        //     setIsWatching(true);
        // }).catch((error) => {
        //     console.log(error);
        // });
        const apiUrl = `${directlineURL}/v3/directline/conversations/${agentConvIdVar}/activities`;
           
            global.socket1.emit('watchConversation', {query:{conversationId: conv_id}});
           

            setIsWatching(true);
       
    }

    //send chat on press of enter key
    const enterChangeHandler = (e) => {
        if (e.keyCode === 13) {
            sendMessage();
        }
    }

    const showChatList = () => {
        setShowDocuments(false);
        setTabs("list");
    }

    const showDocumentsList = () => {
        setTabs("list");
        setShowDocuments(true);
    }

    const sendMessage = (text) => {
        //if string is passed used that otherwise use 'message' variable set from input field
        console.log("sendMessage",text)
        let messageString = "";
        if (text) {
            messageString = text;
        } else {
            messageString = message;
            setMessage("");
        }
        global.socket1.emit('sendMessage',{
            conversationId: conversation.convId,
            agentId: agentId,
            message: messageString,
            manager,
            botType,
            value: {
                        sender: "agent",
                        name: agentName
                    },
        })
        setHasJoined(true);
       
    }

    const getNameFromURL = (url) => {
        let array = url.split("/");
        if (array.length > 0) {
            return array[array.length - 1];
        } else {
            return "";
        }
    }

    const sendAttachment = (attachment) => {

        const apiUrl = `${directlineURL}/v3/directline/conversations/${agentConvId}/activities`;
        const payload = {
            locale: "en-EN",
            type: "message",
            from: {
                id: agentId
            },
            text: "Attachment",
            value: {
                sender: "agent",
                name: agentName,
                attachments: [{
                    name: getNameFromURL(attachment.url),
                    contentType: attachment.type,
                    contentUrl: attachment.url
                }],
            }
        }

        axios.post(apiUrl, payload, { headers: { Authorization: `Bearer ${token}` } }).then((data) => {
            console.log(data);
        }).catch((error) => {
            console.log(error);
        });
    }



    //Mobile view - open sidebar to show chat details
    const showChatDetails = () => {
        setChatDetails(true);
    }
    //Mobile view - close sidebar to that shows chat details
    const hideChatDetails = () => {
        setChatDetails(false);
    }


    const checkIsOldChat = (timestamp) => {
        //check if chat is more than 12 hours old
        const duration = 1000 * 60 * 60 * 12;
        const timeAgo = Date.now() - duration;
        return timestamp < timeAgo;
    }

    const saveChat = () => {

        let apiUrl = `${apiEndPoint}/api/savechat`;
        const { userId, convId, lastTranscript, status, name, timestamp } = conversation;

        let payload = {
            userId: userId,
            convId: convId,
            lastTranscript: lastTranscript,
            status: status,
            name: name,
            timestamp: timestamp,
            agentId: agentId,
        };

        axios.post(apiUrl, payload, { headers: { Authorization: `Bearer ${token}` } }).then((data) => {
            console.log(data);
            NotificationManager.success('', data.data);
        }).catch((error) => {
            console.log(error);
        });
    }

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        if (name === "search") {
            search = setSearch(value);
        } else if (name === "chat") {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setAgentInactive();
            }, timeOut);
            setMessage(value);
        }
    }


    const escalateToManager = () => {
        global.socket1.emit("escalateToManager")
    }

    const showMore = (e) => {
        //note:e is not being used. It is just to fill up first argument
        if (conversations.length > 0) {
            const timestamp = conversations[conversations.length - 1].timestamp;
            fetchConversationList(e, timestamp);
        } else {
            fetchConversationList(e);
        }
    }

    const triggerUpload = (type) => {
        if (type === "image") {
            imageInput.current.click();
        } else if (type === "doc") {
            docInput.current.click();
        }
    }

    const switchChangeHandler = (e) => {
        setAgentOnline(e.target.checked);
    }

    const showHideDocs = () => {
        setShowDocuments(!showDocuments);
    }

    return (
        <React.Fragment>
            <Header online={online}></Header>
            <div className="container-fluid home">
                <div className="row">
                    <ChatList
                        tab={tab}
                        search={search}
                        hasJoined={hasJoined}
                        showHideDocs={showHideDocs}
                        showChatDetails={showChatDetails}
                        onChangeHandler={onChangeHandler}
                        fetchSavedChats={fetchSavedChats}
                        savedChatsList={savedChatsList}
                        showDocuments={showDocuments}
                        setTabs={setTabs}
                        showMore={showMore}
                        selectChat={selectChat}
                        deleteSavedChat={deleteSavedChat}
                        conversations={conversations}
                        conversation={conversation}
                        showSavedChats={showSavedChats}
                        fetchConversationList={fetchConversationList}>
                    </ChatList>
                    <Chat
                        tab={tab}
                        conversation={conversation}
                        hasJoined={hasJoined}
                        showChatList={showChatList}
                        showDocumentsList={showDocumentsList}
                        showChatDetails={showChatDetails}
                        chatArray={chatArray}
                        attachmentPanel={attachmentPanel}
                        setAttachmentPanel={setAttachmentPanel}
                        triggerUpload={triggerUpload}
                        imageInput={imageInput}
                        uploadAttachment={uploadAttachment}
                        docInput={docInput}
                        message={message}
                        onChangeHandler={onChangeHandler}
                        enterChangeHandler={enterChangeHandler}
                        sendMessage={sendMessage}
                    ></Chat>
                    <ChatControls
                        leaveChatRef={leaveChatRef}
                        chatDetails={chatDetails}
                        hideChatDetails={hideChatDetails}
                        online={online}
                        phoneNo={phoneNo}
                        joinConversation={joinConversation}
                        isWatching={isWatching}
                        hasJoined={hasJoined}
                        manager={manager}
                        escalateToManager={escalateToManager}
                        saveChat={saveChat}
                        leaveChat={leaveChat}
                        isOldChat={isOldChat}
                        switchChangeHandler={switchChangeHandler}>
                    </ChatControls>
                </div>
            </div>
            <Modal open={open} onClose={onCloseModal} closeOnEsc={false} closeOnOverlayClick={false} showCloseIcon={false} center>
                <div className="p-3">
                    <h4>New chat request</h4>
                    <div className="p-2 d-flex justify-content-between">
                        <button className="btn btn-custom btn-capsule flex-1 ml-1 mr-1" onClick={acceptChat}>Accept</button>
                        <button className="btn btn-custom btn-capsule flex-1 ml-1 mr-1" onClick={declineChat} ref={ref}>Decline</button>
                    </div>
                </div>

            </Modal>
            <NotificationContainer></NotificationContainer>
        </React.Fragment>

    )
};

export default Home;