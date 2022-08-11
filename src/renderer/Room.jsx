import React, { Component } from "react";
import Message from "./Message";
import NewMessage from "./NewMessage";
import { auth } from "./auth/auth";
import { database } from './db/database';
import {
    push,
    ref,
    orderByChild,
    query,
    off,
    onChildAdded,} from 'firebase/database';
const ROOM_STYLE = {
    padding: "10px 30px",
};

export default class Room extends React.Component {
    constructor(props) {
        super(props);
            this.state = {
            messages: [],
            roomIdRef: null
        };

        this.handleMessagePost = this.handleMessagePost.bind(this); 
    }

    componentDidMount() {
        const { roomId } = this.props.params;
        // 컴포넌트 초기화 때 채팅방 상세 정보 추출
        this.fetchRoom(roomId);
    }

    // @deplicated
    componentWillReceiveProps(nextProps) {
        const { roomId } = nextProps.params;
        if (roomId === this.props.params.roomId) {
            // 채팅방 id로 변환할 수 없다면 아무것도 하지 않기
            return;
        }
        
        this.setState( {messages: []}, () => {
            this.fetchRoom(roomId);
        });
    }

    componentDidUpdate() {
        setTimeout(() => {
            // 화면 아래로 스크롤하기
            this.room.parentNode.scrollTop = this.room.parentNode.scrollHeight;
        }, 0);
    }

    componentWillUnmount() {
        console.log("unmount");
    }

    // 메시지 입력 처리
    handleMessagePost(message){
        try{
        this.user = this.user || auth.currentUser;
        const newRoomRef = push(this.state.roomIdRef, {
                                            writtenBy: {
                                                uid: this.user.uid,
                                                displayName: this.user.displayName,
                                                photoURL: this.user.photoURL
                                            },
                                            time: Date.now(),
                                            text: message
                                        });
        }
        catch(err){
            console.log(err);
        }
                                    
    }

    fetchRoom(roomId) {
        try{
            if( this.state.roomIdRef ){
                off(this.state.roomIdRef, 'child_added');
            }
            
            const roomIdRef = query(
                ref(database, `chatrooms/${roomId}`)
                ,orderByChild("time")
            );
            this.setState({roomIdRef});

            const messageRef = ref(database, `chatrooms/${roomId}`);
            this.setState({ messageRef });
            onChildAdded(messageRef, (data, prev) => {
                if(data.hasChildren("messages")){
                    const { messages } = this.state || [];

                    // 추가된 메세지를 state에 할당
                    messages.push(Object.assign({ key: data.key }, data.val()));
                    this.setState({ messages });
                }
                else{
                    window.document.title = data.val();
                }
            });
        }
        catch(err){
            console.log(err);
        }
    }

    render() {
        const { messages } = this.state;
        return (
            <div style={ROOM_STYLE} ref={room => this.room = room}> 
                <div className="list-group">
                    {messages.map(m => <Message key={m.key} message={m} />)}
                </div>
                <NewMessage onMessagePost={this.handleMessagePost} />
            </div>
        );
    }
}