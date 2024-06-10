import React from 'react';
import Item from './Item';
import styled from 'styled-components';

const ListContainer = styled.div`
  width: 50%;
  margin: 0 auto;
`;

const ItemListContainer = styled.ul`
  list-style: none;
  padding: 0;
`;

function ItemList({ itens, onItemUpdated, onItemDeleted }) {
  return (
    <ListContainer>
      <h2>Lista de Itens</h2>
      <ItemListContainer>
        {itens.map((item) => (
          <Item
            key={item.id}
            item={item}
            onItemUpdated={onItemUpdated}
            onItemDeleted={onItemDeleted}
          />
        ))}
      </ItemListContainer>
    </ListContainer>
  );
}

export default ItemList;