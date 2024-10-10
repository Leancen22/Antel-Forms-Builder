// src/app/form-editor/page.jsx
'use client'

import { useState, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@/components/ui/button';

const FormEditor = () => {
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [components, setComponents] = useState([]);

  const addComponent = () => {
    setComponents([...components, { id: components.length, question: '', type: 'text' }]);
  };

  const moveComponent = (dragIndex, hoverIndex) => {
    const updatedComponents = [...components];
    const [removed] = updatedComponents.splice(dragIndex, 1);
    updatedComponents.splice(hoverIndex, 0, removed);
    setComponents(updatedComponents);
  };

  const updateComponent = (index, updatedComponent) => {
    const updatedComponents = components.map((component, i) => 
      i === index ? updatedComponent : component
    );
    setComponents(updatedComponents);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col items-center p-6 bg-white shadow-md rounded-md max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Crea un nuevo formulario</h1>
        
        {/* Campos para Título y Descripción del Formulario */}
        <input
          type="text"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          placeholder="Título del Formulario"
          className="border p-2 w-full mb-4 text-xl font-semibold"
        />
        
        <textarea
          value={formDescription}
          onChange={(e) => setFormDescription(e.target.value)}
          placeholder="Descripción del Formulario"
          className="border p-2 w-full mb-6"
          rows="3"
        />

        <FormCanvas 
          components={components} 
          moveComponent={moveComponent} 
          updateComponent={updateComponent} 
          addComponent={addComponent}
        />
      </div>
    </DndProvider>
  );
};

const FormCanvas = ({ components, moveComponent, updateComponent, addComponent }) => (
  <div className="p-4 bg-gray-100 rounded-md w-full min-h-[300px] flex flex-col space-y-4">
    {components.map((component, index) => (
      <DraggableComponent 
        key={component.id} 
        index={index} 
        component={component} 
        moveComponent={moveComponent} 
        updateComponent={updateComponent} 
      />
    ))}
    {/* Botón de agregar solo después del último componente */}
    <Button onClick={addComponent} className="self-center mt-4 bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl">
      +
    </Button>
  </div>
);

const DraggableComponent = ({ component, index, moveComponent, updateComponent }) => {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: 'component',
    hover(item) {
      if (item.index !== index) {
        moveComponent(item.index, index);
        item.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'component',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const handleQuestionChange = (e) => {
    updateComponent(index, { ...component, question: e.target.value });
  };

  const handleTypeChange = (e) => {
    updateComponent(index, { ...component, type: e.target.value });
  };

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }} className="p-4 bg-white rounded shadow space-y-2">
      <input
        type="text"
        value={component.question || ''}
        onChange={handleQuestionChange}
        placeholder="Escribe tu pregunta aquí"
        className="border p-2 w-full"
      />
      <select
        value={component.type}
        onChange={handleTypeChange}
        className="border p-2 w-full"
      >
        <option value="text">Respuesta de texto corta</option>
        <option value="textarea">Respuesta de texto larga</option>
        <option value="select">Casilla de selección</option>
        <option value="image">Subir archivo</option>
      </select>
    </div>
  );
};

export default FormEditor;
