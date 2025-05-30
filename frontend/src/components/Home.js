import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { v4 as uuid } from 'uuid';

function Home() {
  // State variables for form inputs and UI control
  const [roomName, setRoomName] = useState('');          // Name of the room to create
  const [roomId, setRoomID] = useState('');              // Current room ID (not used much here)
  const [newRoomId, setNewRoomId] = useState('');        // Newly generated Room ID for creating room
  const [joinRoomId, setJoinRoomId] = useState('');      // Room ID input for joining a room
  const [joinedRooms, setJoinedRooms] = useState([]);    // List of rooms the user has joined in past
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);  // Loading state for room creation
  const [mode, setMode] = useState('create');            // UI mode: 'create' or 'join'
  
  // Get username and user info from localStorage
  const username = localStorage.getItem('username');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // Fetch the list of rooms the user has joined from backend API when component mounts
  useEffect(() => {
    const fetchJoinedRooms = async () => {
      try {
        // API call to get user's joined rooms, using user's id and auth token
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/rooms/user/${user.id}`, {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch joined rooms');
        }

        const data = await response.json();
        console.log(data.rooms);
        setJoinedRooms(data.rooms);  // Update state with rooms list
      } catch (error) {
        toast.error(error.message || 'Failed to fetch joined rooms');
      }
    };

    fetchJoinedRooms();
  }, [user.id]);

  // Handler to create a new room on form submission
  const createNewRoom = async (e) => {
    e.preventDefault();

    // Validate room name and generated room ID
    if (!roomName.trim()) {
      toast.error('Please enter a room name');
      return;
    }

    if (!newRoomId) {
      toast.error('Please generate a room ID first');
      return;
    }

    setIsCreatingRoom(true);
    toast.loading('Creating a new room...');
    try {
      // POST request to create new room with name, ID, and userId
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({
          name: roomName,
          roomId: newRoomId,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create room');
      }

      const data = await response.json();
      toast.dismiss();
      toast.success(`Room "${data.room.name}" created successfully!`);

      // Navigate to editor page for the new room, passing username and room name via state
      navigate(`/editor/${newRoomId}`, {
        state: {
          username: user.username,
          roomName: data.room.name,
        },
      });
    } catch (error) {
      toast.dismiss();
      toast.error(error.message || 'Failed to create room');
    } finally {
      setIsCreatingRoom(false);
    }
  };

  // Handler to join an existing room on form submission
  const joinRoom = async (e) => {
    e.preventDefault();

    if (!joinRoomId) {
      toast.error('Room ID is required');
      return;
    }

    try {
      toast.loading('Joining room...');

      // Fetch room details to validate if room exists
      const roomResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/rooms/${joinRoomId}`);
      if (!roomResponse.ok) {
        throw new Error('Room not found');
      }
      const roomData = await roomResponse.json();

      // POST request to join the room (e.g., update DB that user joined)
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/rooms/${joinRoomId}/join`, {
        method: 'POST',
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({
          roomName: roomData.name,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to join room');
      }

      const data = await response.json();
      toast.dismiss();
      toast.success(`Joined room "${data.room.name}"`);

      // Navigate to the editor page for the joined room, passing username via state
      navigate(`/editor/${joinRoomId}`, { state: { username } });
    } catch (error) {
      toast.dismiss();
      toast.error(error.message || 'Failed to join room');
    }
  };

  // Handler to logout user and clear localStorage, then redirect to login page
  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  // Handler to generate a new unique Room ID using uuid
  const generateRoomId = (e) => {
    e.preventDefault();
    const newId = uuid();
    setNewRoomId(newId);
    setRoomID(newId);
    toast.success('Room ID generated successfully');
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center align-items-center min-vh-100">

        {/* Sidebar showing the list of past rooms user has joined */}
        <div className="col-12 col-md-4 col-lg-3 bg-dark text-light p-3" style={{ height: '100vh', overflowY: 'auto' }}>
          {/* Logo Image */}
          <img
            className="img-fluid mx-auto d-block mb-3"
            src="/images/reatime-do-editor.png"
            alt="logo"
            style={{ maxWidth: '150px' }}
          />
          <h5 className="text-light p-2">Past Joined Rooms</h5> {/* Header for the sidebar */}

          {/* List of joined rooms */}
          <ul className="list-group">
            {joinedRooms.length === 0 ? (
              <p className='text-center'>No Past Rooms Joined</p>
            ) : (
              joinedRooms.map((room) => (
                <li
                  key={room.roomId}
                  className="text-light"
                  style={{
                    backgroundColor: "rgb(49, 48, 48)",
                    border: "2px solid rgb(80, 81, 81)",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    marginBottom: "10px",
                    fontSize: "16px",
                    fontWeight: "500",
                    listStyle: "None",
                    transition: "all 0.2s ease-in-out",
                    boxShadow: "0 1px 2px rgba(157, 154, 154, 0.04)",
                    cursor: "pointer",
                  }}
                >
                  {/* Button to navigate to the editor of selected room */}
                  <button
                    className="btn btn-link text-light"
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      padding: '0',
                      textDecoration: 'underline',
                    }}
                    onClick={() => navigate(`/editor/${room.roomId}`, { state: { username } })}
                  >
                    {room.name}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Main content area: Create or Join Room forms */}
        <div className="col-12 col-md-8 col-lg-9 p-5">
          <div className="card shadow-sm p-2 mb-5 bg-secondary rounded">
            <div className="card-body text-center bg-dark">

              {/* Logo Image */}
              <img
                className="img-fluid mx-auto d-block mb-3"
                src="/images/reatime-do-editor.png"
                alt="logo"
                style={{ maxWidth: '150px' }}
              />

              {/* Welcome message */}
              <h3 className="text-light mb-3">Welcome, {username}</h3>

              {/* Toggle buttons to switch between Create Room and Join Room modes */}
              <div className="mb-4">
                <button
                  className={`btn ${mode === 'create' ? 'btn-primary' : 'btn-outline-primary'} mx-2`}
                  onClick={() => setMode('create')}
                >
                  Create Room
                </button>
                <button
                  className={`btn ${mode === 'join' ? 'btn-success' : 'btn-outline-success'} mx-2`}
                  onClick={() => setMode('join')}
                >
                  Join Room
                </button>
              </div>

              {/* Create Room form */}
              {mode === 'create' && (
                <form onSubmit={createNewRoom}>
                  <h4 className="text-light mb-3">Create New Room</h4>
                  <div className="form-group mb-3">
                    <input
                      type="text"
                      className="form-control mb-2 text-center"
                      placeholder="Enter room name"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group mb-3 d-flex align-items-center">
                    {/* Readonly input showing generated Room ID */}
                    <input
                      type="text"
                      className="form-control text-center"
                      placeholder="Room ID"
                      value={newRoomId}
                      readOnly
                    />
                    {/* Button to generate a new room ID */}
                    <button
                      className="btn btn-outline-light ms-2"
                      onClick={generateRoomId}
                    >
                      Generate ID
                    </button>
                  </div>

                  {/* Submit button for room creation */}
                  <div className="d-grid gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={isCreatingRoom || !roomName || !newRoomId}
                    >
                      {isCreatingRoom ? 'Creating...' : 'CREATE ROOM'}
                    </button>
                  </div>
                </form>
              )}

              {/* Join Room form */}
              {mode === 'join' && (
                <form onSubmit={joinRoom} className="mt-4">
                  <h4 className="text-light mb-3">Join Existing Room</h4>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Room ID"
                      value={joinRoomId}
                      onChange={(e) => setJoinRoomId(e.target.value)}
                      required
                    />
                    <button
                      type="submit"
                      className="btn btn-success"
                      disabled={!joinRoomId}
                    >
                      Join
                    </button>
                  </div>
                </form>
              )}

              {/* Logout button */}
              <button className="btn btn-danger mt-4" onClick={logout}>
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
