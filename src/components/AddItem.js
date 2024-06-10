import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function AddItem({ onItemAdded }) {
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prazo, setPrazo] = useState(new Date());

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/itens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          valor,
          descricao,
          prazo: prazo.toISOString(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setNome('');
        setValor('');
        setDescricao('');
        setPrazo(new Date());


        onItemAdded({
          id: data.id,
          nome,
          valor,
          descricao,
          prazo: data.prazo,
        });
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
          <label htmlFor="prazo">Prazo:</label>
          <DatePicker
            id="prazo"
            selected={prazo}
            onChange={(date) => setPrazo(date)}
            showTimeSelect
            dateFormat="dd-MM-yyyy HH:mm"
          />
        </div>
        <button type="submit">Adicionar</button>
      </form>
    </div>
  );
}

export default AddItem;