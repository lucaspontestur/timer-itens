import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const Input = styled.input`
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 3px;
  border: 1px solid #ccc;
`;

const TextArea = styled.textarea`
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 3px;
  border: 1px solid #ccc;
  height: 60px;
`;

const Button = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 3px;
  margin-right: 5px;
  cursor: pointer;
`;

const EditButton = styled(Button)`
  background-color: #ffc107;
  color: #fff;

  &:hover {
    background-color: #d39e00;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #dc3545;
  color: #fff;

  &:hover {
    background-color: #c82333;
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
        new Notification('Item Expirado!', {
          body: `O item "${item.nome}" expirou!`,
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification('Item Expirado!', {
              body: `O item "${item.nome}" expirou!`,
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

      onItemUpdated({ ...item, nome, valor, descricao, prazo: prazoFormatado });
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
          <Input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <Input
            type="number"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
          <TextArea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
          <DatePicker
            selected={prazo}
            onChange={(date) => setPrazo(date)}
            showTimeSelect
            dateFormat="yyyy-MM-dd HH:mm"
          />
          <EditButton onClick={handleSaveClick}>Salvar</EditButton>
          <DeleteButton onClick={handleCancelClick}>Cancelar</DeleteButton>
        </div>
      ) : (
        <div>
          <h3>{item.nome}</h3>
          <p>Valor: {item.valor}</p>
          <p>Descrição: {item.descricao}</p>
          <p>Prazo: {moment(item.prazo).format('YYYY-MM-DD HH:mm')}</p>
          <p>Tempo Restante: {tempoRestante}</p>
          <EditButton onClick={handleEditClick}>Editar</EditButton>
          <DeleteButton onClick={handleDeleteClick}>Excluir</DeleteButton>
        </div>
      )}
    </ItemContainer>
  );
}

export default Item;