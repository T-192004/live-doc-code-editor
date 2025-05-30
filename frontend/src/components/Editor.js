import React, { useEffect, useRef } from 'react';
// CodeMirror configuration imports
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror.css";

import CodeMirror from "codemirror";

// Editor component to handle real-time collaborative code editing
function Editor({ socketRef, roomId, onCodeChange }) {
  const editorRef = useRef(null); // Reference to the CodeMirror editor instance

  useEffect(() => {
    // Initialize CodeMirror editor
    const init = async () => {
      const editor = CodeMirror.fromTextArea(
        document.getElementById("realTimeEditor"),
        {
          mode: { name: "javascript", json: true }, // Set editor mode to JavaScript
          theme: "dracula", // Use Dracula theme
          autoCloseTags: true, // Enable auto-closing of HTML tags
          autoCloseBrackets: true, // Enable auto-closing of brackets
          lineNumbers: true, // Show line numbers
        }
      );

      editorRef.current = editor;
      editor.setSize(null, "100%"); // Set full height

      // Handle editor content change
      editor.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code); // Notify parent component of the code change

        // Emit code change to other clients (avoid re-broadcasting setValue changes)
        if (origin !== "setValue") {
          socketRef.current.emit("code-change", {
            roomId,
            code,
          });
        }
      });
    };

    init(); // Call init function when component mounts
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      // Listen for code changes from other users
      socketRef.current.on("code-change", ({ code }) => {
        if (code !== null && editorRef.current) {
          editorRef.current.setValue(code); // Update editor content with received code
        }
      });

      // Request latest code from server when connecting
      socketRef.current.emit("sync-code", {
        roomId,
        socketId: socketRef.current.id,
        code: editorRef.current?.getValue() || "", // Send current code if available
      });
    }

    // Cleanup socket listener on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.off("code-change");
      }
    };
  }, [socketRef.current]);

  return (
    <div style={{ height: "600%" }}>
      {/* Textarea used by CodeMirror to initialize the editor */}
      <textarea id="realTimeEditor"></textarea>
    </div>
  );
}

export default Editor;
