import React, { useEffect, useRef, useState } from "react";
import "./app.css";

export const WebSock = () => {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState("");
  const socket = useRef();
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState();

  function connect(e) {
    e.preventDefault();
    socket.current = new WebSocket("ws://localhost:5000");

    socket.current.onopen = () => {
      setConnected(true);
      const message = {
        event: "connection",
        username,
        id: Date.now(),
      };
      setUserId(message.id);
      socket.current.send(JSON.stringify(message));
    };
    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [message, ...prev]);
    };
    socket.current.onclose = () => {
      console.log("Socket закрыт");
    };
    socket.current.onerror = () => {
      console.log("Socket произошла ошибка");
    };
  }

  const sendMessage = async (e) => {
    e.preventDefault();
    const message = {
      username,
      message: value,
      id: Date.now(),
      event: "message",
      userId,
    };
    socket.current.send(JSON.stringify(message));
    setValue("");
  };

  if (!connected) {
    return (
      <div className="container">
        <section id="content">
          <form action="">
            <h1>Войти в чат</h1>
            <div>
              <input
                type="text"
                id="username"
                placeholder="Имя пользователя"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <input
                type="submit"
                value={"Войти"}
                onClick={(e) => connect(e)}
              />
            </div>
          </form>
        </section>
      </div>
    );
  }

  return (
    <div className="container">
      <section id="content">
        <form action="">
          <h1>Чат</h1>
          <div>
            <input
              type="text"
              id="message-inp"
              placeholder="Ввести сообщение"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <div>
            <input
              type="submit"
              value={"Отправить"}
              onClick={(e) => sendMessage(e)}
            />
          </div>
        </form>
      </section>
      <div className="messages">
        {messages.map((mess) => (
          <div key={mess.id}>
            {mess.event === "connection" ? (
              <div>Пользователь {mess.username} подключился</div>
            ) : (
              <div
                className={
                  mess.userId === userId ? "message myMessage" : "message"
                }
              >
                {mess.username}: {mess.message}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    // <div className="center">
    //   <div>
    //     <div className="form">
    //       <input
    //         value={value}
    //         onChange={(e) => setValue(e.target.value)}
    //         type="text"
    //       />
    //       <button onClick={sendMessage}>Отправить</button>
    //     </div>
    //     <div className="messages">
    //       {messages.map((mess) => (
    //         <div key={mess.id}>
    //           {mess.event === "connection" ? (
    //             <div className="connection_message">
    //               Пользователь {mess.username} подключился
    //             </div>
    //           ) : (
    //             <div className="message">
    //               {mess.username}: {mess.message}
    //             </div>
    //           )}
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    // </div>
  );
};
