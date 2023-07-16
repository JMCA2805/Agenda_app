let cont;
let data;
let label_cont = document.getElementById("cont");

// Comprobar si hay contactos
const validar = () => {
  const msj = document.getElementById("msj");
  if (cont > 0) {
    msj.style.display = "none";
  }
};

// funcion de inicio
const inicio = async () => {
  let obtcont = localStorage.getItem("cont");
  cont = obtcont == null ? 0 : obtcont;
  data = [];
  label_cont.innerHTML = cont;
  await validar();
};

inicio();

const validar2 = () => {
  const msj = document.getElementById("msj");
  if (cont == 0) {
    msj.style.display = "flex";
  }
};

// Eliminar

const deleteCard = async (id) => {
  data.splice(id, 1);
  localStorage.setItem("Data", JSON.stringify(data));

  cont--;
  localStorage.setItem("cont", cont);
  label_cont.innerHTML = cont;

  await validar2();
  await cargar_data("Eliminar");
};

let selector_deletes = () => {
  // Obteniendo el id para eliminar
  const deletes = document.querySelectorAll('img[id^="d"]');
  let id_d;
  let newid_d;
  let i = true;
  deletes.forEach((del) => {
    del.addEventListener("click", (e) => {
      id_d = e.target.id;
      newid_d = id_d.replace(/d/g, "");
      if (i === true) {
        swal
          .fire({
            title: "¿Estás seguro de que quieres eliminar este contacto?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Eliminar",
          })
          .then((result) => {
            if (result.isConfirmed) {
              deleteCard(newid_d);
              i = false;
            }
          });
      }
    });
  });
};

// Editar

const editCard = async () => {
  const id_ed = localStorage.getItem("id_e");
  console.log(id_ed);
  let edit = document.getElementById("edit");
  edit.style.display = "flex";

  let agregar = document.getElementById("agregar");
  agregar.style.display = "none";

  let name_c = document.getElementById("name");
  let phone = document.getElementById("phone");
  let email = document.getElementById("email");

  name_c.value = data[id_ed].Name;
  phone.value = data[id_ed].Phone;
  email.value = data[id_ed].Email;
};

edit.addEventListener("click", async (e) => {
  let edit = document.getElementById("edit");
  let agregar = document.getElementById("agregar");
  const id_ed = localStorage.getItem("id_e");

  let name_c = document.getElementById("name");
  let phone = document.getElementById("phone");
  let email = document.getElementById("email");

  e.preventDefault();
  const data_c = await validateForm(name_c, phone, email);
  if (data_c === false) {
    return;
  }

  data[id_ed].Name = name_c.value;
  data[id_ed].Phone = phone.value;
  data[id_ed].Email = email.value;

  console.log(id_ed);

  localStorage.setItem("Data", JSON.stringify(data));

  name_c.value = "";
  phone.value = "";
  email.value = "";

  agregar.style.display = "flex";
  edit.style.display = "none";
  cargar_data("Editar");
});

let selector_editar = () => {
  // Obteniendo el id para editar
  const edits = document.querySelectorAll('img[id^="e"]');
  let id_e;
  let newid_e;
  let i = true;
  edits.forEach((ed) => {
    ed.addEventListener("click", (e) => {
      id_e = e.target.id;
      newid_e = id_e.replace(/e/g, "");
      if (i === true) {
        console.log("Dentro", newid_e);
        localStorage.setItem("id_e", newid_e);
        editCard();
        i = false;
        console.log(i);
      }
    });
  });
};

// Cargar Datos
const cargar_data = async (opcion) => {
  const content3 = document.querySelectorAll("section.content3");
  for (const contents of content3) {
    await contents.remove();
  }

  let r = cont;
  const contactos = document.getElementById("contactos");
  let section;
  section = document.createElement("section");
  section.className = "content3";
  // Agregue el elemento section al contactos.
  contactos.appendChild(section);

  let obtdata = localStorage.getItem("Data");
  data = JSON.parse(obtdata);
  console.log(data);
  if (data == [] || data == null) {
    data = [];
    return;
  }

  for (let a = 0; a < r; a++) {
    // Ficha de Contacto .
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("id", "card" + a);

    const opc_img = document.createElement("div");
    opc_img.className = "opc_img";
    const img_t = document.createElement("img");
    img_t.className = "delete";
    img_t.alt = "Delete";
    img_t.setAttribute("id", "d" + a);
    const img_e = document.createElement("img");
    img_e.className = "edit";
    img_e.alt = "Edit";
    img_e.setAttribute("id", "e" + a);

    opc_img.appendChild(img_t);
    opc_img.appendChild(img_e);

    card.appendChild(opc_img);

    let cont1 = 0;
    const title = ["Nombre", "Teléfono", "Correo"];
    const newdata = data[a];
    const properties = Object.keys(newdata);
    for (const property of properties) {
      // Create a new div
      const div = document.createElement("div");
      div.classList.add("div_inf");

      // Create a title div
      const titleDiv = document.createElement("div");
      titleDiv.classList.add("title");
      titleDiv.innerHTML = `<label>${title[cont1]}:</label>`;

      // Create a metadatos div
      const propiedadesDiv = document.createElement("div");
      propiedadesDiv.classList.add("propiedades");
      propiedadesDiv.innerHTML = `<label> ${newdata[property]}</label>`;
      div.appendChild(titleDiv);
      div.appendChild(propiedadesDiv);

      card.appendChild(div);

      cont1++;
    }
    // Agregue el elemento card al elemento section.
    section.appendChild(card);
  }
  await selector_deletes();
  await selector_editar();
  if (opcion == "Crear") {
    Swal.fire(
      "¡Contacto Creado Correctamente ! ",
      "¡Presione el botón para continuar!",
      "success"
    );
  } else if (opcion == "Editar") {
    Swal.fire(
      "¡Contacto Editado Correctamente ! ",
      "¡Presione el botón para continuar!",
      "success"
    );
  } else if (opcion == "Eliminar") {
    Swal.fire(
      "¡Contacto Eliminado Correctamente ! ",
      "¡Presione el botón para continuar!",
      "success"
    );
  } else {
    Swal.fire(
      "¡Contactos Listados Correctamente ! ",
      "¡Presione el botón para continuar!",
      "success"
    );
  }
};

cargar_data();

// Validar contenido
const validateForm = (name_c, phone, email) => {
  if (name_c.value === "") {
    name_c.focus();
    Swal.fire(
      "¡Datos inválidos! El nombre no puede estar en blanco",
      "¡Presione el botón para continuar!",
      "error"
    );
    return false;
  }

  //   Validando el número telefónico
  const n_phone = /^\d{11}$/;
  const new_phone = phone.value.replace(/-/g, "");
  if (phone.value === "" || !n_phone.test(new_phone)) {
    phone.focus();
    Swal.fire(
      "¡Datos inválidos! El número telefónico no es valido",
      "¡Presione el botón para continuar!",
      "error"
    );
    return false;
  }

  //   Validando el correo
  const n_email =
    /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (email.value === "" || !n_email.test(email.value)) {
    email.focus();
    Swal.fire(
      "¡Datos inválidos! El correo no es valido",
      "¡Presione el botón para continuar!",
      "error"
    );
    return false;
  }
  return true;
};

// Agregando el contacto
const agregar_card = async (inf) => {
  if (data == [] || data == null) {
    data = [];
  }
  console.log(data);
  await data.push(inf);
  localStorage.setItem("Data", JSON.stringify(data));
  await cargar_data("Crear");
};

// Actualizar contador
const ActCont = (name_c, phone, email) => {
  cont++;
  localStorage.setItem("cont", cont);
  label_cont.innerHTML = cont;
  name_c.value = "";
  phone.value = "";
  email.value = "";
};

// Agregar
const Button = document.getElementById("agregar");
Button.addEventListener("click", async (e) => {
  e.preventDefault();

  let name_c = document.getElementById("name");
  let phone = document.getElementById("phone");
  let email = document.getElementById("email");

  const data = await validateForm(name_c, phone, email);
  if (data === false) {
    data = [];
    return;
  }

  const inf = { Name: name_c.value, Phone: phone.value, Email: email.value };
  await ActCont(name_c, phone, email);
  await agregar_card(inf);
  await validar();
});

// Modo claro y Oscuro
const mode = document.getElementById("mode");
mode.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  // Sweet Alert
  let stylesheet = document.body.classList.contains("dark")
    ? "../style/dark_sweetalert2.css"
    : "../style/sweetalert2.css";
  document.getElementById("styleSweet").href = stylesheet;
});
