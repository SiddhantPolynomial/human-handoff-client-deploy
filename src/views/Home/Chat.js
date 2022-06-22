import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import shona from "../../assets/img/Shona.png";
import { faDownload, faPaperPlane, faMicrophone, faPaperclip, faFileImage, faFileAlt, faTimes, faChevronLeft, faListUl } from '@fortawesome/free-solid-svg-icons';
library.add(faDownload, faPaperPlane, faPaperclip, faMicrophone, faFileImage, faFileAlt, faTimes, faChevronLeft, faListUl);
const Chat = (props) => {

    const { tab, conversation, hasJoined, showChatList, showDocumentsList, showChatDetails, chatArray, attachmentPanel, setAttachmentPanel, triggerUpload, imageInput, uploadAttachment, docInput, message, onChangeHandler, enterChangeHandler, sendMessage } = props;

    const renderThumbnail = (chat) => {
        const activity = chat;
        return (
            <a href={activity.value.attachments[0].contentUrl} download={activity.value.attachments[0].contentUrl} className="thumbnail" style={{ maxWidth: "140px" }}>

                <div className="thumbnail-header">{chat.text}</div>
                <div className="thumbnail-body">
                    <div className="overlay">
                        <div className="circle">
                            <FontAwesomeIcon icon={["fa", "download"]} />
                        </div>
                    </div>
                    {activity.value.attachments[0].contentType === "image/jpeg" || activity.value.attachments[0].contentType === "image/png" ? (
                        <img style={{ width: "100%" }} src={activity.value.attachments[0].contentUrl} alt={activity.value.attachments[0].name} />
                    ) : (
                            activity.value.attachments[0].contentType
                        )}
                </div>
                <div className="thumbnail-footer">
                    {activity.value.attachments[0].name}
                </div>
            </a>
        )
    }

    const renderChatArray = (chatArray) => {
        {console.log("renderChatArray", chatArray)}
        return chatArray.map((chat, key) => (
            <React.Fragment key={key}>
                {
                    (chat.text != null && chat.text != undefined) ? (
                        chat.value ? (
                            chat.value.sender === "user" ? (
                                <React.Fragment>
                                    {
                                        (chat.value.attachments && chat.value.attachments.length > 0) ? (
                                            <div className="left">
                                                {renderThumbnail(chat)}
                                            </div>
                                        ) : (
                                                <div className="left">
                                                    {chat.text}
                                                </div>
                                            )
                                    }
                                </React.Fragment>
                            ) : chat.value.sender === "agent" ? (
                                chat.value.attachments ? (
                                    <div className="right">
                                        {renderThumbnail(chat)}
                                    </div>
                                ) : (<div className="right">
                                    {chat.text}
                                </div>)

                            ) : chat.value.sender === "bot" ? (
                                <div className="right">
                                    <img src={shona} className="avatar" alt="Shona" />
                                    {chat.text}
                                </div>
                            ) : (
                                            <div className="left">
                                                {chat.text}
                                            </div>
                                        )
                        ) : (
                                <div className="left">
                                    {chat.text}
                                </div>
                            )
                    ) : null
                }
            </React.Fragment>
        ))
    }

    return (
        <div className={`mobile ${tab === "chat" ? "active" : ""} col-lg-5 full-height p-0 d-flex flex-column`}>
            <div className="chat-header d-flex align-items-center justify-content-center">
                {/* <div className="profile-image" style={{ width: 90 }}>
                                <img src={dp} alt="Profile picture" style={{ width: 65 }} />
                            </div> */}
                <div className="user-name">
                    <h5>{conversation.name ? conversation.name : 'User'}</h5>
                    <div className="email"></div>
                </div>
                <button className={`header-icon ml-auto ${hasJoined ? 'disabled' : ''}`} onClick={showChatList}><FontAwesomeIcon icon={["fa", "list-ul"]} /></button>
                <button className="header-icon ml-2" onClick={showDocumentsList}><FontAwesomeIcon icon={["fa", "file-alt"]} /></button>
                <button className="header-icon ml-2 open-sidebar" onClick={showChatDetails}><FontAwesomeIcon icon={["fa", "chevron-left"]} /></button>
            </div>
            <div className="body">
                <div className="chat pt-4" id="chat-container">
                    {
                        chatArray.length > 0 ? (
                            renderChatArray(chatArray)
                        ) : (<div className="d-flex justify-content-center">
                            Chat will show here
                        </div>)
                    }

                </div>
            </div>
            <div className="footer position-relative">
                {attachmentPanel ? (
                    <div className="upload-file shadow">
                        <h5>Upload the image of Document</h5>
                        <div className="close-icon" onClick={() => { setAttachmentPanel(false) }}><FontAwesomeIcon icon={["fa", "times"]} /></div>
                        <div className="upload-icon-container">
                            <div className="upload-icon shadow" onClick={() => { triggerUpload("image") }}>
                                <FontAwesomeIcon icon={["fa", "file-image"]} />
                            </div>
                            <div className="upload-icon shadow" onClick={() => { triggerUpload("doc") }}>
                                <FontAwesomeIcon icon={["fa", "file-alt"]} />
                            </div>
                            <input type="file" accept='image/*' ref={imageInput} style={{ display: 'none' }} onChange={uploadAttachment} />
                            <input type="file" accept=".xlsx,.xls,.doc,.docx,.txt,.pdf" ref={docInput} style={{ display: 'none' }} onChange={uploadAttachment} />
                        </div>
                    </div>
                ) : null}
                <div className={`search-box ${!hasJoined ? 'disabled' : null}`}>
                    <input type="text" placeholder="Type here..." value={message} name="chat" onChange={onChangeHandler} onKeyDown={enterChangeHandler} autoComplete="off" />
                    <FontAwesomeIcon icon={["fa", "paper-plane"]} onClick={sendMessage} />
                    <FontAwesomeIcon icon={["fa", "paperclip"]} onClick={() => { setAttachmentPanel(true) }} />
                    <FontAwesomeIcon disabled icon={["fa", "microphone"]} />
                </div>
            </div>
        </div>
    )
};

export default Chat;