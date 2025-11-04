import { useEffect, useRef, useState } from 'react';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function ChatWindow() {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [stage, setStage] = useState('intro');
  const [loading, setLoading] = useState(false);
  const filePanRef = useRef(null);
  const fileAadhaarRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    // start a session on mount
    const start = async () => {
      try {
        const res = await fetch(`${API}/api/session/start`, { method: 'POST' });
        const data = await res.json();
        setSessionId(data.session_id);
        setMessages([data.message]);
      } catch (e) {
        console.error(e);
      }
    };
    start();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input, timestamp: new Date().toISOString() };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, message: userMsg.content }),
      });
      const data = await res.json();
      setSessionId(data.session_id);
      setStage(data.stage);
      setMessages(m => [...m, data.reply]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!filePanRef.current?.files?.[0] || !fileAadhaarRef.current?.files?.[0]) return;
    setLoading(true);
    try {
      const form = new FormData();
      form.append('session_id', sessionId);
      form.append('pan', filePanRef.current.files[0]);
      form.append('aadhaar', fileAadhaarRef.current.files[0]);
      const res = await fetch(`${API}/api/verification/upload`, {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (data?.message) {
        setMessages(m => [...m, data.message]);
        setStage('underwriting');
        // clear files
        filePanRef.current.value = '';
        fileAadhaarRef.current.value = '';
      }
    } catch (e) {
      console.error(e);
      alert('Upload failed. Please make sure files are JPG/PNG/PDF and at least 10KB.');
    } finally {
      setLoading(false);
    }
  };

  const generateLetter = async () => {
    try {
      const res = await fetch(`${API}/api/sanction/generate/${sessionId}`, { method: 'POST' });
      const data = await res.json();
      if (data.letter) {
        const blob = new Blob([data.letter], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'LoanLens_Sanction_Letter.txt';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
      <div className="rounded-2xl border border-gray-200 shadow-sm bg-white overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="font-semibold">LoanLens AI – Chat</div>
          <div className="text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-700">Stage: {stage}</div>
        </div>

        <div className="h-[420px] overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.map((m, i) => (
            <div key={i} className={`max-w-[85%] ${m.role === 'user' ? 'ml-auto text-right' : ''}`}>
              <div className={`inline-block px-4 py-2 rounded-2xl ${m.role === 'user' ? 'bg-purple-600 text-white' : 'bg-white border'}`}>
                <p className="text-sm whitespace-pre-wrap">{m.content}</p>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Verification uploader */}
        {stage === 'verification' && (
          <div className="px-4 py-3 border-t bg-white grid md:grid-cols-3 gap-3 items-center">
            <div className="md:col-span-2 flex gap-3 items-center">
              <input ref={filePanRef} type="file" accept="image/*,application/pdf" className="block w-full text-sm" />
              <input ref={fileAadhaarRef} type="file" accept="image/*,application/pdf" className="block w-full text-sm" />
            </div>
            <button onClick={handleUpload} disabled={loading} className="px-4 py-2 rounded-lg bg-purple-600 text-white disabled:opacity-50">Upload KYC</button>
          </div>
        )}

        {/* Sanction letter quick action */}
        {stage === 'sanction' && (
          <div className="px-4 py-3 border-t bg-white flex items-center gap-3">
            <button onClick={generateLetter} className="px-3 py-2 rounded-lg bg-green-600 text-white">Generate Letter</button>
            <span className="text-sm text-gray-600">Or say “yes” in chat to proceed.</span>
          </div>
        )}

        {/* Composer */}
        <div className="px-4 py-3 border-t bg-white flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button onClick={sendMessage} disabled={loading} className="px-4 py-2 rounded-lg bg-purple-600 text-white disabled:opacity-50">Send</button>
        </div>
      </div>
    </div>
  );
}
