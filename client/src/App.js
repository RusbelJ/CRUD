import './App.css';
import { useState, useEffect } from 'react';
import Axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const noti = withReactContent(Swal);

function App() {

  const [id,setId] = useState("");
  const [nombre,setNombre] = useState("");
  const [edad,setEdad] = useState("");
  const [pais,setPais] = useState("");
  const [cargo,setCargo] = useState("");
  const [año,setAño] = useState("");

  const [editar,setEditar] = useState(false)

  const [empleadosList,setEmpleados] = useState([]);

  const add = () =>{
    Axios.post("http://localhost:3001/create",{
      nombre:nombre,
      edad:edad,
      pais:pais,
      cargo:cargo,
      año:año
    }).then(()=>{
      getEmpleados();
      limpiarCampos();
      noti.fire({
        title: <strong>Registro exitoso</strong>,
        html: <i>El empleado {nombre} fue registrado con exito</i>,
        icon: "success",
        timer:3000
      })
    });
  }

  const limpiarCampos = () =>{
    setAño("");
    setNombre("");
    setEdad("");
    setPais("");
    setCargo("");
    setEditar(false);
  }

  const update = () =>{
    Axios.put("http://localhost:3001/update",{
      id:id,
      nombre:nombre,
      edad:edad,
      pais:pais,
      cargo:cargo,
      año:año
    }).then(()=>{
      getEmpleados();
      limpiarCampos();
      noti.fire({
        title: <strong>Actualizacion exitoso</strong>,
        html: <i>El empleado {nombre} fue actualizado con exito</i>,
        icon: "success",
        timer:3000
      })
    });
  }

  const deleteEmple = (value) =>{
    Swal.fire({
        title: "<strong>Confirmar eliminado</strong>",
        html: "<i>Realmente desea eliminar a "+ value.nombre +"</i>",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminarlo"
      }).then((result) => {
        if (result.isConfirmed)
          Axios.delete(`http://localhost:3001/delete/${value.id}`,{}).then(()=>{
            getEmpleados();
            limpiarCampos();
            
            Swal.fire({
            title: "Eliminado",
            text: "Eliminado exitosamente.",
            icon: "success",
            timer: 3000
            });
          });
      });
  }

  const getEmpleados = () =>{
    Axios.get("http://localhost:3001/empleados")
    .then((response)=>{
      setEmpleados(response.data);
    });
  }

  const editarEmpleado = (val) =>{
    setEditar(true);

    setNombre(val.nombre);
    setEdad(val.edad);
    setCargo(val.cargo);
    setPais(val.pais);
    setAño(val.años);
    setId(val.id);

  }

  useEffect(() => {
    getEmpleados();
  }, []);

  return (
  <div className="container"> 

    <div className="card text-center">
      <div className="card-header">
        Gestion de empleados
      </div>
      <div className="card-body">

        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">Nombre:</span>
          <input type="text"
          onChange={(event)=>{
              setNombre(event.target.value);
            }}
          className="form-control" value={nombre} placeholder="Ingrese un nombre" aria-label="Username" aria-describedby="basic-addon1"/>
        </div>

        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">Edad:</span>
          <input type="number"
          onChange={(event)=>{
              setEdad(event.target.value);
            }}
          className="form-control" value={edad} placeholder="Ingrese su edad" aria-label="Username" aria-describedby="basic-addon1"/>
        </div>

        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">Pais:</span>
          <input type="text"
          onChange={(event)=>{
              setPais(event.target.value);
            }}
          className="form-control" value={pais} placeholder="Ingrese su pais" aria-label="Username" aria-describedby="basic-addon1"/>
        </div>

        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">Cargo:</span>
          <input type="text"
          onChange={(event)=>{
              setCargo(event.target.value);
            }}
          className="form-control" value={cargo} placeholder="Cargo actual" aria-label="Username" aria-describedby="basic-addon1"/>
        </div>

        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">Años:</span>
          <input type="number"
          onChange={(event)=>{
              setAño(event.target.value);
            }}
          className="form-control" value={año} placeholder="Ingrese su experiencia en años" aria-label="Username" aria-describedby="basic-addon1"/>
        </div>

      </div>
      <div className="card-footer text-body-secondary">
        {
          editar?
          <div>
          <button className='btn btn-warning m-2' onClick={update}>
            Actualizar
          </button>
          <button className='btn btn-info m-2' onClick={limpiarCampos}>
            Cancelar
          </button>
          </div>
          :<button className='btn btn-success' onClick={add}>
            Registrar
          </button>
        }
    </div>
</div>

  <table className="table table-striped table-hover">
    
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Nombre </th>
        <th scope="col">Edad </th>
        <th scope="col">Pais </th>
        <th scope="col">Cargo </th>
        <th scope="col">Años </th>
        <th scope="col">Acciones </th>
      </tr>
    </thead>
    <tbody>

      {
        empleadosList.map((value,key)=>{
          return <tr key={value.id}>
                  <th scope="row">{value.id}</th>
                  <td>{value.nombre}</td>
                  <td>{value.edad}</td>
                  <td>{value.pais}</td>
                  <td>{value.cargo}</td>
                  <td>{value.años}</td>
                  <td>
                    <div className="btn-group" role="group" aria-label="Ejemplo básico">
                      <button type="button"
                      onClick={()=>{
                        editarEmpleado(value);
                      }}
                      className="btn btn-info">Editar</button>
                      <button type="button" onClick={()=>{
                        deleteEmple(value);
                      }} className="btn btn-danger">Eliminar</button>
                    </div>
                  </td>
                </tr>
          
        })
      }

    </tbody>

  </table>

  </div> 
  );
}

export default App;