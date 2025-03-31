import { useEffect, useState } from 'react'

import './App.css'
import { Button, Card, CloseButton, Container, Form, ListGroup } from 'react-bootstrap'

function App() {
  const [text  , settext] = useState("")
  const [task, setTask] = useState([])
  const [show, setShow] = useState(false)
  // el problema es que la api borra mi usuario al cierto tiempo cosa que deberia avisar el ejercicio
  const fetchTasks = async () => {
    await fetch('https://playground.4geeks.com/todo/users/Nacho')
      .then(response => {
        if (!response.ok) { 
          
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Datos actualizados:", data.todos)
        setTask(data.todos) // Guardar tareas en el estado
      })
      .catch(error => {
        console.error("Error al obtener tareas:", error);
      });
  }
  useEffect(() => {
    const createUser = async () => {
      try {
        // Verificar si el usuario existe con GET
        let response = await fetch("https://playground.4geeks.com/todo/users/Nacho");

        if (!response.ok) {
          console.warn("Usuario no encontrado, intentando crearlo...");

          // Crear usuario con POST, enviando el cuerpo correcto
          response = await fetch("https://playground.4geeks.com/todo/users/Nacho", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: "Nacho" }) // IMPORTANTE: Agregamos un body válido
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          console.log("Usuario creado correctamente");
        } else {
          console.log("Usuario ya existe");
        }

        // Obtener las tareas después de asegurar que el usuario existe
        await fetchTasks();
      } catch (error) {
        console.error("Error creando usuario o obteniendo tareas:", error);
      }
    };

    createUser();
  }, []);
  

  const addTask = async (e) => {
    e.preventDefault()
    
    if (text.trim() === "") return;
    const newTask = {
      label: text,
      is_done: false
    }
    
    await fetch('https://playground.4geeks.com/todo/todos/Nacho', {
      method: "POST",
      body: JSON.stringify(newTask),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(resp => {
        console.log(resp.ok); 
        console.log(resp.status); 
      console.log(resp.text()); 
      fetchTasks()
      settext("")
    })
    .then(() => {
       
      
    })
    .catch(error => {
       
        console.log(error);
    });
    
  }
  const deleteTask = async ({ id }) => {
    console.log(id)
    await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(resp => {
        console.log(resp.ok)
        fetchTasks()
      })
      .catch(error => {
              console.log(error);

    })
  }
  const deleteAll = async () => {
    
    await Promise.all(
      task.map(item => 
       fetch(`https://playground.4geeks.com/todo/todos/${item.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      })
     )
    )
    fetchTasks()
  }

  return (
    <>
      <Container className='container-lg p-4'>
        <h1>Task List</h1>
        <Card className='p-0 w-100 mx-auto- fs-4'>
          <Card.Header >
            <Form onSubmit={addTask}>
                <Form.Group>
                <Form.Control
                  type="text"
                  onChange={(e) => settext(e.target.value)}
                  value={text}
                  className='border-0 border-bottom border-2 rounded-0 w-100'
                />
              </Form.Group>
            </Form>
               
          </Card.Header>
          <Card.Body>
            {task.length === 0
              ? <h1>Empty List, Add Task</h1>
              : task.map((item, index) => {
                return (
                  <ListGroup>
                    <ListGroup.Item
                      key={item.id}
                      onMouseEnter={()=> setShow(item.id)}
                      onMouseLeave={() => setShow(null)}
                      className='border-0 border-bottom border-2 rounded-0'
                    >
                      <div className='d-flex'>
                        <span className='w-100 text-start'>{item.label}</span>
                        {show === item.id && <CloseButton className='text-end'  onClick={() => deleteTask(item)} /> }
                      
                      </div>
                      
                    </ListGroup.Item>
                  </ListGroup>
                )
              })
            }           
          </Card.Body>
          <Card.Footer>
            {task.length>0 ?<Button variant='danger' on onClick={() => deleteAll()}>Delete All</Button>:null}
          {task.length > 0 ? <p className='text-start text-muted mb-0'>{ task.length} item</p> : null}

            </Card.Footer>
        </Card>
      </Container>
    </>
  )
}

export default App
