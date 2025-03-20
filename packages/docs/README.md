# Documentação TurboS

Este pacote contém a documentação oficial do projeto TurboS, utilizando [Mintlify](https://mintlify.com/).

## Conteúdo da Documentação

A documentação cobre os seguintes aspectos:

- **Visão Geral e Introdução** - Conceitos básicos e arquitetura
- **Estrutura da Aplicação** - Organização dos diretórios e arquivos
- **Componentes UI** - Biblioteca de componentes reutilizáveis
- **Autenticação** - Sistema de autenticação e autorização
- **Database** - Estrutura do banco de dados e modelos
- **API Backend** - Documentação da API NestJS
- **API Reference** - Referência de endpoints disponíveis

## Estrutura

A documentação está organizada da seguinte forma:

```
packages/docs/
├── api/                 # Documentação do backend NestJS
│   ├── overview.mdx
│   ├── modules.mdx
│   └── authentication.mdx
├── database/            # Documentação do pacote de banco de dados
│   ├── overview.mdx
│   └── schema.mdx
├── authentication/      # Documentação sobre autenticação
│   ├── overview.mdx
│   ├── methods.mdx
│   └── middleware.mdx
├── components/          # Documentação de componentes
│   └── overview.mdx
├── api-reference/       # Referência da API
│   └── introduction.mdx
├── public/              # Recursos estáticos (imagens, etc.)
├── mint.json            # Configuração do Mintlify
├── introduction.mdx     # Página inicial
├── quickstart.mdx       # Guia de início rápido
├── development.mdx      # Guia de desenvolvimento
└── app-structure.mdx    # Estrutura da aplicação
```

## Desenvolvimento

Para iniciar o servidor de documentação localmente:

```bash
# Da raiz do projeto:
pnpm docs

# Ou diretamente do pacote:
cd packages/docs
pnpm dev
```

O servidor de desenvolvimento será iniciado em `http://localhost:3000` (ou outra porta disponível).

## Configuração

A documentação é configurada através do arquivo `mint.json`. Você pode personalizar:

- Cores e tema
- Navegação e agrupamento de páginas
- Links externos e redes sociais
- Muito mais

Consulte a [documentação do Mintlify](https://mintlify.com/docs/settings/global) para mais detalhes.

## Construindo para produção

Para construir a documentação para produção:

```bash
# Da raiz do projeto:
pnpm docs:build

# Ou diretamente do pacote:
cd packages/docs
pnpm build
```

## Removendo a documentação

Se você não precisar da documentação, pode removê-la completamente:

```bash
# Da raiz do projeto:
pnpm remove-docs
```

⚠️ **Atenção**: Esta ação é irreversível e removerá todos os arquivos de documentação e dependências relacionadas.

## Implantação

Para implantar a documentação, você pode:

1. Hospedar com o Mintlify Cloud (recomendado)
2. Construir e hospedar como um site estático em qualquer provedor (Vercel, Netlify, etc.)

## Saiba Mais

- [Documentação Oficial do Mintlify](https://mintlify.com/docs)
- [Componentes MDX](https://mintlify.com/docs/components/mdx)
- [Personalização Avançada](https://mintlify.com/docs/settings/customization)
