import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";



const App = () => {
    // Sample data to search through
     return (
    <div className="w-full p-6">
      <Navbar />
      
      <Outlet />

      </div>
  );
};
export default App;
