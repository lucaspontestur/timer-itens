import React, { useState } from 'react';

function AddItem({ onItemAdded }) { 
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prazo, setPrazo] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/itens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, valor, descricao, prazo }),
      });

      if (response.ok) {
        const data = await response.json(); 
        setNome('');
        setValor('');
        setDescricao('');
        setPrazo('');

        onItemAdded({ id: data.id, nome, valor, descricao, prazo }); 
      } else {
        console.error('Erro ao adicionar item:', response.status);
      }
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
    }
  };

  return (
    <div>
      <h2>Adicionar Item</h2>
      <form onSubmit={handleSubmit}> 
        <div>
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="valor">Valor:</label>
          <input
            type="number"
            id="valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="descricao">Descrição:</label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="prazo">Prazo (YYYY-MM-DD):</label>
          <input
            type="date"
            id="prazo"
            value={prazo}
            onChange={(e) => setPrazo(e.target.value)}
          />
        </div>
        <button type="submit">Adicionar</button>
      </form>
    </div>
  );
}

export default AddItem;