import React, { useState, useEffect } from 'react';
import Item from './Item';

function ItemList({ itens, onItemUpdated, onItemDeleted  }) {
  
  return (
    <div>
      <h2>Lista de Itens</h2>
      <ul>
        {itens.map((item) => (
          <Item
            key={item.id}
            item={item}
            onItemUpdated={onItemUpdated} 
            onItemDeleted={onItemDeleted} 
          />
        ))}
      </ul>
    </div>
  );
}

export default ItemList;