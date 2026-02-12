// ==========================================
// CONEXÃO COM SUPABASE
// ==========================================
const SUPABASE_URL = "https://bkipzmooqahwsxrtzomj.supabase.co";
const SUPABASE_KEY = "sb_publishable_uLmGAJieXUlYnr0PT8AMUw_TVsDT9mF";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("Script carregado. Supabase Client inicializado:", supabaseClient);

// ==========================================
// EVENT LISTENERS
// ==========================================
document.getElementById('btnLogin').addEventListener('click', login);
document.getElementById('btnCadastrar').addEventListener('click', cadastrar);

// ==========================================
// LOGIN
// ==========================================
async function login() {
  console.log("Botão Entrar clicado");

  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();

  if (!email || !senha) {
    alert("Por favor, preencha email e senha.");
    return;
  }

  console.log("Tentando login:", email, senha);

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password: senha
  });

  console.log("Login Data:", data);
  console.log("Login Error:", error);

  if (error) {
    alert("Erro no login: " + error.message);
    return;
  }

  // Login OK
  document.getElementById('loginDiv').style.display = 'none';
  document.getElementById('mainDiv').style.display = 'block';

  // Carrega oficinas
  carregarOficinas();
}

// ==========================================
// LOGOUT
// ==========================================
async function logout() {
  await supabaseClient.auth.signOut();
  document.getElementById('mainDiv').style.display = 'none';
  document.getElementById('loginDiv').style.display = 'block';
}

// ==========================================
// CARREGAR OFICINAS
// ==========================================
async function carregarOficinas() {
  const { data, error } = await supabaseClient.from('oficinas').select('*');

  if (error) {
    console.log("Erro ao carregar oficinas:", error);
    alert("Erro ao carregar oficinas: " + error.message);
    return;
  }

  const select = document.getElementById('oficina');
  select.innerHTML = '';
  data.forEach(oficina => {
    const option = document.createElement('option');
    option.value = oficina.id;
    option.textContent = oficina.nome;
    select.appendChild(option);
  });
}

// ==========================================
// CADASTRO DE PESSOA
// ==========================================
async function cadastrar() {
  const pessoa = {
    nome: document.getElementById('nome').value.trim(),
    cpf: document.getElementById('cpf').value.trim(),
    data_nascimento: document.getElementById('data_nascimento').value,
    nacionalidade: document.getElementById('nacionalidade').value.trim(),
    telefone: document.getElementById('telefone').value.trim(),
    endereco_rua: document.getElementById('endereco_rua').value.trim(),
    endereco_bairro: document.getElementById('endereco_bairro').value.trim(),
    endereco_numero: document.getElementById('endereco_numero').value.trim(),
    endereco_cep: document.getElementById('endereco_cep').value.trim(),
    cidade: document.getElementById('cidade').value.trim(),
    observacoes: document.getElementById('observacoes').value.trim()
  };

  console.log("Cadastrando pessoa:", pessoa);

  try {
    // INSERIR PESSOA
    const { data: pessoaData, error: pessoaError } = await supabaseClient
      .from('pessoas')
      .insert([pessoa])
      .select();

    if (pessoaError) throw pessoaError;

    const pessoa_id = pessoaData[0].id;
    const oficina_id = document.getElementById('oficina').value;

    // RELACIONAR COM OFICINA
    const { error: relError } = await supabaseClient
      .from('pessoa_oficina')
      .insert([{ pessoa_id, oficina_id }]);

    if (relError) throw relError;

    alert("Pessoa cadastrada com sucesso!");
  } catch (err) {
    console.log("Erro no cadastro:", err);
    alert("Erro ao cadastrar pessoa: " + err.message);
  }
}
