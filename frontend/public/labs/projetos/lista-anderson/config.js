/**
 * ARQUIVO DE CONFIGURAÇÃO — edite apenas este arquivo para customizar o site.
 * Nenhuma outra parte do código precisa ser alterada.
 */

var config = {
  /** Título principal do site */
  siteTitle: "Meus skills de DevOps",
  /** Subtítulo / frase de apoio */
  siteSubtitle: "Stack de tecnologias, ferramentas e conhecimentos em engenharia de software",
  /** Nome exibido no topo */
  ownerName: "DevOps Classroom",
  /** Texto do rodapé */
  footerText: "Feito com carinho — Prof. Anderson | DevOps & Web Development",
  /** Cor neon de destaque: "cyan" | "lime" | "violet" | "pink" */
  accent: "cyan",

  /** Seus desejos / competências */
  items: [
    {
      title: "Java",
      description:
        "Linguagem robusta e orientada a objetos para construção de sistemas enterprise escaláveis, resilientes e de altíssima performance.",
      image: "fotos/java.png",
      tag: "Backend Core",
      link: "https://www.java.com",
    },
    {
      title: "Spring Boot",
      description:
        "Framework Java moderno para criação rápida de microserviços, APIs RESTful e aplicações cloud-native com autoconfiguração e alta produtividade.",
      image: "fotos/spring.png",
      tag: "Microservices & APIs",
      link: "https://spring.io/projects/spring-boot",
    },
    {
      title: "Oracle Database",
      description:
        "Gestão e otimização de bancos de dados relacionais corporativos, garantindo integridade transacional ACID e alta disponibilidade de dados.",
      image: "data:image/jpeg;base64,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",
      tag: "Enterprise DB",
      link: "https://www.oracle.com/database/",
    },
    {
      title: "Kali Linux",
      description:
        "Sistema essencial para SecOps, testes de penetração e auditoria de segurança, integrando a cultura DevSecOps na pipeline CI/CD.",
      image: "fotos/kali.png",
      tag: "SecOps & Pentest",
      link: "https://www.kali.org/",
    },
    {
      title: "React",
      description:
        "Biblioteca frontend reativa para construção de interfaces modernas, dinâmicas e de altíssima velocidade para dashboards corporativos.",
      image: "fotos/react.jpg",
      tag: "Frontend UI",
      link: "https://react.dev/",
    },
    {
      title: "Angular",
      description:
        "Plataforma frontend robusta baseada em TypeScript para desenvolvimento de Single Page Applications (SPA) escaláveis e estruturadas.",
      image: "fotos/angular.png",
      tag: "Enterprise Web",
      link: "https://angular.dev/",
    },
  ],
};