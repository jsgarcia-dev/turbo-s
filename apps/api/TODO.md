# Implementando RBAC (Role-Based Access Control) no NestJS

## Recomendações Iniciais

### 1. CASL como Solução Recomendada

CASL é uma das melhores opções para NestJS. Instalação:

```bash
pnpm add @casl/ability @nestjs/casl
```

### 2. Implementação Básica

#### casl-ability.factory.ts:

```typescript
import { Injectable } from '@nestjs/common';
import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { UserRole } from '@repo/database';

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: any) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    if (user.role === UserRole.ADMIN) {
      can('manage', 'all'); // administrador pode fazer tudo
    }

    if (user.role === UserRole.USER) {
      can('read', 'Profile');
      can('update', 'Profile', { id: user.id }); // usuário só pode atualizar próprio perfil
      can('read', 'Post');
      can('create', 'Post');
      can('update', 'Post', { authorId: user.id }); // usuário só pode atualizar próprios posts
      can('delete', 'Post', { authorId: user.id });
    }

    return build();
  }
}
```

### 3. Módulo CASL

#### casl.module.ts:

```typescript
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory';

@Module({
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
```

### 4. Guard para Verificação de Permissões

#### policies.guard.ts:

```typescript
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { CHECK_POLICIES_KEY } from '../decorators/check-policies.decorator';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get(CHECK_POLICIES_KEY, context.getHandler()) || [];

    const { user } = context.switchToHttp().getRequest();
    const ability = this.caslAbilityFactory.createForUser(user);

    return policyHandlers.every((handler) => handler.handle(ability));
  }
}
```

### 5. Decorators Auxiliares

#### check-policies.decorators.ts:

```typescript
import { SetMetadata } from '@nestjs/common';
import { PolicyHandler } from '../interfaces/policy-handler.interface';

export const CHECK_POLICIES_KEY = 'check_policy';
export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
```

### 6. Exemplo de Uso em Controller

#### posts.controller.ts:

```typescript
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PoliciesGuard } from '../../common/guards/policies.guard';
import { CheckPolicies } from '../../common/decorators/check-policies.decorator';

@Controller('posts')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class PostsController {
  @Post()
  @CheckPolicies((ability) => ability.can('create', 'Post'))
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can('read', 'Post'))
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }
}
```

## Benefícios da Abordagem

- CASL é uma biblioteca madura e bem mantida
- Integração nativa com NestJS
- Sistema de permissões granular e flexível
- Fácil de testar e manter
- Suporte a condições dinâmicas
- Boa documentação e comunidade ativa

## Alternativas ao CASL

Existem outras opções disponíveis:

- AccessControl
- RBAC
- Implementação própria usando Guards

No entanto, o CASL é geralmente a melhor escolha para NestJS porque:

- Tem melhor integração
- É mais flexível
- Tem melhor performance
- Suporta casos de uso complexos
- Tem uma API mais intuitiva
