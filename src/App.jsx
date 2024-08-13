import Intro from "./components/Intro";
import MainContent from "./components/MainContent";

function App() {
  return (
    <div className="min-h-screen mx-auto max-w-screen-xl px-6 py-12 lg:px-24 lg:py-0">
      <div className="lg:flex lg:justify-between lg:gap-4">
        <Intro />
        <MainContent />
      </div>
    </div>
  );
}

export default App;
