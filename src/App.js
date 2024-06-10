
import React, { useState, useEffect } from 'react';
import ItemList from './components/ItemList';
import AddItem from './components/AddItem';
import { GlobalStyle } from './styles/global';
import styled from 'styled-components';
import pontes from './pontes2.png'; 

const Container = styled.div`
  background-color: #121212;
  color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Header = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  color: #4caf50;
  font-size: 2.5em;
  margin: 0;
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
      <GlobalStyle />
      <Header>
        <img src={pontes} alt="Ícone" style={{ width: '50px', height: '50px', marginRight: '10px' }} />
        <Title>Timer Itens</Title>
      </Header>
      <AddItem onItemAdded={handleItemAdded} />
      <ItemList
        itens={itens}
        onItemUpdated={handleItemUpdated}
        onItemDeleted={handleItemDeleted}
      />
    </Container>
  );
}

export default App;