import { useContext, useEffect, useRef, useState } from 'react'
import './App.css'
import { instance } from '../api/api'
import AuthContextProvider, { AuthContext } from '../context/AuthContext'


function App() {
  const [file, setFile] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState(() => {
    if (typeof window === 'undefined') {
      return [{ role: 'assistant', content: 'Upload a PDF and start a conversation.' }]
    }

    try {
      const savedMessages = localStorage.getItem('pdf-chat-messages')
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages)
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          return parsedMessages
        }
      }
    } catch (storageError) {
      console.error('Failed to load saved chat history:', storageError)
    }

    return [{ role: 'assistant', content: 'Upload a PDF and start a conversation.' }]
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { logout } = useContext(AuthContext)
  const [name, setName] = useState()
  const messagesEndRef = useRef(null)
  
  const useSimplerTimer = () => {
    const [time, setTime] = useState({
      timeValue: 0,
      prevTime: Date.now()
    });

    useEffect(() => {
      const interval = setInterval(() => {
        const now = Date.now();

        setTime(prev => ({
          timeValue: prev.timeValue + (now - prev.prevTime),
          prevTime: now
        }));
      }, 1000);

      return () => clearInterval(interval);
    }, []);

   return Math.round(time.timeValue / 1000);
  };

  const elapsedTime = useSimplerTimer(loading);
 
 

  const handleFileChange = (event) => {
    setFile(event.target.files?.[0] ?? null)
    setError(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)

    if (!file) {
      setError('Please choose a PDF file before submitting.')
      return
    }

    const trimmedPrompt = prompt.trim()

    if (!trimmedPrompt) {
      setError('Please enter a prompt to process the PDF.')
      return
    }

    setMessages((prev) => [...prev, { role: 'user', content: trimmedPrompt }])

    const formData = new FormData()
    formData.append('name', file.name)
    formData.append('file', file)
    formData.append('prompt', trimmedPrompt)

    setLoading(true)
    setPrompt('')
    

    try {
      const res = await instance.post('api/uploadpdf/', formData)

      if (res.status !== 200) {
        throw new Error('Upload failed')
      }


      const assistantReply = res.data.response || 'No response returned from the server.'
      setMessages((prev) => [...prev, { role: 'assistant', content: assistantReply }])
    } catch (uploadError) {
      setError(uploadError.message)
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I could not generate a response.' }])
    } finally {
      setLoading(false)
    }
  }

   const fetchUploadList = async () => {
    try {
      const response = await instance.get("api/uploadpdfList/");
      setName(response.data);
      
      console.log(response.data)
     
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchUploadList()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    try {
      localStorage.setItem('pdf-chat-messages', JSON.stringify(messages))
      
    } catch (storageError) {
      console.error('Failed to save chat history:', storageError)
    }
  }, [messages])

  return (
    <div className="page-shell">
      <div className="chat-app">
        <aside className="sidebar">
          <div className="brand">PDF Chat</div>
          <div className="sidebar-card">
            <p className="sidebar-label">Upload PDF</p>
            <label className="upload-pill" htmlFor="pdf-upload">
              {file ? file.name : 'Choose PDF'}
            </label>
            <input id="pdf-upload" type="file" accept="application/pdf" onChange={handleFileChange} />
          </div>
          <div className="sidebar-card compact">
            <p className="sidebar-label">Last Pdf Upload</p>
            
            {name?.map((pdf) => (
              <div key={pdf.id}>
                {pdf.name}
              </div>
            ))}
            
          </div>
        </aside>

        <main className="chat-panel">
          <div className="chat-header">
            <div>
              <p className="eyebrow">AI Assistant</p>
              <div>
                <button onClick={logout}><a>Logout</a></button>
              </div>
              <h1>Ask anything about your document</h1>
            </div>
          </div>

          <div className="messages">
            {messages.map((message, index) => (
              
              <div key={`${message.role}-${index}`} className={`message-row ${message.role}`}>
                 {/* {message.content ? <p>yes</p> : <p>No</p>} */}
                <div className={`avatar ${message.role === 'assistant' ? 'ai' : ''}`}>
                  {message.role === 'assistant' ? 'A' : 'U'}
                </div>
                <div className={`bubble ${message.role === 'assistant' ? 'assistant-bubble' : ''}`}>
                  {message.role === 'assistant' ? <pre>{message.content}</pre> : message.content}
                </div>
              </div>
            ))}

            {error && <p className="error-message">{error}</p>}
            <div ref={messagesEndRef} />
          </div>
          {loading && <p>Thinking... {seconds}s</p>}
          <form className="composer" onSubmit={handleSubmit}>
            <textarea
              className="prompt-input"
              placeholder="Ask a question about the PDF..."
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={3}
            />
            
            <button className="submit-button" type="submit" disabled={loading}>
              {loading ? 'Thinking...' : 'Send'}
            </button>

          </form>
          
        </main>
      </div>
    </div>
  )
}

export default App
