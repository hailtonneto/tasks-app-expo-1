import axios from 'axios';
import React from 'react';

const baseURL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5555';

export interface TaskItem {
  _id: string;
  text: string;
  completed?: boolean;
  dueDate?: string;
}

export const getAllTasks = (
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>,
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (setLoading) setLoading(true);
  axios
    .get<TaskItem[]>(`${baseURL}`)
    .then(({ data }) => {
      setTasks(data);
      if (setLoading) setLoading(false);
    })
    .catch((err) => {
      console.log('Backend offline ao buscar tarefas. Carregando dados locais para teste.', err);
      if (setLoading) setLoading(false);
      
      // Carrega tarefas fictícias de demonstração caso a API não esteja rodando
      setTasks((prev) => {
        if (prev.length > 0) return prev;
        return [
          {
            _id: 'local-demo-1',
            text: 'Completar o desafio de React Native 🚀',
            completed: true,
            dueDate: new Date().toISOString(),
          },
          {
            _id: 'local-demo-2',
            text: 'Configurar o backend local em Node/Express',
            completed: false,
            dueDate: new Date().toISOString(),
          },
          {
            _id: 'local-demo-3',
            text: 'Integrar rotas protegidas e SecureStore',
            completed: false,
          },
        ];
      });
    });
};

export const addTask = (
  text: string,
  completed: boolean,
  dueDate: string | null,
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>,
  onSuccess: () => void
) => {
  axios
    .post(`${baseURL}/save`, { text, completed, dueDate })
    .then(() => {
      onSuccess();
      getAllTasks(setTasks);
    })
    .catch((err) => {
      console.log('Backend offline ao adicionar tarefa. Adicionando localmente para fins de teste.', err);
      
      const newTask: TaskItem = {
        _id: `local-task-${Date.now()}`,
        text,
        completed,
        dueDate: dueDate || undefined,
      };

      setTasks((prev) => [newTask, ...prev]);
      onSuccess();
    });
};

export const updateTask = (
  taskId: string,
  text: string,
  completed: boolean,
  dueDate: string | null,
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>,
  onSuccess: () => void
) => {
  axios
    .post(`${baseURL}/update`, { _id: taskId, text, completed, dueDate })
    .then(() => {
      onSuccess();
      getAllTasks(setTasks);
    })
    .catch((err) => {
      console.log('Backend offline ao atualizar tarefa. Atualizando localmente para fins de teste.', err);
      
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId
            ? { ...task, text, completed, dueDate: dueDate || undefined }
            : task
        )
      );
      onSuccess();
    });
};

export const deleteTask = (
  _id: string,
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>
) => {
  axios
    .post(`${baseURL}/delete`, { _id })
    .then(() => {
      getAllTasks(setTasks);
    })
    .catch((err) => {
      console.log('Backend offline ao deletar tarefa. Removendo localmente para fins de teste.', err);
      
      setTasks((prev) => prev.filter((task) => task._id !== _id));
    });
};
