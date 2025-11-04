import Hero from './components/Hero';
import ProcessSteps from './components/ProcessSteps';
import ChatWindow from './components/ChatWindow';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 text-gray-900">
      <Hero />
      <ProcessSteps current={null} />
      <ChatWindow />
      <Footer />
    </div>
  );
}

export default App;
