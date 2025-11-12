import { BrowserRouter, Routes, Route } from "react-router-dom"
import NavBar from "./components/NavBar"
import HomePage from "./pages/HomePage"
import CreatePage from "./pages/CreatePage"
import ProductPage from "./pages/ProductPage"
import ComingSoon from "./pages/ComingSoon"
import EditPage from "./pages/EditPage"
import Footer from "./components/Footer"

const App = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/products/:id/edit" element={<EditPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
