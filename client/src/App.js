import React,{useState} from "react";
import { Outlet, useNavigate, useParams, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar"
import './App.css';
import ChatRoom from "./components/ChatRoom";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token,setToken] = useState(localStorage.getItem('token'));
  const [chatOpen, setChatOpen] = useState(false);

  const navigate = useNavigate();
  const { roomCode } = useParams();
  const location = useLocation();
  const showChat = roomCode || location.pathname.includes("/room/");
  console.log(showChat)

  React.useEffect(() => {
    if (token) {
      fetch(`${process.env.REACT_APP_BACKEND_URL_production}/user`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setUserData(data);
          setIsAuthenticated(true);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          console.error('Error:', error);
        });
    } else {
      console.log('Please log in');
      setIsLoading(false);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    navigate({ pathname: '/', state: { isAuthenticated: isAuthenticated } });  
    window.location.reload();  
  };

  
  
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <>
    <Navbar isAuthenticated={isAuthenticated} handleLogout={handleLogout} userData={userData} isLoading={isLoading} handleLogin={handleLogin}/>
    <Outlet />
    {showChat && (
      <>
        {/*Floating chat button */}
        <button 
          onClick={() => setChatOpen(!chatOpen)}
          className="fixed bottom-5 right-5 bg-blue text-white p-4 rounded-full shadow-lg z-50"
        >
          💬
        </button>

        {/* Chat window */}
        {chatOpen && (
          <div className="fixed bottom-16 right-5 w-96 h-96 bg-amber-50 border rounded-xl shadow-lg z-50 flex flex-col">
            <div className="flex justify-between items-center p-2 border-b">
              <h3 className="font-bold">Chat</h3>
              <button onClick={()=> setChatOpen(false)}>❌</button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <ChatRoom userData={userData}/>
            </div>
          </div>
        )}
      </>
    )}
    </>
  );
  
}

export default App;
