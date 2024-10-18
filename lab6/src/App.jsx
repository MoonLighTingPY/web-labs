
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Navigation from './components/Navigation.jsx';
import HomeContent from './components/HomeContent.jsx';
import BookList from './components/BookList.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Navigation />
        <Routes>
          <Route path="/" element={<HomeContent />} />
          <Route path="/books" element={<BookList />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;