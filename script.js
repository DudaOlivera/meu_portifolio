// =========================
// ROTAS DA API
// =========================
const rotas = {
  listar: "http://localhost:3000/inventario",      // GET
  criar: "http://localhost:3000/inventario",       // POST
  atualizar: (id) => `http://localhost:3000/inventario/${id}`, // PUT
  deletar: (id) => `http://localhost:3000/inventario/${id}`    // DELETE
};

const inventarioContent = document.getElementById("inventarioContent");
const btnAdd = document.getElementById("btnAdd");

// =========================
// LISTAR REGISTROS
// =========================
async function carregarInventario() {
  const resp = await fetch(rotas.listar);
  const data = await resp.json();

  inventarioContent.innerHTML = `
    <h2>Inventário</h2>
    <table border="1" width="100%">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Tipo</th>
          <th>Cidade</th>
          <th>Visível</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(item => `
          <tr>
            <td>${item.nome}</td>
            <td>${item.tipo}</td>
            <td>${item.cidade}</td>
            <td>${item.visivel ? "Sim" : "Não"}</td>
            <td>
              <button onclick="editarRegistro('${item.id}')">Editar</button>
              <button onclick="deletarRegistro('${item.id}')">Excluir</button>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

// =========================
// FORMULÁRIO COMPLETO
// =========================
function renderForm(dados = {}, isEdit = false) {
  inventarioContent.innerHTML = `
    <form id="formInventarioCompleto">
      <h2>${isEdit ? "Editar" : "Criar"} Registro</h2>

      <!-- DADOS BÁSICOS -->
      <label>Nome*</label>
      <input type="text" name="nome" value="${dados.nome || ""}" required>

      <label>Tipo*</label>
      <select name="tipo" required>
        <option value="">Selecione</option>
        <option value="atrativo" ${dados.tipo === "atrativo" ? "selected" : ""}>Atrativo</option>
        <option value="hospedagem" ${dados.tipo === "hospedagem" ? "selected" : ""}>Hospedagem</option>
        <option value="restaurante" ${dados.tipo === "restaurante" ? "selected" : ""}>Restaurante</option>
      </select>

      <label>Subtipo*</label>
      <input type="text" name="subtipo" value="${dados.subtipo || ""}">

      <label>Especialidade*</label>
      <input type="text" name="especialidade" value="${dados.especialidade || ""}">

      <label><input type="checkbox" name="utilidade_publica" value="true" ${dados.utilidade_publica ? "checked" : ""}> Urgência / Utilidade Pública</label>

      <label>Cidade*</label>
      <input type="text" name="cidade" value="${dados.cidade || "Garça"}" required>

      <label>Endereço*</label>
      <input type="text" name="endereco" value="${dados.endereco || ""}">

      <label>Geolocalização*</label>
      <input type="text" name="geolocalizacao" value="${dados.geolocalizacao || ""}">

      <label>Ponto de Acesso</label>
      <input type="text" name="ponto_acesso" value="${dados.ponto_acesso || ""}">

      <!-- CONTATOS -->
      <h3>Contatos</h3>
      <input type="text" name="telefone" value="${dados.telefone || ""}" placeholder="Telefone">
      <input type="text" name="whatsapp" value="${dados.whatsapp || ""}" placeholder="WhatsApp">
      <input type="email" name="email" value="${dados.email || ""}" placeholder="Email">
      <input type="email" name="email_admin" value="${dados.email_admin || ""}" placeholder="Email do administrador">
      <input type="text" name="instagram" value="${dados.instagram || ""}" placeholder="@Instagram">
      <input type="text" name="facebook" value="${dados.facebook || ""}" placeholder="@Facebook">
      <input type="url" name="video" value="${dados.video || ""}" placeholder="Link do vídeo">
      <input type="url" name="website" value="${dados.website || ""}" placeholder="Link do site">

      <!-- FUNCIONAMENTO -->
      <h3>Funcionamento</h3>
      <textarea name="horario_funcionamento">${dados.horario_funcionamento || ""}</textarea>

      <!-- ... (mantém aqui todos os outros campos igualzinho ao que montei antes: 
                pagamentos, aceitação de animais/cartões, idiomas, público, características etc.) ... -->

      <!-- STATUS -->
      <label>Visível*</label>
      <select name="visivel" required>
        <option value="true" ${dados.visivel ? "selected" : ""}>Sim</option>
        <option value="false" ${dados.visivel === false ? "selected" : ""}>Não</option>
      </select>

      <label>Ativo*</label>
      <select name="ativo" required>
        <option value="true" ${dados.ativo ? "selected" : ""}>Sim</option>
        <option value="false" ${dados.ativo === false ? "selected" : ""}>Não</option>
      </select>

      <br>
      <button type="submit">${isEdit ? "Atualizar" : "Salvar"}</button>
      <button type="button" id="btnCancelar">Cancelar</button>
    </form>
  `;

  // cancelar
  document.getElementById("btnCancelar").addEventListener("click", () => {
    carregarInventario();
  });

  // submit
  document.getElementById("formInventarioCompleto").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const dadosForm = {};

    formData.forEach((value, key) => {
      if (dadosForm[key]) {
        if (!Array.isArray(dadosForm[key])) dadosForm[key] = [dadosForm[key]];
        dadosForm[key].push(value);
      } else {
        dadosForm[key] = value;
      }
    });

    // converter campos boolean
    ["visivel","ativo","aceita_cartao","aceita_animais","acessibilidade","decoracao"].forEach(campo => {
      if (dadosForm[campo]) dadosForm[campo] = (dadosForm[campo] === "true");
    });

    const url = isEdit ? rotas.atualizar(dados.id) : rotas.criar;
    const method = isEdit ? "PUT" : "POST";

    const resp = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dadosForm)
    });

    if (resp.ok) {
      alert(isEdit ? "Registro atualizado!" : "Registro salvo!");
      carregarInventario();
    } else {
      alert("Erro ao salvar!");
    }
  });
}

// =========================
// ADICIONAR
// =========================
btnAdd.addEventListener("click", () => {
  renderForm({}, false);
});

// =========================
// EDITAR
// =========================
async function editarRegistro(id) {
  const resp = await fetch(rotas.atualizar(id));
  const dados = await resp.json();
  renderForm(dados, true);
}

// =========================
// DELETAR
// =========================
async function deletarRegistro(id) {
  if (confirm("Tem certeza que deseja excluir?")) {
    await fetch(rotas.deletar(id), { method: "DELETE" });
    carregarInventario();
  }
}

// =========================
// INICIAL
// =========================
carregarInventario();
