(function () {
  "use strict";

  const modulo = document.querySelector("#modulo-golpes-whatsapp");
  if (!modulo) return;

  const perguntas = [
    {
      texto:
        "Sua mãe manda mensagem de um número novo pedindo um Pix urgente. O que você faz?",
      respostas: [
        "Envio o Pix na hora, é urgência",
        "Ligo para ela por outro canal antes",
        "Peço pra ela provar quem é",
        "Ignoro e não respondo",
      ],
      correta: 1,
      explicacao:
        "Confirmar por outro canal antes de enviar dinheiro é a atitude mais segura, mesmo quando a mensagem parece urgente.",
      importancia:
        "Golpistas usam a pressa para você não parar para pensar. Ligar ou chamar em vídeo por outro canal costuma esclarecer a situação em poucos segundos.",
    },
    {
      texto:
        "Uma pessoa pede o código de 6 números que chegou por SMS. Como você deve agir?",
      respostas: [
        "Passo o código para ajudar",
        "Compartilho só se a pessoa parecer conhecida",
        "Não compartilho o código com ninguém",
        "Envio o código e depois troco a senha",
      ],
      correta: 2,
      explicacao:
        "Códigos recebidos por SMS são pessoais. Nunca informe esse número, nem para alguém que diga trabalhar em uma empresa.",
      importancia:
        "Com esse código, o criminoso pode tentar entrar na sua conta. Empresas e familiares não precisam pedir um código que chegou no seu celular.",
    },
    {
      texto:
        "Você recebe um áudio de um familiar pedindo segredo e dinheiro. Qual é o próximo passo?",
      respostas: [
        "Faço a transferência rapidamente",
        "Ligo para o familiar usando o número salvo",
        "Peço o CPF para confirmar",
        "Encaminho o áudio para outras pessoas",
      ],
      correta: 1,
      explicacao:
        "Use um número que você já conhece para confirmar a história antes de qualquer pagamento.",
      importancia:
        "Hoje, até a voz pode ser imitada. Uma ligação feita por você, no número salvo, ajuda a separar um pedido real de uma tentativa de golpe.",
    },
    {
      texto:
        "Uma mensagem traz um link para atualizar seus dados do banco. O que é mais seguro?",
      respostas: [
        "Clico para não perder o acesso",
        "Clico apenas se tiver o logotipo do banco",
        "Não clico e procuro o banco pelo aplicativo oficial",
        "Peço para outra pessoa clicar por mim",
      ],
      correta: 2,
      explicacao:
        "Não abra links inesperados. Entre no banco pelo aplicativo ou site que você já conhece.",
      importancia:
        "Links falsos podem roubar senhas e dados. O endereço e o logotipo podem parecer verdadeiros, mas o aplicativo oficial é uma escolha mais segura.",
    },
    {
      texto:
        "Você percebe que alguém está usando a foto de um conhecido em outro número. O que deve fazer?",
      respostas: [
        "Aviso a pessoa por um contato conhecido e denuncio a conta",
        "Mando dinheiro para testar",
        "Respondo para descobrir mais",
        "Compartilho o número em grupos",
      ],
      correta: 0,
      explicacao:
        "Avise a pessoa por um canal conhecido e denuncie o perfil falso no próprio aplicativo.",
      importancia:
        "Avisar rapidamente pode proteger outras pessoas. Não continue a conversa: bloqueie e denuncie o contato suspeito.",
    },
  ];

  const aplicacao = modulo.querySelector("#mod-whatsapp-aplicacao");
  const contador = modulo.querySelector("#mod-whatsapp-contador");
  const progresso = modulo.querySelector("#mod-whatsapp-progresso-preenchido");
  const barra = modulo.querySelector(".mod-whatsapp-progresso");
  const voltar = modulo.querySelector("#mod-whatsapp-voltar");
  const quiz = modulo.querySelector("#quiz");
  let perguntaAtual = 0;
  let pontuacao = 0;
  const respostasDadas = Array(perguntas.length).fill(null);

  function atualizarProgresso() {
    const numero = perguntaAtual + 1;
    contador.textContent = `${numero} de ${perguntas.length}`;
    progresso.style.width = `${(numero / perguntas.length) * 100}%`;
    barra.setAttribute("aria-valuenow", String(numero));
  }

  function criarBotao(texto, indice, pergunta, opcoes) {
    const botao = document.createElement("button");
    botao.className = "mod-whatsapp-resposta";
    botao.type = "button";
    botao.innerHTML = `<span class="mod-whatsapp-radio" aria-hidden="true"></span><span>${texto}</span>`;
    botao.addEventListener("click", () =>
      responder(botao, indice, pergunta, opcoes),
    );
    return botao;
  }

  function responder(botao, indice, pergunta, opcoes) {
    opcoes.querySelectorAll("button").forEach((item) => {
      item.disabled = true;
      item.classList.add("mod-whatsapp-desativada");
    });

    const acertou = indice === pergunta.correta;
    botao.classList.remove("mod-whatsapp-desativada");
    botao.classList.add(
      acertou ? "mod-whatsapp-correta" : "mod-whatsapp-incorreta",
    );
    opcoes
      .querySelectorAll("button")
      [pergunta.correta].classList.add("mod-whatsapp-correta");
    if (respostasDadas[perguntaAtual] === pergunta.correta && !acertou)
      pontuacao -= 1;
    if (respostasDadas[perguntaAtual] !== pergunta.correta && acertou)
      pontuacao += 1;
    respostasDadas[perguntaAtual] = indice;

    const feedback = document.createElement("div");
    feedback.className = `mod-whatsapp-feedback ${acertou ? "mod-whatsapp-feedback-certo" : "mod-whatsapp-feedback-erro"}`;
    feedback.setAttribute("role", "status");
    feedback.innerHTML = `<strong>${acertou ? "Resposta certa!" : "Resposta incorreta."}</strong><span>${pergunta.explicacao}</span>`;
    opcoes.after(feedback);

    const acao = document.createElement("button");
    acao.className = "mod-whatsapp-acao";
    acao.type = "button";
    acao.textContent =
      perguntaAtual === perguntas.length - 1
        ? "Ver resultado"
        : "Próxima pergunta";
    acao.addEventListener("click", () => {
      perguntaAtual += 1;
      if (perguntaAtual >= perguntas.length) renderizarResultado();
      else renderizar();
    });
    feedback.after(acao);
  }

  function renderizar() {
    atualizarProgresso();
    voltar.hidden = perguntaAtual === 0;
    aplicacao.className = "mod-whatsapp-aplicacao mod-whatsapp-entrada";
    const pergunta = perguntas[perguntaAtual];
    const titulo = document.createElement("p");
    titulo.className = "mod-whatsapp-etiqueta";
    titulo.textContent = `PERGUNTA ${perguntaAtual + 1} DE ${perguntas.length}`;

    const perguntaTitulo = document.createElement("h1");
    perguntaTitulo.id = "modulo-golpes-titulo";
    perguntaTitulo.className = "mod-whatsapp-pergunta";
    perguntaTitulo.textContent = pergunta.texto;

    const opcoes = document.createElement("div");
    opcoes.className = "mod-whatsapp-opcoes";
    pergunta.respostas.forEach((resposta, indice) =>
      opcoes.appendChild(criarBotao(resposta, indice, pergunta, opcoes)),
    );

    aplicacao.replaceChildren(titulo, perguntaTitulo, opcoes);
    requestAnimationFrame(() =>
      aplicacao.classList.add("mod-whatsapp-visivel"),
    );
  }

  function renderizarResultado() {
    contador.textContent = "Concluído";
    progresso.style.width = "100%";
    barra.setAttribute("aria-valuenow", "5");
    voltar.hidden = true;
    aplicacao.className = "mod-whatsapp-aplicacao mod-whatsapp-entrada";
    const percentual = Math.round((pontuacao / perguntas.length) * 100);
    const mensagem =
      percentual === 100
        ? "Você está preparado para reconhecer os principais sinais de golpe."
        : "Você já aprendeu passos importantes. Continue confirmando pedidos antes de agir.";
    aplicacao.innerHTML = `<div class="mod-whatsapp-resultado"><div class="mod-whatsapp-icone-resultado" aria-hidden="true">✓</div><p class="mod-whatsapp-etiqueta">QUIZ FINALIZADO</p><h1 class="mod-whatsapp-titulo-resultado">Você acertou ${pontuacao} de ${perguntas.length}</h1><p class="mod-whatsapp-mensagem-resultado">${mensagem}</p><div class="mod-whatsapp-resumo"><strong>Uma regra para guardar</strong><span>Na dúvida, pare, não transfira dinheiro e confirme por outro canal.</span></div><button class="mod-whatsapp-acao" id="mod-whatsapp-reiniciar" type="button">Fazer o quiz novamente</button></div>`;
    requestAnimationFrame(() =>
      aplicacao.classList.add("mod-whatsapp-visivel"),
    );
    modulo
      .querySelector("#mod-whatsapp-reiniciar")
      .addEventListener("click", () => {
        perguntaAtual = 0;
        pontuacao = 0;
        respostasDadas.fill(null);
        renderizar();
      });
  }

  voltar.addEventListener("click", () => {
    if (perguntaAtual > 0) {
      perguntaAtual -= 1;
      renderizar();
    }
  });

  function mostrarQuiz(evento) {
    evento.preventDefault();
    quiz.classList.add("mod-whatsapp-quiz-visivel");
    quiz.setAttribute("aria-hidden", "false");
    quiz.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  modulo.querySelectorAll('a[href="#quiz"]').forEach((link) => {
    link.addEventListener("click", mostrarQuiz);
  });

  modulo.querySelectorAll(".mod-whatsapp-compartilhar").forEach((botao) => {
    botao.addEventListener("click", async () => {
      const texto =
        "Cuidado com golpes via WhatsApp. Confirme pedidos por outro canal antes de enviar dinheiro.";
      try {
        if (navigator.share)
          await navigator.share({
            title: "Segurança Digital",
            text: texto,
            url: window.location.href,
          });
        else
          await navigator.clipboard.writeText(
            `${texto} ${window.location.href}`,
          );
        botao.textContent = navigator.share
          ? "Compartilhado!"
          : "Link copiado!";
      } catch (erro) {
        if (erro.name !== "AbortError") botao.textContent = "Tente novamente";
      }
      window.setTimeout(() => {
        botao.textContent = "Compartilhar com a família";
      }, 2400);
    });
  });

  renderizar();
})();
