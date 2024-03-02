import './App.css';
import React, { useEffect, useState } from 'react';
import { Theme, presetGpnDefault } from '@consta/uikit/Theme';
import { Button } from '@consta/uikit/Button';
import { Card } from '@consta/uikit/Card';
import { Text } from '@consta/uikit/Text';
import {Grid, GridItem} from '@consta/uikit/Grid'
import { Modal } from '@consta/uikit/Modal';
import { TextField } from '@consta/uikit/TextField';
import { IconClose } from '@consta/icons/IconClose';
import { Layout } from '@consta/uikit/Layout';


const App = () => {
  const [boards, setBoards] = useState([
    {id: 1, title: "Очередь", items: [{id: 1, title: "Сварить борщ", description: "задание"}, {id: 5, title: "Пожарить котлеты", description: "задание"}, {id: 6, title: "Заварить чай", description: "задание"}]},
    {id: 2, title: "В работе", items: [{id: 2, title: "Сварить пельмени", description: "задание"}, {id: 7, title: "Порезать капусту", description: "задание"}]},
    {id: 3, title: "На проверке", items: [{id: 3, title: "Приготовить овощной салат", description: "задание"}, {id: 8, title: "Подготовить зажарку", description: "задание"}]},
    {id: 4, title: "Выполнено", items: [{id: 4, title: "Помыть посуду", description: "задание"}, {id: 9, title: "Приготовить кофе", description: "задание"}]},
  ]);
  const [tasks, setTasks] = useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [currentBoard, setCurrentBoard] = useState(null)
  const [currentItem, setCurrentItem] = useState(null)
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const handleChangeTitle = (value) => setTitle(value);
  const handleChangeDescription = (value) => setDescription(value);


  // Функция для получения данных к API
const getApiData = async () => {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/todos/"
  ).then((response) => response.json());

   setTasks(response);
};

  useEffect (() => {
    getApiData();
  }, []);

  // Функция для обновления данных через API
  useEffect(() => {
    const task = {id: 1, title: "Сварить борщ", description: "задание"};
    // axios.put('https://jsonplaceholder.typicode.com/todos/', task)
    //     .then(response => setTasks(response.json()));

}, []);

  const dragOverHandler = (e) => {
    e.preventDefault()
    if (e.target.className === 'item') {
      e.target.style.boxShadow = '0 4px 3px gray'
    }
  }

  const dragLeaveHandler = (e) => {
    e.target.style.boxShadow = 'none'
  }

  const dragStartHandler = (e, board, item) => {
    setCurrentBoard(board)
    setCurrentItem(item)
  }

  const dragEndHandler = (e) => {
    e.target.style.boxShadow = 'none'
  }

  const dropHandler = (e, board, item) => {
    e.preventDefault()
    if (Math.abs(currentBoard.id - board.id) === 1 && currentBoard.id < board.id) {
      const currentIndex = currentBoard.items.indexOf(currentItem)
      currentBoard.items.splice(currentIndex, 1)
      const dropIndex = board.items.indexOf(item)
      board.items.splice(dropIndex + 1, 0, currentItem)
      setBoards(boards.map(b => {
        if (b.id === board.id) {
          return board
        }
        if (b.id === currentBoard.id) {
          return currentBoard
        }
        return b
      }))
    }
    
  }

  const dropCardHandler = (e, board) => {
    if (Math.abs(currentBoard.id - board.id) === 1 && currentBoard.id < board.id) {
    if (board.items.length === 0) {
      board.items.push(currentItem)
      const currentIndex = currentBoard.items.indexOf(currentItem)
      currentBoard.items.splice(currentIndex, 1)
      setBoards(boards.map(b => {
        if (b.id === board.id) {
          return board
        }
        if (b.id === currentBoard.id) {
          return currentBoard
        }
        return b
      }))
    }
  }
  }

  const addItem = () => {
    if ((typeof title) !== 'string' || (typeof description) !== 'string') {
      alert("Заполните все обязательные поля!");
      return;
    }
    const firstBoard = boards.filter(board => board.id == 1)
    const item = {id: Math.random(), title: title, description: description}

    if (firstBoard) {
      setBoards(boards.map(b => {
        if (b.id === 1) {
          firstBoard[0].items.push(item)
          return firstBoard[0]
        }
        return b
      }))
    setIsModalOpen(false)
    }
  }

  const deleteItem = (board, item) => {
    const currentIndex = board.items.indexOf(item)
    board.items.splice(currentIndex, 1)
    setBoards(boards.map(b => {
      if (b.id === board.id) {
        return board
      }
      return b
    }))
    // Запрос на удаление к API
    // axios.delete('https://jsonplaceholder.typicode.com/todos/' + item.id).then(() => setStatus('Delete successful'));
  }

  return (
    <Theme preset={presetGpnDefault}>
      <Button key='button' className='btn' label="Добавить" onClick={() => setIsModalOpen(true)}/>
      <hr/>
      <Grid yAlign="top" key='grid' cols={4} colGap='xl'>
      {boards && boards.map(board => 
        <GridItem key={'grid'+board.id}>
        <Card 
          onDragOver={e => dragOverHandler(e)}
          onDrop={e => dropCardHandler(e, board)}
          verticalSpace="xl"
          horizontalSpace="xl"  
          border="true"
          className='board'
          key={board.id}
        >
          <Text weight="bold">{board.title}</Text>
          <br/>
          {board.items.map(item => 
            <Card 
              key={item.id}
              verticalSpace="m"
              horizontalSpace="xl"
              border={true}
              shadow={false}
              draggable={true}
              onDragOver={(e) => dragOverHandler(e)}
              onDragLeave={(e) => dragLeaveHandler(e)}
              onDragStart={(e) => dragStartHandler(e, board, item)}
              onDragEnd={(e) => dragEndHandler(e)}
              onDrop={(e) => dropHandler(e, board, item)}
              className='item'
            >
              <Layout>
                <Layout flex={1}>
                  <IconClose view="alert" size="xs" onClick={() => deleteItem(board, item)}/>
                </Layout>
                <Layout flex={10} direction="column">
                  <Text border="true">{item.title}</Text>
                  <Text size="s" weight="thin">{item.description}</Text>
                </Layout>
              </Layout>
              </Card>
              )}
        </Card>
        </GridItem>
        )}
      </Grid>
      <Modal
        isOpen={isModalOpen}
        hasOverlay
        onClickOutside={() => setIsModalOpen(false)}
        onEsc={() => setIsModalOpen(false)}
        className='modal'
      >
        <TextField
          onChange={handleChangeTitle}
          value={title}
          type="text"
          label="Заголовок"
          required
          placeholder="Введите заголовок"
        />
        <TextField
          onChange={handleChangeDescription}
          value={description}
          type="text"
          label="Описание"
          required
          placeholder="Введите описание"
        />
        <div>
          <Button
            size="m"
            view="primary"
            label="Сохранить"
            width="default"
            className='item'
            onClick={addItem}
          />
        </div>
      </Modal>
    </Theme>
  );
};


export default App;
