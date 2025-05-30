// Importing React and Avatar component from 'react-avatar' library
import Avatar from 'react-avatar';
import React from 'react';

// Functional component to display a user with their avatar and username
function Client({ username }) {
  return (
    // Container with flex display to horizontally align avatar and username
    <div className='d-flex align-items-center mb-3'>
      
      {/* Render a circular avatar generated from the username */}
      <Avatar 
        name={username.toString()}  // Ensure username is treated as a string
        size={50}                   // Set avatar size to 50px
        round="14px"                // Slightly rounded corners (not a full circle)
        className='mr-3'            // Margin-right for spacing between avatar and username
      />
      
      {/* Display the username next to the avatar */}
      <p className='mx-2'>{username.toString()}</p>
    </div>
  );
}

export default Client;
