const perfis = [
    {
        id: 1,
        nome: "Engenheiro de Sistemas",
        categoria: "Construção",
        descricao: "Gosta de construir, corrigir falhas e encontrar soluções práticas para problemas tecnológicos.",
        imagem: "img/perfil-1.jpg"
    },
    {
        id: 2,
        nome: "Cientista Explorador",
        categoria: "Investigação",
        descricao: "Gosta de pesquisar, analisar evidências e descobrir como funcionam os fenômenos e as formas de vida desconhecidas.",
        imagem: "img/perfil-2.jpg"
    },
    {
        id: 3,
        nome: "Explorador de Campo",
        categoria: "Exploração",
        descricao: "Gosta de descobrir lugares, experimentar alternativas e lidar com situações novas em ambientes desconhecidos.",
        imagem: "img/perfil-3.jpg"
    },
    {
        id: 4,
        nome: "Estrategista da Missão",
        categoria: "Planejamento",
        descricao: "Gosta de organizar informações, coordenar pessoas e tomar decisões para alcançar os objetivos da equipe.",
        imagem: "img/perfil-4.jpg"
    }
];

const TOTAL_PERGUNTAS = 4;
const ANO_MINIMO = 1900;

let pontuacao = { 1: 0, 2: 0, 3: 0, 4: 0 };

const formulario = document.querySelector("#formulario");
const campoNome = document.querySelector("#nome");
const campoNascimento = document.querySelector("#nascimento");
const avisoGeral = document.querySelector("#aviso-geral");
const areaResultado = document.querySelector("#resultado");
const botaoRefazer = document.querySelector("#botao-refazer");

function lerData(texto) {
    const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(texto);
    if (partes === null) {
        return null;
    }

    const ano = Number(partes[1]);
    const mes = Number(partes[2]);
    const dia = Number(partes[3]);

    const teste = new Date(ano, mes - 1, dia);
    const existe = teste.getFullYear() === ano &&
                   teste.getMonth() === mes - 1 &&
                   teste.getDate() === dia;

    if (!existe || ano < ANO_MINIMO) {
        return null;
    }
    return { ano: ano, mes: mes, dia: dia };
}

function dataEstaNoFuturo(data) {
    const hoje = new Date();
    const anoHoje = hoje.getFullYear();
    const mesHoje = hoje.getMonth() + 1;
    const diaHoje = hoje.getDate();

    if (data.ano !== anoHoje) {
        return data.ano > anoHoje;
    }
    if (data.mes !== mesHoje) {
        return data.mes > mesHoje;
    }
    return data.dia > diaHoje;
}

function calcularIdade(data) {
    const hoje = new Date();
    let idade = hoje.getFullYear() - data.ano;

    const mesHoje = hoje.getMonth() + 1;
    const diaHoje = hoje.getDate();
    const aindaNaoFezAniversario = mesHoje < data.mes ||
                                   (mesHoje === data.mes && diaHoje < data.dia);

    if (aindaNaoFezAniversario) {
        idade = idade - 1;
    }
    return idade;
}

function definirDataMaxima() {
    const hoje = new Date();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    campoNascimento.max = hoje.getFullYear() + "-" + mes + "-" + dia;
}

function mostrarErro(campo, mensagem) {
    document.querySelector("#erro-" + campo).textContent = mensagem;

    if (campo === "nome") {
        campoNome.classList.add("campo-invalido");
    }
    if (campo === "nascimento") {
        campoNascimento.classList.add("campo-invalido");
    }
}

function limparErros() {
    document.querySelectorAll(".erro").forEach(function (erro) {
        erro.textContent = "";
    });
    campoNome.classList.remove("campo-invalido");
    campoNascimento.classList.remove("campo-invalido");
    avisoGeral.textContent = "";
}

function verificarRespostas() {
    limparErros();
    let primeiroErro = null;

    if (campoNome.value.trim() === "") {
        mostrarErro("nome", "Informe seu nome para entrar na missão.");
        primeiroErro = campoNome;
    }

    const data = lerData(campoNascimento.value);
    if (campoNascimento.value === "") {
        mostrarErro("nascimento", "Informe sua data de nascimento.");
    } else if (data === null) {
        mostrarErro("nascimento", "Data inválida. Escolha uma data real, a partir de " + ANO_MINIMO + ".");
    } else if (dataEstaNoFuturo(data)) {
        mostrarErro("nascimento", "A data de nascimento não pode estar no futuro.");
    }
    const dataComProblema = document.querySelector("#erro-nascimento").textContent !== "";
    if (dataComProblema && primeiroErro === null) {
        primeiroErro = campoNascimento;
    }

    for (let i = 1; i <= TOTAL_PERGUNTAS; i++) {
        const marcada = document.querySelector('input[name="pergunta' + i + '"]:checked');
        if (marcada === null) {
            mostrarErro("pergunta" + i, "Escolha uma alternativa para esta pergunta.");
            if (primeiroErro === null) {
                primeiroErro = document.querySelector('input[name="pergunta' + i + '"]');
            }
        }
    }

    if (primeiroErro !== null) {
        avisoGeral.textContent = "Confira os campos destacados antes de continuar.";
        primeiroErro.focus();
        return false;
    }
    return true;
}

function calcularPontuacao() {
    pontuacao = { 1: 0, 2: 0, 3: 0, 4: 0 };

    for (let i = 1; i <= TOTAL_PERGUNTAS; i++) {
        const marcada = document.querySelector('input[name="pergunta' + i + '"]:checked');
        pontuacao[marcada.value] = pontuacao[marcada.value] + 1;
    }
}

function criarCartaoPerfil(perfil) {
    const cartao = document.createElement("article");
    cartao.className = "perfil";

    const imagem = document.createElement("img");
    imagem.src = perfil.imagem;
    imagem.alt = "Ilustração do perfil " + perfil.nome;

    imagem.addEventListener("error", function () {
        const reserva = document.createElement("div");
        reserva.className = "imagem-reserva";
        reserva.textContent = "Imagem de " + perfil.nome + " ainda não adicionada";
        imagem.replaceWith(reserva);
    });

    const texto = document.createElement("div");
    texto.className = "perfil-texto";

    const titulo = document.createElement("h3");
    titulo.textContent = perfil.nome;

    const categoria = document.createElement("p");
    categoria.className = "categoria";
    categoria.textContent = "Categoria: " + perfil.categoria;

    const descricao = document.createElement("p");
    descricao.textContent = perfil.descricao;

    texto.append(titulo, categoria, descricao);
    cartao.append(imagem, texto);
    return cartao;
}

function mostrarResultado() {
    const data = lerData(campoNascimento.value);

    document.querySelector("#resultado-nome").textContent = campoNome.value.trim();
    document.querySelector("#resultado-idade").textContent = calcularIdade(data) + " anos";

    const pontosDosPerfis = perfis.map(function (perfil) {
        return pontuacao[perfil.id];
    });
    const maiorPontuacao = Math.max(...pontosDosPerfis);
    const vencedores = perfis.filter(function (perfil) {
        return pontuacao[perfil.id] === maiorPontuacao;
    });

    const titulo = document.querySelector("#resultado-titulo");
    const mensagem = document.querySelector("#resultado-mensagem");
    const lista = document.querySelector("#resultado-perfis");
    lista.innerHTML = "";

    if (vencedores.length === 1) {
        titulo.textContent = "Seu perfil: " + vencedores[0].nome;
        mensagem.textContent = "Análise concluída! Esta é a função que mais combina com você na Missão Aura.";
    } else {
        titulo.textContent = "Perfil multidisciplinar";
        mensagem.textContent = "Análise concluída! Suas escolhas combinam diferentes especialidades. " +
                               "Você possui um perfil multidisciplinar para a Missão Aura.";
    }

    vencedores.forEach(function (perfil) {
        lista.appendChild(criarCartaoPerfil(perfil));
    });

    formulario.hidden = true;
    areaResultado.hidden = false;
    areaResultado.scrollIntoView({ behavior: "smooth", block: "start" });
}

function refazerTeste() {
    formulario.reset();
    limparErros();
    pontuacao = { 1: 0, 2: 0, 3: 0, 4: 0 };

    areaResultado.hidden = true;
    formulario.hidden = false;
    campoNome.focus();
}

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    if (verificarRespostas() === false) {
        return;
    }
    calcularPontuacao();
    mostrarResultado();
});

botaoRefazer.addEventListener("click", refazerTeste);

definirDataMaxima();