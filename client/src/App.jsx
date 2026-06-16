import { Routes, Route } from "react-router-dom";
import Room from "./pages/Room";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Room />} />
      <Route path="/room/:roomId" element={<Room />} />
    </Routes>
  );
}

export default App;