import { Routes, Route } from "react-router-dom";
import Room from "./pages/Room";
import CreateRoom from "./pages/CreateRoom";

function App() {
  return (
    <Routes>
      <Route
  path="/"
  element={<CreateRoom />}
/>
      <Route
  path="/room/:roomId"
  element={<Room />}
/>
    </Routes>
  );
}

export default App;