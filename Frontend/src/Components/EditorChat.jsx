import { FaPaperPlane, FaSave, FaExpand, FaCompress } from "react-icons/fa"
import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { ServerUrl } from "../../config/backendUrl"

export default function EditorChat({ website, onWebsiteUpdate, onSave, onPreviewUpdate }) {
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [chatMessages, setChatMessages] = useState(website?.conversion || [])
  const [currentCode, setCurrentCode] = useState(website?.lcode || "")
  const [showFullscreenPreview, setShowFullscreenPreview] = useState(false)

  const bottomRef = useRef()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages, isLoading])

  useEffect(() => {
    if (website) {
      setChatMessages(website.conversion || [])
      setCurrentCode(website.lcode || "")
    }
  }, [website])

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) {
      console.log("Cannot send: message empty or loading");
      return
    }

    if (!website?._id) {
      console.error("No website ID found!");
      alert("Error: Website not loaded properly. Please refresh the page.");
      return;
    }

    const userMessage = message.trim()
    setMessage("")
    setIsLoading(true)

    const updatedMessages = [
      ...chatMessages,
      { role: "user", content: userMessage }
    ]
    setChatMessages(updatedMessages)

    const apiUrl = `${ServerUrl}/api/website/update/${website._id}`;
    console.log(" Sending to:", apiUrl);
    console.log(" Data:", { prompt: userMessage });

    try {
      const response = await axios.post(
        apiUrl,
        { prompt: userMessage },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      console.log(" Response:", response.data);

      if (response.data.success && response.data.code) {
        const finalMessages = [
          ...updatedMessages,
          { role: "ai", content: response.data.message }
        ]

        setChatMessages(finalMessages)
        setCurrentCode(response.data.code)

        if (onPreviewUpdate) {
          onPreviewUpdate(response.data.code)
        }

        if (onWebsiteUpdate) {
          onWebsiteUpdate({
            ...website,
            lcode: response.data.code,
            conversion: finalMessages
          })
        }
      } else {
        console.error("Invalid response structure:", response.data);
        const errorMessages = [
          ...updatedMessages,
          {
            role: "ai",
            content: response.data.message || "Update received but response was invalid."
          }
        ]
        setChatMessages(errorMessages)
      }
    } catch (error) {
      console.error(" Chat error:", error);
      
      let errorMessage = "Something went wrong. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 402) {
        errorMessage = "Insufficient credits! Please purchase more credits.";
      } else if (error.response?.status === 404) {
        errorMessage = "API endpoint not found. Please check server configuration.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      const errorMessages = [
        ...updatedMessages,
        {
          role: "ai",
          content: ` ${errorMessage}`
        }
      ]

      setChatMessages(errorMessages)

      if (onWebsiteUpdate) {
        onWebsiteUpdate({
          ...website,
          conversion: errorMessages
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveChanges = async () => {
    if (!website || !currentCode) {
      alert("No website or code to save");
      return;
    }
    
    setIsSaving(true)
    try {
      const response = await axios.put(
        `${ServerUrl}/api/website/save/${website._id}`,
        { 
          lcode: currentCode,
          conversion: chatMessages 
        },
        { withCredentials: true }
      )

      console.log("Save response:", response.data);

      if (response.data.success) {
        alert(" Changes saved successfully!")
        
        if (onSave) {
          onSave(response.data.website)
        }
        
        if (onWebsiteUpdate) {
          onWebsiteUpdate({
            ...website,
            lcode: currentCode,
            conversion: chatMessages
          })
        }
      } else {
        alert(" Failed to save changes: " + (response.data.message || "Unknown error"))
      }
    } catch (error) {
      console.error("Save error:", error)
      alert(error?.response?.data?.message || " Failed to save changes")
    } finally {
      setIsSaving(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleFullscreenPreview = () => {
    setShowFullscreenPreview(!showFullscreenPreview)
  }

  return (
    <>
      <div className="relative flex flex-col h-full bg-[#0F0F0F] text-white">
        <div className="px-3 py-3 border-b border-gray-800">
          <h3 className="text-sm font-semibold text-gray-400">
            Chat Assistant
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Modify your website (2 credits per message)
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 pb-24 hide-scrollbar">
          {chatMessages?.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-8">
              <p>No messages yet</p>
              <p className="text-xs mt-2">Start by asking me to make changes to your website!</p>
            </div>
          ) : (
            chatMessages.map((m, i) => {
              const isUser = m.role === "user"

              return (
                <div
                  key={i}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`
                      relative max-w-[75%] px-4 py-2 text-sm leading-relaxed
                      rounded-2xl overflow-visible
                      ${isUser
                        ? "bg-white text-black rounded-br-md shadow-md"
                        : "bg-[#111111] text-gray-200 border border-gray-800 rounded-bl-md"
                      }
                    `}
                  >
                    {!isUser && (
                      <div className="absolute inset-0 rounded-2xl opacity-10 blur-sm bg-white pointer-events-none"></div>
                    )}

                    <span className="relative z-10 block whitespace-pre-wrap break-words">
                      {m.content}
                    </span>
                  </div>
                </div>
              )
            })
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#111111] border border-gray-800 rounded-2xl px-4 py-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></span>
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="w-full px-3 py-2 bg-[#0F0F0F] border-t border-gray-800">
          <div className="flex gap-2 items-end">
            <textarea
              placeholder="Ask me to update your website..."
              rows={1}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              className="flex-1 px-3 py-1.5 text-sm resize-none bg-[#1a1a1a] text-white rounded-lg outline-none overflow-y-auto scrollbar-hide"
            />
            
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !message.trim()}
              className="px-3 cursor-pointer py-2 bg-white text-black rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-all"
              title="Send message"
            >
              <FaPaperPlane />
            </button>

            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="px-3 cursor-pointer py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all"
              title="Save changes"
            >
              <FaSave />
            </button>

            <button
              onClick={toggleFullscreenPreview}
              className="px-3 cursor-pointer py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
              title="Fullscreen Preview"
            >
              <FaExpand size={14} />
            </button>
          </div>
        </div>
      </div>

      {showFullscreenPreview && (
        <div
          className="fixed inset-0 z-[10000] bg-black"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "black",
            zIndex: 10000,
          }}
        >
          <button
            onClick={toggleFullscreenPreview}
            className="fixed top-4 right-4 z-[10001] bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full transition-all"
            title="Close Preview"
          >
            <FaCompress size={20} />
          </button>

          <div className="w-full h-full">
            {currentCode ? (
              <iframe
                title="Fullscreen Website Preview"
                srcDoc={currentCode}
                className="w-full h-full border-none"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
                style={{
                  backgroundColor: "white",
                  display: "block",
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-white">
                <div className="text-center">
                  <p className="text-gray-400 mb-4">No website content to preview</p>
                  <button
                    onClick={toggleFullscreenPreview}
                    className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="fixed top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 pointer-events-none">
            <h2 className="text-white text-lg font-semibold text-center">
              {website?.title || "Website Preview"}
            </h2>
          </div>
        </div>
      )}
    </>
  )
}