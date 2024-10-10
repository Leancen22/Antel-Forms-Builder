// src/app/form-editor/page.jsx
'use client'

import { useState, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

import { protectRoute } from '@/lib/protectedRoute';

const FormEditor = () => {

    protectRoute('/login');
  
  const router = useRouter();
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [components, setComponents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formUrl, setFormUrl] = useState('');

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

  const handleSubmit = async () => {
    const response = await fetch('/api/forms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: formTitle,
        description: formDescription,
        components,
      }),
    });
  
    if (response.ok) {
        const form = await response.json();
        const url = `${window.location.origin}/formulario/${form.id}`;
        setFormUrl(url);
        setIsModalOpen(true);
      } else {
        alert('Error al guardar el formulario');
      }
  };
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(formUrl);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    router.push('/form-overview');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col items-center p-6 bg-white shadow-md rounded-md max-w-3xl mx-auto">
        

        <div className="flex justify-between items-center w-full mb-4">
          <h1 className="text-2xl font-bold">Crea un Nuevo Formulario</h1>
          <Button onClick={handleSubmit} className="bg-green-500 text-white">
            Guardar Formulario
          </Button>
        </div>

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

      {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-md max-w-md mx-auto text-center">
              <h2 className="text-xl font-bold mb-4">Formulario Creado</h2>
              <p className="mb-4">Puedes compartir tu formulario usando el siguiente enlace:</p>
              <input 
                type="text" 
                value={formUrl} 
                readOnly 
                className="border p-2 w-full mb-4 text-center"
              />
              <Button onClick={handleCopyToClipboard} className="bg-blue-500 text-white mb-4">Copiar Enlace</Button>
              <Button onClick={handleCloseModal} className="bg-green-500 text-white">Ir al Dashboard</Button>
            </div>
          </div>
        )}
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

// const DraggableComponent = ({ component, index, moveComponent, updateComponent }) => {
//   const ref = useRef(null);

//   const [, drop] = useDrop({
//     accept: 'component',
//     hover(item) {
//       if (item.index !== index) {
//         moveComponent(item.index, index);
//         item.index = index;
//       }
//     },
//   });

//   const [{ isDragging }, drag] = useDrag({
//     type: 'component',
//     item: { index },
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//   });

//   drag(drop(ref));

//   const handleQuestionChange = (e) => {
//     updateComponent(index, { ...component, question: e.target.value });
//   };

//   const handleTypeChange = (e) => {
//     updateComponent(index, { ...component, type: e.target.value });
//   };

//   return (
//     <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }} className="p-4 bg-white rounded shadow space-y-2">
//       <input
//         type="text"
//         value={component.question || ''}
//         onChange={handleQuestionChange}
//         placeholder="Escribe tu pregunta aquí"
//         className="border p-2 w-full"
//       />
//       <select
//         value={component.type}
//         onChange={handleTypeChange}
//         className="border p-2 w-full"
//       >
//         <option value="text">Respuesta de texto corta</option>
//         <option value="textarea">Respuesta de texto larga</option>
//         <option value="select">Casilla de selección</option>
//         <option value="image">Subir archivo</option>
//       </select>
//     </div>

    
//   );
// };

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
      updateComponent(index, { ...component, type: e.target.value, options: [] });
    };
  
    const handleAddOption = () => {
        const newOption = { id: (component.options ? component.options.length : 0), value: '' };
        
        updateComponent(index, { 
          ...component, 
          options: [...(component.options || []), newOption] 
        });
      };
      
  
    const handleOptionChange = (optionIndex, value) => {
      const updatedOptions = component.options.map((option, i) => 
        i === optionIndex ? { ...option, value } : option
      );
      updateComponent(index, { ...component, options: updatedOptions });
    };
  
    const handleRemoveOption = (optionIndex) => {
      const updatedOptions = component.options.filter((_, i) => i !== optionIndex);
      updateComponent(index, { ...component, options: updatedOptions });
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
        
        {component.type === 'select' && (
          <div className="space-y-2 mt-4">
            <h3 className="font-medium">Opciones</h3>
            {component.options && component.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={option.value}
                  onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
                  placeholder={`Opción ${optionIndex + 1}`}
                  className="border p-2 w-full"
                />
                <button onClick={() => handleRemoveOption(optionIndex)} className="text-red-500">Eliminar</button>
              </div>
            ))}
            <Button onClick={handleAddOption} className="mt-2 bg-blue-500 text-white">Agregar Opción</Button>
          </div>
        )}
      </div>
    );
  };
  

export default FormEditor;
