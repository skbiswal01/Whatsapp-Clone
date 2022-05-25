import React from 'react'
import Head from 'next/head';
import styled from 'styled-components';
import Sidebar from '../../components/Sidebar';
import ChatScreen from '../../components/ChatScreen';
import { collection, doc, docs} from "firebase/firestore"; 
import { auth, db } from '../../firebase';
import { query, orderBy , getDoc, getDocs} from "firebase/firestore";  
import { useAuthState } from 'react-firebase-hooks/auth';
import getRecipentEmail from '../../utils/getRecipientEmail';

const Chat = ({chat, messages}) => {
const [user] = useAuthState(auth);
  return (
    <Container>
         <Head>
             <title>Chat with {getRecipentEmail(chat.users, user)}</title>
         </Head>
         <Sidebar/>
         <ChatContainer>
             <ChatScreen chat={chat} messages={messages}/>
         </ChatContainer>
    </Container>
  )
}

export default Chat
export async function getServerSideProps(context){
     const ref = doc(db, 'chats', context.query.id);
     
    const q = query(collection(ref, "messages"), orderBy("timestamp", "asc"));
     const messagesRes = await getDocs(q);
     const messages = messagesRes.docs.map(doc => ({
         id: doc.id,
         ...doc.data()
     })).map(messages => ({
         ...messages,
         timestamp : messages.timestamp.toDate().getTime()
     }))

     const chatRes = await getDoc(ref)
     const chat = {
         id : chatRes.id,
         ...chatRes.data()
     }
    
    return {
       
        props : {
            messages : JSON.stringify(messages),
            chat : chat,

        }
    }

}
const Container = styled.div`
display : flex;
`;

const ChatContainer = styled.div`
flex : 1;
overflow : scroll;
height: 100vh;
::-webkit-scrollbar{
  display:none;
}
-ms-overflow-style:none;
scrollbar-width:none;
`;