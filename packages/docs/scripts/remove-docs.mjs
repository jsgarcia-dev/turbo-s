#!/usr/bin/env node

// Script para remover a documentação Mintlify de forma limpa
// Este script remove todos os arquivos de documentação, dependências e scripts relacionados

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const ROOT_DIR = path.resolve(process.cwd(), "../..");
const DOCS_PACKAGE_DIR = path.resolve(process.cwd(), "..");

// Função para remover pacote do workspace
function removePackageFromWorkspace() {
  console.log("Removendo pacote de documentação do workspace...");

  try {
    // Atualizar turbo.json para remover referências à documentação
    const turboJsonPath = path.join(ROOT_DIR, "turbo.json");
    if (fs.existsSync(turboJsonPath)) {
      const turboJson = JSON.parse(fs.readFileSync(turboJsonPath, "utf8"));

      // Remover pipeline relacionada à documentação
      if (turboJson.pipeline && turboJson.pipeline.docs) {
        delete turboJson.pipeline.docs;
      }

      fs.writeFileSync(turboJsonPath, JSON.stringify(turboJson, null, 2));
      console.log("Referências à documentação removidas do turbo.json");
    }

    // Remover o pacote de documentação do repositório
    fs.rmSync(DOCS_PACKAGE_DIR, { recursive: true, force: true });
    console.log("Pacote de documentação removido com sucesso");
  } catch (error) {
    console.error("Erro ao remover pacote do workspace:", error);
  }
}

// Atualizar o README principal para remover referências à documentação
function updateMainReadme() {
  const readmePath = path.join(ROOT_DIR, "README.md");

  if (fs.existsSync(readmePath)) {
    let readme = fs.readFileSync(readmePath, "utf8");

    // Procurar seção de documentação e removê-la
    const docSection = /## Documentação[\s\S]*?(?=## |$)/;
    readme = readme.replace(docSection, "");

    fs.writeFileSync(readmePath, readme);
    console.log("Referências à documentação removidas do README principal");
  }
}

// Executar a remoção
try {
  removePackageFromWorkspace();
  updateMainReadme();

  console.log("\n🗑️  A documentação Mintlify foi removida com sucesso.");
  console.log("⚠️  Este script se auto-destruirá após a execução.");
} catch (error) {
  console.error("\n❌ Erro ao remover a documentação:", error);
  process.exit(1);
}
