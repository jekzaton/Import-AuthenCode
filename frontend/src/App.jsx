import ImportPage from "./pages/ImportPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./layouts/Footer";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="grow">
        <ImportPage />
      </div>

      <Footer />

      <ToastContainer />
    </div>
  );
}

export default App;