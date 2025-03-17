# Aplicação Web - Turbo-S

Esta é a aplicação web do projeto Turbo-S, desenvolvida com [Next.js](https://nextjs.org) 15.2 e React 19.

## Tecnologias Utilizadas

- **Framework**: Next.js 15.2.0
- **UI/UX**: 
  - Tailwind CSS 4.0
  - Radix UI (shadcn/ui)
  - Framer Motion
- **Gerenciamento de Estado**: Zustand
- **Formulários**: React Hook Form + Zod
- **Consultas de Dados**: TanStack Query
- **Autenticação**: Better Auth

## Estrutura do Projeto

```
apps/web/
├── actions/       # Server Actions
├── app/           # Rotas e páginas da aplicação
├── components/    # Componentes reutilizáveis
├── hooks/         # Hooks personalizados
├── lib/           # Utilitários e configurações
├── public/        # Arquivos estáticos
├── services/      # Serviços de API
└── types/         # Definições de tipos
```

## Requisitos

- Node.js 18 ou superior
- pnpm 9.0.0

## Começando

1. Instale as dependências:

```bash
# Na raiz do monorepo
pnpm install
```

2. Configure as variáveis de ambiente:

```bash
# Copie o arquivo de exemplo
cp .env.example .env.local
# Edite o arquivo .env.local com suas configurações
```

3. Execute o servidor de desenvolvimento:

```bash
# Na raiz do monorepo
pnpm dev

# Ou apenas a aplicação web
pnpm --filter web dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

## Scripts Disponíveis

- `pnpm dev` - Inicia o servidor de desenvolvimento com Turbopack
- `pnpm build` - Constrói a aplicação para produção
- `pnpm start` - Inicia a aplicação em modo de produção
- `pnpm lint` - Executa a verificação de linting
- `pnpm lint:fix` - Corrige problemas de linting automaticamente
- `pnpm format` - Formata o código com Prettier
- `pnpm typecheck` - Verifica tipos TypeScript

## Integração com o Backend

Esta aplicação web se comunica com a API NestJS localizada em `apps/api` e compartilha o pacote de banco de dados em `packages/database`.

## Deploy

A aplicação pode ser implantada em qualquer plataforma que suporte Next.js, como:

- [Vercel](https://vercel.com)
- [Netlify](https://netlify.com)
- [AWS Amplify](https://aws.amazon.com/amplify/)

Para implantar na Vercel, que é a plataforma recomendada para Next.js:

```bash
pnpm build
# Siga as instruções da plataforma de deploy escolhida
```

## Mais Informações

Para saber mais sobre Next.js, consulte os seguintes recursos:

- [Documentação do Next.js](https://nextjs.org/docs)
- [Aprenda Next.js](https://nextjs.org/learn)