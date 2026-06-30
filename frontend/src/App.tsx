import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { CreateAccount } from "./pages/CreateAccount";
import { AccountDetail } from "./pages/AccountDetail";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateAccount />} />
          <Route path="/account/:id" element={<AccountDetail />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
