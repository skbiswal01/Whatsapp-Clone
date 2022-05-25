import React, { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import { auth } from '../firebase';
import { useRouter } from 'next/router';
import { Avatar } from '@mui/material';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import IconButton from "@mui/material/IconButton";
import { useCollection } from 'react-firebase-hooks/firestore';
import { db} from '../firebase';
import { doc , getDoc} from 'firebase/firestore';
import {query, orderBy , where, collection, setDoc, docs, serverTimestamp, addDoc} from 'firebase/firestore';
import Message from './Message';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import getRecipentEmail from '../utils/getRecipientEmail';
import ReactTimeAgo from 'react-time-ago'

const ChatScreen = ({chat, messages}) => {
    
  const [user] = useAuthState(auth);
  const [input, setInput] = useState("");
  
  const router = useRouter();
  const q = doc(db, 'chats', router.query.id);
  const res = query(collection(q, 'messages'), orderBy("timestamp", "asc"));
  const  [messagesnapshot] = useCollection(res)
  
  const [recipientSnapshot] = useCollection(query(collection(db, 'users'), where("email", "==" , getRecipentEmail(chat.users, user))))
  const showMessages = () => {
      if(messagesnapshot){
        
          return messagesnapshot.docs.map((message) => {

              <Message 
               key = {message.id}
               user = {message.data().user}
               message = {{
                   ...message.data(),
                   timestamp : message.data().timestamp?.toDate().getTime()
                   
               }}
                
              />
              
              
          })
      }else{
       
          return JSON.parse(messages).map((message)=>{
            <Message 
            key = {message.id}
            user = {message.user}
            message = {message}/>
            
          })
      }
  }

  const sendMessage = (e) => {
      e.preventDefault();
      setDoc(doc(db, 'users', user.uid), {
        lastSeen : serverTimestamp(),
      },{ merge: true });

      addDoc(collection(q, "messages"),{
          timestamp : serverTimestamp(),
          message : input,
          user : user.email,
          photoURL : user.photoURL
      })
      showMessages();
      setInput('');
      
  }


const recipient =  recipientSnapshot?.docs?.[0]?.data();
//  console.log(recipient);
  const recipientEmail = getRecipentEmail(chat.users, user);
  
  return (
    <Container> 
          <Header>
          {recipient ? (
         <Avatar src={recipient?.photoURL}/>
        ) : (
            <Avatar>{recipientEmail[0]}</Avatar>
        )}
              <HeaderInformation>
                  <h3>{recipientEmail}</h3>
                  {recipientSnapshot ?           
                              (<p>Last active: {' '}
                     {recipient?.lastSeen?.toDate() ? (
                      <ReactTimeAgo date={recipient?.LastSeen?.toDate()} locale='en-US'/>
                     ) : "unavailable"}
                      </p>
   ) : ( <p>Loading..</p>)}

              </HeaderInformation>
              <HeaderIcons>
                   <IconButton>
                       <AttachFileIcon/>
                   </IconButton>
                   <IconButton>
                       <MoreVertIcon/>
                   </IconButton>
              </HeaderIcons>
          </Header>
          <MessageContainer>
              {showMessages()}
              <EndOfMessage />
          </MessageContainer>
          <InputContainer>
             <InsertEmoticonIcon/>
             <Input value={input} onChange={e => setInput(e.target.value)}/>
             <button hidden disabled={!input} type="submit" onClick={sendMessage}>Send Messages</button>
             <MicIcon/>
          </InputContainer>
    </Container>
  )
}

export default ChatScreen
const Container = styled.div``;

const Input = styled.input`
   flex : 1;
  align-items : center;
  padding : 10px;
  position : sticky;
  bottom : 0;
  background-color : whitesmoke;
  z-index : 100;
  border : none;
`;
const Header = styled.div`
position : sticky;
background-color : white;
z-index : 100;
top : 0;
display : flex;
padding : 11px;
height : 80px;
align-items: center;
border-bottom : 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
margin-left : 15px;
flex : 1;

> h3 {
    margin-bottom : 3px;
}

> p {
    font-size : 14px;
    color : gray;
}
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
 padding : 30px;
 background-color : #e5ded8;
 min-height: 90vh;
`;

const EndOfMessage = styled.div``;

const InputContainer = styled.form`
display : flex;
align-items : center;
padding : 10px;
position : sticky;
bottom : 0;
background-color : white;
z-index : 100;
`;