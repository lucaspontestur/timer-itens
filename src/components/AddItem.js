import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';

const FormContainer = styled.div`
  background-color: #212121;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  width: 50%;
  margin: 0 auto 20px; 
`;

const Title = styled.h2`
  color: #4caf50;
  margin-bottom: 20px;
`;

const InputGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #bdbdbd;
`;

const Input = styled.input`
  width: calc(100% - 16px);
  padding: 10px;
  border: 1px solid #333;
  border-radius: 4px;
  background-color: #1a1a1a;
  color: #fff;

  &:focus {
    outline: none;
    border-color: #4caf50;
  }
`;

const TextArea = styled.textarea`
  width: calc(100% - 16px);
  padding: 10px;
  border: 1px solid #333;
  border-radius: 4px;
  background-color: #1a1a1a;
  color: #fff;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: #4caf50;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #4caf50;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #388e3c;
  }
`;

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
    <FormContainer>
      <Title>Adicionar Item</Title>
      <form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="nome">Nome:</Label>
          <Input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="valor">Valor:</Label>
          <Input
            type="number"
            id="valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="descricao">Descrição:</Label>
          <TextArea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="prazo">Prazo:</Label>
          <DatePicker
            id="prazo"
            selected={prazo}
            onChange={(date) => setPrazo(date)}
            showTimeSelect
            dateFormat="yyyy-MM-dd HH:mm" 
          />
        </InputGroup>
        <Button type="submit">Adicionar</Button>
      </form>
    </FormContainer>
  );
}

export default AddItem;