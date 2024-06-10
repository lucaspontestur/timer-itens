import React, { useState, useEffect } from 'react';
import ItemList from './components/ItemList';
import AddItem from './components/AddItem';

import styled from 'styled-components';

const Container = styled.div`
  // ... (estilos) ...
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
    // Busca itens a cada 5 segundos (ajuste o tempo conforme necessário)
    const intervalo = setInterval(buscarItens, 5000); 
    return () => clearInterval(intervalo); 
  }, []);

  const handleItemAdded = (newItem) => {
    setItens([...itens, newItem]);
  };

  const handleItemUpdated = (updatedItem) => {
    setItens((prevItens) =>
      prevItens.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );
  };

  const handleItemDeleted = (deletedItemId) => {
    setItens((prevItens) =>
      prevItens.filter((item) => item.id !== deletedItemId)
    );
  };

  return (
    <Container>
      <div className="App">
        <h1>Timer Itens</h1>
        <AddItem onItemAdded={handleItemAdded} />
        <ItemList
          itens={itens}
          onItemUpdated={handleItemUpdated}
          onItemDeleted={handleItemDeleted}
        />
      </div>
    </Container>
  );
}

export default App;