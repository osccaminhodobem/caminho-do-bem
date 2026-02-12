// Conexão com Supabase
const SUPABASE_URL = "https://bkipzmooqahwsxrtzomj.supabase.co";
const SUPABASE_KEY = "sb_publishable_uLmGAJieXUlYnr0PT8AMUw_TVsDT9mF";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// DEBUG inicial
console.log("Supabase Client:", supabaseClient);

// LOGIN
async function login() {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  console.log("Tentando login:", email, senha); // debug

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password: senha
  });

  if (error) {
    console.log("Erro detalhado:", error);
    alert("Erro no login: " + error.message);
  } else {
    console.log("Login bem-sucedido:", data);
    alert("Login realizado!");
    document.getElementById('loginDiv').style.display = 'none';
    document.getElementById('mainDiv').style.display = 'block';
    carregarOficinas();
  }
}

// LOGOUT
async function logout() {
  await supabaseClient.auth.signOut();
  document.getElementById('mainDiv').style.display = 'none';
  document.getElementById('loginDiv').style.display = 'block';
}

// CARREGAR OFICINAS
async function carregarOficinas() {
  const { data, error } = await supabaseClient.from('oficinas').select('*');
  if (!error) {
    const select = document.getElementById('oficina');
    select.innerHTML = '';
    data.forEach(oficina => {
      const option = document.createElement('option');
      option.value = oficina.id;
      option.textContent = oficina.nome;
      select.appendChild(option);
    });
  } else {
    console.log("Erro ao carregar oficinas:", error);
  }
}

// CADASTRO DE PESSOA
async function cadastrar() {
  const pessoa = {
    nome: document.getElementById('nome').value,
    cpf: document.getElementById('cpf').value,
    data_nascimento: document.getElementById('data_nascimento').value,
    nacionalidade: document.getElementById('nacionalidade').value,
    telefone: document.getElementById('telefone').value,
    endereco_rua: document.getElementById('endereco_rua').value,
    endereco_bairro: document.getElementById('endereco_bairro').value,
    endereco_numero: document.getElementById('endereco_numero').value,
    endereco_cep: document.getElementById('endereco_cep').value,
    cidade: document.getElementById('cidade').value,
    observacoes: document.getElementById('observacoes').value
  };

  console.log("Cadastrando pessoa:", pessoa);

  const { data: pessoaData, error: pessoaError } = await supabaseClient
    .from('pessoas')
    .insert([pessoa])
    .select();

  if (pessoaError) {
    console.log("Erro ao cadastrar pessoa:", pessoaError);
    alert("Erro ao cadastrar pessoa: " + pessoaError.message);
    return;
  }

  const pessoa_id = pessoaData[0].id;
  const oficina_id = document.getElementById('oficina').value;

  const { error: relError } = await supabaseClient
    .from('pessoa_oficina')
    .insert([{ pessoa_id, oficina_id }]);

  if (relError) {
    console.log("Erro ao relacionar oficina:", relError);
    alert("Erro ao relacionar oficina: " + relError.message);
    return;
  }

  alert("Pessoa cadastrada com sucesso!");
}
