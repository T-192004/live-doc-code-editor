// Importing the 'io' function from the socket.io-client package
import { io } from 'socket.io-client';

// Function to initialize the socket connection with specific configuration options
export const initSocket = async () => {
    // Configuration options for the socket connection
    const options = {
        'force new connection': true,         // Always create a new connection instead of reusing existing ones
        reconnectionAttempts: 'Infinity',     // Attempt to reconnect an unlimited number of times if disconnected
        timeout: 10000,                       // Set connection timeout to 10 seconds (10000 milliseconds)
        transports: ['websocket'],            // Use WebSocket transport only for better real-time performance
    };

    // Establish and return a socket connection using the backend URL defined in environment variables
    return io(process.env.REACT_APP_BACKEND_URL, options);
};
