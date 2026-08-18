export type Dificuldade = "Iniciante" | "Intermediário" | "Avançado";

export interface CatalogItem {
  title: string;
  description: string;
  assunto: string;
  dificuldade: Dificuldade;
  link: string;
  image?: string;
}

export const games: CatalogItem[] = [
  {
    title: "Cyber Dragon",
    description:
      "Ação e aventura cyberpunk em glass edition: colisões, sprites e loop de jogo em Canvas.",
    assunto: "Canvas & Animação",
    dificuldade: "Intermediário",
    link: "/labs/Games/GameCyberDragon.html",
    image: "/labs/img/dragon.png",
  },
  {
    title: "Cyber Raid",
    description:
      "Jogo tático de invasão cibernética — estados de jogo, HUD e efeitos liquid fire.",
    assunto: "Lógica de Jogo",
    dificuldade: "Avançado",
    link: "/labs/Games/GameCyberRaid.html",
  },
  {
    title: "Igloo do Ártico",
    description:
      "Sobrevivência e quebra-cabeças no gelo: física simples, teclado e colisões.",
    assunto: "Física Digital",
    dificuldade: "Iniciante",
    link: "/labs/Games/GameIgloo.html",
    image: "/labs/img/igloo.png",
  },
  {
    title: "Keystone Kapers",
    description:
      "Estratégia e lógica em neon glass — plataformas, temporizador e perseguição.",
    assunto: "Lógica de Jogo",
    dificuldade: "Intermediário",
    link: "/labs/Games/GameKeystone.html",
  },
  {
    title: "Magic Dragon",
    description:
      "Crescimento progressivo e velocidade: laço de animação, dificuldade dinâmica e pontuação.",
    assunto: "Canvas & Animação",
    dificuldade: "Iniciante",
    link: "/labs/Games/GameMagicDragon.html",
    image: "/labs/img/dragon.png",
  },
  {
    title: "Psychodelic Dragon",
    description:
      "Mini jogo de estudo de física digital e animações com CSS e JavaScript puro.",
    assunto: "Física Digital",
    dificuldade: "Iniciante",
    link: "/labs/projetos/PsyDragon/index.html",
    image: "/labs/img/dragon.png",
  },
  {
    title: "Pac-Man Lab",
    description:
      "Customização e lógica de jogos clássicos: grade, perseguição e estados dos fantasmas.",
    assunto: "Lógica de Jogo",
    dificuldade: "Avançado",
    link: "/labs/VisualLabs/VisualPacMan.html",
  },
];

export const visualLabs: CatalogItem[] = [
  {
    title: "HTML & CSS Visual Lab",
    description: "Layouts, divs e estilização passo a passo com resultado ao vivo.",
    assunto: "Front-end",
    dificuldade: "Iniciante",
    link: "/labs/VisualLabs/VisualHTML.html",
  },
  {
    title: "CSS Motion, Transitions & Flexbox",
    description: "Transições, animações e alinhamento com Flexbox na prática.",
    assunto: "Front-end",
    dificuldade: "Iniciante",
    link: "/labs/VisualLabs/VisualFlexBox.html",
  },
  {
    title: "SVG Visual Lab",
    description: "Arte e vetores com código: paths, gradientes e animação SVG.",
    assunto: "Front-end",
    dificuldade: "Intermediário",
    link: "/labs/VisualLabs/VisualSVG_v2.html",
  },
  {
    title: "Escudos de Futebol SVG",
    description: "Estudo de vetores recriando escudos dos times de RJ, SP e MG.",
    assunto: "Front-end",
    dificuldade: "Intermediário",
    link: "/labs/VisualLabs/VisualVetTeams.html",
  },
  {
    title: "Aventuras na Programação",
    description: "10 exercícios interativos com os comandos básicos de qualquer linguagem.",
    assunto: "Programação",
    dificuldade: "Iniciante",
    link: "/labs/VisualLabs/VisualBasicLanguageCommon.html",
  },
  {
    title: "JS Programming Logic Lab",
    description: "Lógica de programação em JavaScript: variáveis, laços e funções.",
    assunto: "Programação",
    dificuldade: "Intermediário",
    link: "/labs/VisualLabs/VusualJS_v2.html",
  },
  {
    title: "Dev & Regex Lab",
    description: "Aula interativa e guia completo de expressões regulares.",
    assunto: "Programação",
    dificuldade: "Intermediário",
    link: "/labs/VisualLabs/VisualRegEx.html",
  },
  {
    title: "Regex Glass — Testador",
    description: "Testador de expressões regulares com submissão de padrões.",
    assunto: "Programação",
    dificuldade: "Avançado",
    link: "/labs/VisualLabs/VusualRegExSubmit.html",
  },
  {
    title: "SQL Visual Lab",
    description: "Relatórios e cruzamento de dados com consultas SQL comentadas.",
    assunto: "Dados",
    dificuldade: "Intermediário",
    link: "/labs/VisualLabs/VisualSQL.html",
  },
  {
    title: "Data & Storage Evolution",
    description: "Como os dados são guardados: de arquivos a bancos distribuídos.",
    assunto: "Dados",
    dificuldade: "Iniciante",
    link: "/labs/VisualLabs/VisualDataStorage.html",
  },
  {
    title: "Docker & Containers",
    description: "Imagens, camadas, volumes e ciclo de vida de containers visualizados.",
    assunto: "DevOps",
    dificuldade: "Intermediário",
    link: "/labs/VisualLabs/VisualDocker.html",
    image: "/labs/img/docker.jpg",
  },
  {
    title: "Networking & Protocols",
    description: "Camadas, portas e protocolos usados no dia a dia de DevOps.",
    assunto: "DevOps",
    dificuldade: "Avançado",
    link: "/labs/VisualLabs/VisualNetProtocols.html",
    image: "/labs/img/cloud.jpg",
  },
  {
    title: "InfoSec & Ethical Hacking",
    description: "Fundamentos de segurança ofensiva e defensiva com demonstrações.",
    assunto: "Segurança",
    dificuldade: "Avançado",
    link: "/labs/VisualLabs/VisualSecOps.html",
  },
  {
    title: "Hugging Face API Lab",
    description: "Consumo real de API de IA direto do navegador, com tratamento de erros.",
    assunto: "IA & APIs",
    dificuldade: "Avançado",
    link: "/labs/VisualLabs/VisualHF.html",
  },
];

export const miniProjetos: CatalogItem[] = [
  {
    title: "Lista de Itens JavaScript",
    description:
      "Catálogo de itens com interface moderna em glass transparent, links e imagens.",
    assunto: "Front-end",
    dificuldade: "Iniciante",
    link: "/labs/projetos/lista-anderson/index.html",
    image: "/labs/img/lista.png",
  },
  {
    title: "Formatos de Dados",
    description:
      "Guia completo de como os dados são representados, transmitidos e interpretados.",
    assunto: "Dados",
    dificuldade: "Iniciante",
    link: "/labs/projetos/aula1208/aula_formatos.html",
    image: "/labs/img/formatos.jpg",
  },
  {
    title: "Exercícios — Formatos de Dados",
    description: "Lista prática de exercícios para fixar JSON, XML, CSV e YAML.",
    assunto: "Dados",
    dificuldade: "Intermediário",
    link: "/labs/projetos/aula1208/exercicios.html",
  },
  {
    title: "Igloo Game (versão de estudo)",
    description: "Versão comentada do Igloo para estudar HTML, CSS e JavaScript juntos.",
    assunto: "Programação",
    dificuldade: "Iniciante",
    link: "/labs/projetos/igloo/igloo_v2.html",
    image: "/labs/img/igloo.png",
  },
];

export const infos = [
  {
    title: "Aulas e horários",
    description: "Quartas e quintas, 18:20h às 19:40h, laboratório 1.",
    tag: "Agenda",
  },
  {
    title: "Avaliação",
    description: "Projetos práticos + entregas pelo formulário desta página.",
    tag: "Notas",
  },
  {
    title: "Materiais",
    description: "Labs visuais e mini projetos publicados aqui, sempre atualizados.",
    tag: "Material",
  },
  {
    title: "Contato",
    description: "andersonfp.faetec@gmail.com",
    tag: "Suporte",
  },
];
