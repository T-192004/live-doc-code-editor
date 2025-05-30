import { useEffect, useRef, useState } from 'react';
import Client from './Client';
import Editor from './Editor';
import { initSocket } from '../Socket';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';

function EditorPage() {
  // State to keep track of all connected clients in the room
  const [clients, setClients] = useState([]);

  // useRef to store the socket instance and code value persistently
  const socketRef = useRef(null);
  const codeRef = useRef(null);

  // React Router hooks to get current location, roomId param and navigate function
  const location = useLocation();
  const { roomId } = useParams();
  const navigate = useNavigate();

  // Ref to prevent multiple connection attempts when component re-renders
  const connectionAttempted = useRef(false);

  useEffect(() => {
    // If no username provided in navigation state, redirect to home page
    if (!location.state?.username) {
      navigate("/");
      return;
    }

    // Prevent multiple socket connection attempts
    if (connectionAttempted.current) return;
    connectionAttempted.current = true;

    const initSocketConnection = async () => {
      try {
        // Initialize socket connection
        socketRef.current = await initSocket();

        // Error handler to display error toast and redirect home on connection failure
        const handleError = (e) => {
          console.error("Socket Error:", e);
          toast.error("Socket Connection Failed");
          navigate("/");
        };

        // Attach error event listeners on socket
        socketRef.current.on("connect_error", handleError);
        socketRef.current.on('connect_failed', handleError);

        // Emit join event to server with roomId and username
        // The callback handles error or sets the initial clients list on success
        const joinRoom = () => {
          socketRef.current.emit('join', {
            roomId,
            username: location.state.username,
          }, (response) => {
            if (response.error) {
              toast.error(response.error);
              navigate("/");
            } else {
              setClients(response.clients);
            }
          });
        };

        joinRoom();

        // Listener for when new clients join
        // It adds new clients to the clients state and shows toast notification
        const handleJoined = ({ clients: newClients, username }) => {
          setClients(prevClients => {
            // Map existing clients by socketId for quick lookup
            const clientMap = new Map(prevClients.map(c => [c.socketId, c]));
            
            // Only add new clients that do not already exist in the state
            const updatedClients = [...prevClients];
            newClients.forEach(newClient => {
              if (!clientMap.has(newClient.socketId)) {
                updatedClients.push(newClient);
                // Show toast only for other users joining (not self)
                if (newClient.username !== location.state.username) {
                  toast.success(`${newClient.username} joined the room`);
                }
              }
            });
            
            return updatedClients;
          });
        };

        // Listener for when a client disconnects
        // Removes the client from clients state and shows a toast
        const handleDisconnected = ({ socketId, username }) => {
          setClients(prevClients => {
            const newClients = prevClients.filter(c => c.socketId !== socketId);
            if (newClients.length !== prevClients.length) {
              toast.success(`${username} left the room`);
            }
            return newClients;
          });
        };

        // Listen for other events:
        // - joined: when new clients join
        // - disconnected: when clients leave
        // - code-change: updates local codeRef with latest code
        socketRef.current.on('joined', handleJoined);
        socketRef.current.on('disconnected', handleDisconnected);
        socketRef.current.on('code-change', ({ code }) => {
          codeRef.current = code;
        });

      } catch (err) {
        // Catch any initialization errors and navigate back with error toast
        console.error("Initialization error:", err);
        toast.error("Failed to initialize connection");
        navigate("/");
      }
    };

    // Start socket initialization
    initSocketConnection();

    // Cleanup function to remove socket listeners and disconnect on unmount
    return () => {
      connectionAttempted.current = false;
      if (socketRef.current) {
        socketRef.current.off('joined');
        socketRef.current.off('disconnected');
        socketRef.current.off('connect_error');
        socketRef.current.off('connect_failed');
        socketRef.current.off('code-change');
        socketRef.current.disconnect();
      }
    };
  }, [roomId, location.state?.username, navigate]);

  // If user somehow ends up here without username, redirect home
  if (!location.state?.username) {
    return <Navigate to="/" />;
  }

  // Function to copy roomId to clipboard with toast notification
  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy Room ID");
    }
  };

  // Function to disconnect socket and navigate home when leaving the room
  const leaveRoom = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    navigate('/');
  };

  return (
    <div className='container-fluid vh-100 p-0 m-0 overflow-hidden'>
      <div className='row h-100 m-0'>
        {/* Sidebar showing connected clients and controls */}
        <div className='col-md-2 bg-dark text-light d-flex flex-column p-0 h-100'>
          <div className='p-3 text-center'>
            <img 
              src="/images/reatime-do-editor.png" 
              className='img-fluid'
              alt="CodeCast"
              style={{ maxWidth: "150px" }}
            />
            <hr />
          </div>

          {/* List of clients connected in the room */}
          <div className='flex-grow-1 overflow-auto px-2'>
            {clients.map(client => (
              <Client 
                key={client.socketId} 
                username={client.username} 
              />
            ))}
          </div>

          {/* Buttons to copy room ID and leave room */}
          <div className='p-3'>
            <button 
              onClick={copyRoomId} 
              className='btn btn-success mb-2 w-100 p-2'
            >
              Copy Room ID
            </button>
            <button 
              onClick={leaveRoom} 
              className='btn btn-danger w-100 p-2'
            >
              Leave Room
            </button>
          </div>
        </div>

        {/* Main editor area */}
        <div className='col-md-10 p-0 h-100 overflow-hidden'>
          <Editor 
            socketRef={socketRef} 
            roomId={roomId} 
            onCodeChange={(code) => codeRef.current = code}
          />
        </div>
      </div>
    </div>
  );
}

export default EditorPage;
