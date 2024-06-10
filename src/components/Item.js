import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import alerta from '../alerta.png';

const ItemContainer = styled.li`
  background-color: #212121;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px; 
`;

const Title = styled.h3`
  color: #4caf50; 
  margin-bottom: 10px;
`;

const Info = styled.p`
  margin-bottom: 8px;
  color: #bdbdbd; 
`;

const EditButton = styled.button`
  background-color: #ffc107; 
  color: #fff;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  margin-right: 5px; 
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #d39e00; 
  }
`;

const DeleteButton = styled.button`
  background-color: #f44336; 
  color: #fff;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c62828; 
  }
`;

const InputGroup = styled.div`
  margin-bottom: 10px;
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


function Item({ item, onItemUpdated, onItemDeleted }) {
  const [isEditing, setIsEditing] = useState(false);
  const [nome, setNome] = useState(item.nome);
  const [valor, setValor] = useState(item.valor);
  const [descricao, setDescricao] = useState(item.descricao);
  const [prazo, setPrazo] = useState(new Date(item.prazo));
  const [tempoRestante, setTempoRestante] = useState('');

  useEffect(() => {
    const prazoMoment = moment(item.prazo);
    const tempoAteExpiracao = prazoMoment.diff(moment());

    const timeoutId = setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification('ITEM expirado', {
          body: `O item "${item.nome}" expirou!`,
          icon: alerta,
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification('ITEM expirado', {
              body: `O item "${item.nome}" expirou!`,
              icon: alerta, 
            });
          }
        });
      }
    }, tempoAteExpiracao);

    return () => clearTimeout(timeoutId);
  }, [item.prazo, item.nome]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      const agora = moment();
      const prazoMoment = moment(item.prazo);
      const diferenca = prazoMoment.diff(agora);

      if (diferenca > 0) {
        const duracao = moment.duration(diferenca);
        setTempoRestante(
          `${duracao.days()}d ${duracao.hours()}h ${duracao.minutes()}m ${duracao.seconds()}s`
        );
      } else {
        setTempoRestante('Expirado!');
        clearInterval(intervalo);
      }
    }, 1000);

    return () => clearInterval(intervalo);
  }, [item.prazo]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setNome(item.nome);
    setValor(item.valor);
    setDescricao(item.descricao);
    setPrazo(new Date(item.prazo));
  };

  const handleSaveClick = async () => {
    try {
      const prazoFormatado = prazo.toISOString();

      await axios.put(`http://localhost:5000/itens/${item.id}`, {
        nome,
        valor,
        descricao,
        prazo: prazoFormatado, 
      });

      onItemUpdated({
        ...item,
        nome,
        valor,
        descricao,
        prazo: prazoFormatado,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
    }
  };

  const handleDeleteClick = async () => {
    try {
      await axios.delete(`http://localhost:5000/itens/${item.id}`);
      onItemDeleted(item.id);
    } catch (error) {
      console.error('Erro ao excluir item:', error);
    }
  };

  return (
    <ItemContainer>
      {isEditing ? (
        <div>
          <InputGroup>
            <label htmlFor={`nome-${item.id}`}>Nome:</label>
            <Input
              type="text"
              id={`nome-${item.id}`}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </InputGroup>
          <InputGroup>
           <label htmlFor={`valor-${item.id}`}>Valor:</label>
            <Input
              type="number"
              id={`valor-${item.id}`}
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
          </InputGroup>
          <InputGroup>
            <label htmlFor={`descricao-${item.id}`}>Descrição:</label>
            <TextArea
              id={`descricao-${item.id}`}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </InputGroup>
          <InputGroup>
            <label htmlFor={`prazo-${item.id}`}>Prazo:</label>
            <DatePicker
              id={`prazo-${item.id}`}
              selected={prazo}
              onChange={(date) => setPrazo(date)}
              showTimeSelect
              dateFormat="yyyy-MM-dd HH:mm" 
            />
          </InputGroup>
          <EditButton onClick={handleSaveClick}>Salvar</EditButton>
          <DeleteButton onClick={handleCancelClick}>Cancelar</DeleteButton>
        </div>
      ) : (
        <div>
          <Title>{item.nome}</Title>
          <Info>Valor: {item.valor}</Info>
          <Info>Descrição: {item.descricao}</Info>
          <Info>
            Prazo: {moment(item.prazo).format('DD/MM/YYYY')} -{' '}
            {moment(item.prazo).format('HH:mm')}
          </Info>
          <Info>Tempo Restante: {tempoRestante}</Info>
          <EditButton onClick={handleEditClick}>Editar</EditButton>
          <DeleteButton onClick={handleDeleteClick}>Excluir</DeleteButton>
        </div>
      )}
    </ItemContainer>
  );
}

export default Item;