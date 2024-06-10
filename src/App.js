import React, { useState, useEffect } from 'react';
import ItemList from './components/ItemList';
import AddItem from './components/AddItem';

import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  font-family: sans-serif;
`;

function App() {
  const [itens, setItens] = useState([]);

  const buscarItens = async () => {
    try {
      const response = await fetch('http://localhost:5000/itens');
      const data = await response.json();
      setItens(data);
    } catch (error) {
      console.error('Erro ao buscar itens:', error);
    }
  };

  useEffect(() => {
    buscarItens();
  }, []);

  const handleItemAdded = (newItem) => {
    setItens([...itens, newItem]);
    buscarItens(); 
  };

  return (
    <Container>
      <div className="App">
        <h1>Timer Itens</h1>
        <AddItem onItemAdded={handleItemAdded} />
        <ItemList itens={itens} />
      </div>
    </Container>
  );
}

export default App;