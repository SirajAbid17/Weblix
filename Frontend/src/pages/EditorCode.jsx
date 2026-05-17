import axios from "axios"
import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ServerUrl } from "../../config/backendUrl"
import EditorDetail from "../Components/EditorDetail"
import EditorChat from "../Components/EditorChat"
import { BeatLoader } from "react-spinners" 
import { FaArrowLeft, FaCode, FaDesktop, FaRocket, FaSave, FaMagic } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import Editor from "@monaco-editor/react";
import prettier from "prettier";
import parserHtml from "prettier/parser-html";
import parserBabel from "prettier/parser-babel";
import parserCss from "prettier/parser-postcss";

export default function EditorCode() {
  const { id } = useParams()
  const navigate = useNavigate()
  const editorRef = useRef(null)

  const [website, setWebsite] = useState(null)
  const [currentWebsite, setCurrentWebsite] = useState(null)
  const [error, setError] = useState("")
  const [view, setView] = useState("preview")
  const [isSaving, setIsSaving] = useState(false)
  const [isFormatting, setIsFormatting] = useState(false)
  const [showSavedNotification, setShowSavedNotification] = useState(false)

  useEffect(() => {
    const fetchWebsite = async () => {
      try {
        const result = await axios.get(
          `${ServerUrl}/api/website/getwebsite/${id}`,
          { withCredentials: true }
        )
        setWebsite(result.data)
        setCurrentWebsite(result.data)
      } catch (error) {
        setError(error?.response?.data?.message || "Error loading website")
      }
    }

    fetchWebsite()
  }, [id])

  const handleWebsiteUpdate = (updatedWebsite) => {
    setCurrentWebsite(updatedWebsite)
    setWebsite(updatedWebsite)
  }

 
  const handleCodeChange = (value) => {
    setCurrentWebsite(prev => ({
      ...prev,
      lcode: value
    }))
  }

  
  const handleSave = async () => {
    setIsSaving(true)
    try {
      await axios.post(
        `${ServerUrl}/api/website/save/${id}`,
        { code: currentWebsite?.lcode, conversion: currentWebsite?.conversion },
        { withCredentials: true }
      )
      setWebsite(currentWebsite)
      setShowSavedNotification(true)
      setTimeout(() => setShowSavedNotification(false), 3000)
    } catch (error) {
      console.error("Save error:", error)
      alert("Failed to save website")
    } finally {
      setIsSaving(false)
    }
  }

 
  const formatCode = async () => {
    if (!currentWebsite?.lcode) return;
    
    setIsFormatting(true);
    try {
      let formattedCode = currentWebsite.lcode;
      
      
      const isHtml = formattedCode.includes('<!DOCTYPE html>') || formattedCode.includes('<html');
      const isCss = formattedCode.includes('<style') || formattedCode.includes('{') && formattedCode.includes('}');
      const isJs = formattedCode.includes('function') || formattedCode.includes('const ') || formattedCode.includes('let ');
      
      if (isHtml) {
        formattedCode = await prettier.format(formattedCode, {
          parser: "html",
          plugins: [parserHtml],
          tabWidth: 2,
          useTabs: false,
          semi: true,
          singleQuote: false,
          printWidth: 80
        });
      } else if (isCss && !isHtml) {
        formattedCode = await prettier.format(formattedCode, {
          parser: "css",
          plugins: [parserCss],
          tabWidth: 2,
          useTabs: false,
          printWidth: 80
        });
      } else if (isJs) {
        formattedCode = await prettier.format(formattedCode, {
          parser: "babel",
          plugins: [parserBabel],
          tabWidth: 2,
          useTabs: false,
          semi: true,
          singleQuote: false,
          printWidth: 80
        });
      }
      
      setCurrentWebsite(prev => ({
        ...prev,
        lcode: formattedCode
      }));
      
     
      const notification = document.createElement('div');
      notification.textContent = 'Code formatted!';
      notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
        z-index: 1000;
        animation: fadeInOut 2s ease;
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 2000);
      
    } catch (error) {
      console.error("Format error:", error);
      alert("Failed to format code. Please check syntax errors.");
    } finally {
      setIsFormatting(false);
    }
  }


  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;
    console.log("Monaco Editor mounted!");
    
    
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
      formatCode();
    });
  };

  if (error) {
    return (
      <div style={{
        height: "100vh",
        width: "100%",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px"
      }}>
        <div style={{ 
          background: "white", 
          padding: "40px", 
          borderRadius: "12px",
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{ color: "red", marginBottom: "10px" }}>Error</h2>
          <p style={{ color: "#333", marginBottom: "20px" }}>{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            style={{
              background: "#2563eb",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
              color: "white",
              cursor: "pointer"
            }}
          >
            Go Back
          </motion.button>
        </div>
      </div>
    )
  }

  if (!website || !currentWebsite) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100%",
          backgroundColor: "black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "20px"
        }}
      >
        <BeatLoader color="#ffffff" size={20} />
        <p style={{ color: "white" }}>Loading your website...</p>
      </div>
    )
  }

  const isModified = website?.lcode !== currentWebsite?.lcode

  const detectLanguage = (code) => {
    if (!code) return 'html';
    if (code.includes('<!DOCTYPE html>') || code.includes('<html')) return 'html';
    if (code.includes('import React') || code.includes('from "react"')) return 'javascript';
    if (code.includes('<?php')) return 'php';
    if (code.includes('def ') || code.includes('import ')) return 'python';
    if (code.includes('{') && code.includes('}') && !code.includes('<html')) return 'css';
    return 'html';
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      
      <div
        style={{
          width: "280px",
          borderRight: "1px solid #2a2a2a",
          background: "#0F0F0F",
          color: "white",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}
      >
        <EditorDetail website={currentWebsite} />
        <div style={{ flex: 1, overflow: "auto" }}>
          <EditorChat 
            website={currentWebsite} 
            onWebsiteUpdate={handleWebsiteUpdate}
          />
        </div>
      </div>

     
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      
        <div
          style={{
            padding: "12px 20px",
            borderBottom: "1px solid #2a2a2a",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#0F0F0F",
            color: "white"
          }}
        >
        
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
              style={{
                background: "#1a1a1a",
                border: "none",
                padding: "8px",
                borderRadius: "6px",
                cursor: "pointer",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s"
              }}
            >
              <FaArrowLeft />
            </motion.button>

            <div>
              <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                {currentWebsite?.title}
              </span>
              {isModified && view === "code" && (
                <span style={{
                  background: "#f59e0b",
                  color: "white",
                  fontSize: "10px",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  marginLeft: "10px"
                }}>
                  Unsaved Changes
                </span>
              )}
            </div>
          </div>

       
          <div style={{ display: "flex", gap: "10px" }}>
           
            {view === "code" && isModified && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={isSaving}
                style={{
                  background: "#10b981",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: isSaving ? "not-allowed" : "pointer",
                  opacity: isSaving ? 0.7 : 1
                }}
              >
                <FaSave /> {isSaving ? "Saving..." : "Save"}
              </motion.button>
            )}

 
            <div style={{ display: "flex", gap: "5px", marginLeft: "10px" }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setView("preview")}
                style={{
                  background: view === "preview" ? "#2a2a2a" : "transparent",
                  border: "1px solid #3a3a3a",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  color: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FaDesktop /> Preview
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setView("code")}
                style={{
                  background: view === "code" ? "#2a2a2a" : "transparent",
                  border: "1px solid #3a3a3a",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  color: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FaCode /> Code
              </motion.button>
            </div>
          </div>
        </div>

       
        <div style={{ 
          flex: 1, 
          padding: "10px", 
          overflow: "auto",
          background: "#111",
          position: "relative"
        }}>
          <AnimatePresence mode="wait">
            {view === "preview" ? (
              <motion.iframe
                key="preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                title="preview"
                srcDoc={currentWebsite?.lcode}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "1px solid #2a2a2a",
                  borderRadius: "8px",
                  background: "white"
                }}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
              />
            ) : (
              <motion.div
                key="code"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                style={{
                  height: "100%",
                  background: "#1e1e1e",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid #2a2a2a"
                }}
              >
                <Editor
                  height="100%"
                  width="100%"
                  language={detectLanguage(currentWebsite?.lcode)}
                  value={currentWebsite?.lcode}
                  onChange={handleCodeChange}
                  theme="vs-dark"
                  options={{
                    readOnly: false,
                    minimap: { enabled: true },
                    fontSize: 13,
                    lineNumbers: "on",
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                    folding: true,
                    renderLineHighlight: "all",
                    lineHeight: 1.6,
                    tabSize: 2,
                    insertSpaces: true,
                    formatOnPaste: true,
                    formatOnType: false,
                    suggestOnTriggerCharacters: true,
                    acceptSuggestionOnEnter: "on",
                    autoClosingBrackets: "always",
                    autoClosingQuotes: "always",
                    autoIndent: "full",
                    smoothScrolling: true,
                    cursorBlinking: "smooth",
                    cursorSmoothCaretAnimation: true,
                  }}
                  onMount={handleEditorMount}
                />
              </motion.div>
            )}
          </AnimatePresence>

        
          <AnimatePresence>
            {showSavedNotification && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                style={{
                  position: "fixed",
                  bottom: "20px",
                  right: "20px",
                  background: "#10b981",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  zIndex: 1000
                }}
              >
                 Website saved successfully!
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}