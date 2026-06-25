import { Routes, Route } from "react-router-dom";
import Room from "./pages/Room";
import CreateRoom from "./pages/CreateRoom";
import Home from "./pages/Home";
function App() {
  return (
    <Routes>
      <Route
  path="/"
  element={<Home />}
/>
<Route
  path="/create"
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
