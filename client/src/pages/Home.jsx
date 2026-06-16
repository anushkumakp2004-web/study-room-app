import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Study Room App</h1>

      <p>Study together in real time.</p>

      <Link to="/room">
        <button>Join Study Room</button>
      </Link>
    </div>
  );
}

export default Home;