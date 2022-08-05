import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import RoomItem from './RoomItem';
import { database } from './db/database';
import {
    push,
    ref,
    limitToLast,
    onValue,
    orderByChild,
    query,
    remove } from 'firebase/database';

const ICON_CHAT_STYLE = {
    fontSize: 120,
    color: "#ddd"
};

const FORM_STYLE = {
    display: "flex"
};

const BUTTON_STYLE = {
    marginLeft: 10
};

export default class Rooms extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        roomName: "",
        rooms: []
        };

        this.handleOnChangeRoomName = this.handleOnChangeRoomName.bind(this); 
        this.handleOnSubmit = this.handleOnSubmit.bind(this); 
    }

    componentDidMount() {
        // 컴포넌트 초기화때 채팅방 목록 추출
        this.fetchRooms();
    }

    handleOnChangeRoomName(e) {
        this.setState({
            roomName: e.target.value
        });
    }

    // 새 채팅방 만들기 처리
    handleOnSubmit(e) {
        const { roomName } = this.state;
        e.preventDefault();
        if( !roomName.length ){
            return ;
        }

        const locate = ref(database, '/chatrooms');
        const newRoomRef = push(locate, {
                                            description: roomName
                                        });

        hashHistory.push("/rooms/${newRoomRef.key}");
    }

    // 채팅방 목록 추출 처리
    fetchRooms() {
        const chatRoomRef = query(
            ref(database, "chatrooms")
                ,orderByChild("description")
                ,limitToLast(20)
        );

        onValue( chatRoomRef, (res) => {
            const rooms = [];
            res.forEach(item => {
                rooms.push(Object.assign({key: item.key}, item.val()));
            });

            this.setState({rooms});
        } );
    }

    // 왼쪽 패널(채팅방 목록) 렌더링 처리
    renderRoomList() {
        const { roomId } = this.props.params;
        const { rooms, roomName } = this.state;

        return (
            <div className="list-group">
                {rooms.map(r => <RoomItem room={r} key={r.key} selected={r.key === roomId} /> )}
                <div className="list-group-header">
                    <form style={FORM_STYLE} onSubmit={this.handleOnSubmit}>
                        <input 
                            type="text"
                            className="form-control"
                            placeholder="New room"
                            onChange={this.handleOnChangeRoomName}
                            value={roomName}
                        />
                        <button className="btn btn-default" style={BUTTON_STYLE}>
                            <span className="icon ico-plus" />
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // 오른쪽 패널(채팅방 상세) 렌더링 처리
    renderRoom() {
        if (this.props.children) {
            return this.props.children;
        } else {
            return (
                <div className="text-center">
                    <div style={ICON_CHAT_STYLE}>
                        <span className="icon icon-chat" />
                        Chat
                    </div>
                    <p>
                        Join a chat room from the sidebar or create your chat room.
                    </p>
                </div>
            )
        }
    }

    render() {
        return (
            <div className="pane-group">
                <div className="pane-sm sidebar">{this.renderRoomList()}</div>
                <div className="pane">{this.renderRoom()}</div>
            </div>
        );
    }
}
