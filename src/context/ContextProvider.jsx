import { createContext, useState, useRef } from "react";
import run from "../config/gemini";


export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [current, setCurrent] = useState("");
  const [prev, setPrev] = useState([]);
  const [show, setShow] = useState(false);
  const [load, setLoad] = useState(false);
  const [result, setResult] = useState("");
  const [isStopped, setIsStopped] = useState(false);

  const intervalIdRef = useRef(null);
  const isTypingRef = useRef(false); // Ref to track typing effect status

  const typeEffect = (text) => {
    let index = 0;
    setResult("");  
    isTypingRef.current = true; // Set typing effect as active

    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);  // Clear any previous intervals
    }
  
    intervalIdRef.current = setInterval(() => {
      if (index < text.length) {
        setResult((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;  // Clear reference when done
        isTypingRef.current = false; // Set typing effect as inactive
      }
    }, 30);
  };

  const newchat = () => {
    setLoad(false);
    setShow(false);
    setInput("");
  };

  const formatResponse = (response) => {
    // Step 1: Convert Markdown headings and lists to HTML
    let result = response
      .replace(/^##\s+(.*)$/gm, '<h2>$1</h2>')                // Headings
      .replace(/^\s*-\s+(.*)$/gm, '<li>$1</li>')              // Unordered list items
      .replace(/^\s*\d+\.\s+(.*)$/gm, '<li>$1</li>')         // Ordered list items
      .replace(/^\s*([^\n]+)$/gm, '<p>$1</p>')                // Paragraphs
      .replace(/\*\*/g, '')                                  // Remove bold formatting
      .replace(/\*/g, '<br/>');                              // Line breaks
  
    // Step 2: Wrap list items in unordered lists and handle formatting issues
    result = result
      .replace(/<\/li>\s*<li>/g, '</li>\n<li>')                // Nested lists
      .replace(/<li>/g, '<ul><li>')                          // Start unordered lists
      .replace(/<\/li>\s*$/g, '</li></ul>')                   // End unordered lists
      .replace(/<\/ul>\s*<\/ul>/g, '</ul>')                   // Remove extra unordered lists
      .replace(/<\/p>\s*<h2>/g, '</h2><p>')                   // Paragraph before heading
      .replace(/<\/p>\s*<ul>/g, '</ul><p>')                   // Paragraph before list
      .replace(/<\/p>\s*<\/ul>/g, '</ul>');                   // Remove extra paragraphs
  
    return result.slice(2);
  };

  const onSendClick = async (prompt) => {
    if (isStopped) {
      setIsStopped(false); // Reset the stopped state for new prompt
    }
    setResult("");
    setLoad(true);
    setShow(true);
    let response;

    if (prompt) {
      response = await run(prompt);
      setPrev((prev) => [...prev, prompt]);
      setCurrent(prompt);
    } else {
      setPrev((prev) => [...prev, input]);
      setCurrent(input);
      response = await run(input);
    }
    
    typeEffect(formatResponse(response));

    setLoad(false);
    setInput("");
  };

  const stopGeneration = () => {
    if (isTypingRef.current) { // Only stop if typing effect is active
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null; // Clear the reference
      }
      setIsStopped(true); // Toggle the stopped state
    }
  };

  const contextValue = {
    onSendClick,
    input, setInput,
    current, setCurrent,
    prev, setPrev,
    show, setShow,
    load, setLoad,
    result, setResult,
    newchat,
    isStopped, setIsStopped,
    stopGeneration,
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
