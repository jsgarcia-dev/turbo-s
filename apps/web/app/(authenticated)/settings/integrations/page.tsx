"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Cloud, Database, FileText } from "lucide-react";
import SupabaseIcon from "@/components/icons/supabase-icon";

// Tipos para as integrações
interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: "active" | "inactive" | "pending";
}

export default function SettingsIntegrationsPage() {
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(
    null,
  );

  // Lista de integrações disponíveis
  const integrations: Integration[] = [
    {
      id: "supabase-storage",
      name: "Supabase Storage",
      description: "Armazenamento de arquivos na nuvem com Supabase",
      icon: <SupabaseIcon className="h-8 w-8" />,
      status: "active",
    },
    {
      id: "s3",
      name: "Amazon S3",
      description: "Armazenamento de objetos na AWS",
      icon: <Cloud className="h-8 w-8 text-blue-500" />,
      status: "inactive",
    },
    {
      id: "postgres",
      name: "PostgreSQL",
      description: "Banco de dados relacional",
      icon: <Database className="h-8 w-8 text-blue-700" />,
      status: "pending",
    },
    {
      id: "documents",
      name: "Processamento de Documentos",
      description: "Extração de dados de documentos PDF e imagens",
      icon: <FileText className="h-8 w-8 text-orange-500" />,
      status: "inactive",
    },
  ];

  // Função para voltar à lista de integrações
  const handleBackToList = () => {
    setSelectedIntegration(null);
  };

  // Renderiza a configuração específica da integração selecionada
  const renderIntegrationConfig = () => {
    switch (selectedIntegration) {
      case "supabase-storage":
        return <span> Supabase Storage </span>;
      default:
        return (
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
            <p className="text-muted-foreground text-center">
              Configuração não disponível para esta integração
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Integrações</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Gerencie as integrações com serviços externos.
          </p>
        </div>

        {selectedIntegration && (
          <Button
            variant="warning"
            onClick={handleBackToList}
            size="sm"
            className="gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para integrações
          </Button>
        )}
      </div>

      {selectedIntegration ? (
        <div className="space-y-4">{renderIntegrationConfig()}</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {integrations.map((integration) => (
            <Card key={integration.id} className="overflow-hidden">
              <div className="flex h-full flex-col p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
                    {integration.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{integration.name}</h3>
                      <Badge
                        variant={
                          integration.status === "active"
                            ? "success"
                            : integration.status === "pending"
                              ? "warning"
                              : "secondary"
                        }
                        className="ml-2"
                      >
                        {integration.status === "active"
                          ? "Ativo"
                          : integration.status === "pending"
                            ? "Pendente"
                            : "Inativo"}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {integration.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1"
                    onClick={() => setSelectedIntegration(integration.id)}
                  >
                    Configurar
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
