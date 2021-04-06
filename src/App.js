import axios from "axios";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import "./App.css";
import Chat from "./Component/Chat/Chat";
import Sidebar from "./Component/Sidebar/Sidebar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./Login";
import { useStateValue } from "./StateProvider";

function App() {
  const [messages, setMessages] = useState([]);
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    axios
      .get("https://blooming-sea-28460.herokuapp.com/messages/sync")
      .then((res) => {
        setMessages(res.data);
        console.log(res.data);
      });
  }, []);

  useEffect(() => {
    const pusher = new Pusher("78de5c1299a9a28fc770", {
      cluster: "eu",
    });

    const channel = pusher.subscribe("messages");
    channel.bind("inserted", function (newMessage) {
      setMessages([...messages, newMessage]);
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);

  console.log(messages);

  return (
    <div className="app">
      {!user ? (
        <Login></Login>
      ) : (
        <div className="app__body">
          <Router>
            <Sidebar></Sidebar>
            <Switch>
              <Route path="/rooms/:roomId">
                <Chat messages={messages}></Chat>
              </Route>
              <Route path="/">
                <Chat messages={messages} />
              </Route>
            </Switch>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
