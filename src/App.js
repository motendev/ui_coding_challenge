import logo from './logo.svg';
import './App.css';
import ProductList from './ui/productList.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Glorious product store of the glorious state of New Productonia</h1>
      </header>
      <main>
        <ProductList></ProductList>
      </main>
    </div>
  );
}

export default App;
