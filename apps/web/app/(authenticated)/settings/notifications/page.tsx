import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell, Mail, Phone, Globe, MessageSquare } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Notificações | Configurações",
  description: "Gerencie suas preferências de notificações",
};

export default function NotificationsPage() {
  const notificationSettings = [
    {
      id: "email-notifications",
      title: "Notificações por Email",
      description: "Receba atualizações importantes por email",
      icon: Mail,
      defaultChecked: true,
    },
    {
      id: "sms-notifications",
      title: "Notificações SMS",
      description: "Receba alertas por mensagem de texto",
      icon: Phone,
      defaultChecked: false,
    },
    {
      id: "browser-notifications",
      title: "Notificações no Navegador",
      description: "Mostrar alertas quando você estiver usando o sistema",
      icon: Globe,
      defaultChecked: true,
    },
    {
      id: "app-notifications",
      title: "Notificações no Aplicativo",
      description: "Receba atualizações dentro do aplicativo",
      icon: MessageSquare,
      defaultChecked: true,
    },
  ];

  const notificationEvents = [
    {
      id: "account-updates",
      title: "Atualizações da Conta",
      description: "Alterações na sua conta, senha ou configurações",
      defaultChecked: true,
    },
    {
      id: "system-updates",
      title: "Atualizações do Sistema",
      description: "Novos recursos, melhorias e manutenções programadas",
      defaultChecked: true,
    },
    {
      id: "security-alerts",
      title: "Alertas de Segurança",
      description: "Atividades suspeitas ou tentativas de login",
      defaultChecked: true,
    },
    {
      id: "marketing",
      title: "Marketing e Promoções",
      description: "Ofertas especiais, dicas e boletins informativos",
      defaultChecked: false,
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pt-4 pb-2 md:pt-6 md:pb-4">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Bell className="h-4 w-4 text-amber-500 md:h-5 md:w-5" />
            <span>Canais de Notificação</span>
          </CardTitle>
          <CardDescription className="text-sm">
            Escolha como deseja receber suas notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          {notificationSettings.map((setting) => {
            const Icon = setting.icon;
            return (
              <div
                key={setting.id}
                className="hover:bg-muted/50 flex flex-col space-y-3 rounded-lg border p-3 transition-colors md:flex-row md:items-center md:justify-between md:space-y-0 md:p-4"
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full md:h-10 md:w-10">
                    <Icon className="text-primary h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{setting.title}</h3>
                    <p className="text-muted-foreground text-xs md:text-sm">
                      {setting.description}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Switch
                    id={setting.id}
                    defaultChecked={setting.defaultChecked}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pt-4 pb-2 md:pt-6 md:pb-4">
          <CardTitle className="text-base md:text-lg">
            Tipos de Notificação
          </CardTitle>
          <CardDescription className="text-sm">
            Escolha quais tipos de notificação você deseja receber
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {notificationEvents.map((event) => (
            <div
              key={event.id}
              className="flex flex-col space-y-2 py-2 md:flex-row md:items-center md:justify-between md:space-y-0"
            >
              <div className="space-y-1">
                <Label htmlFor={event.id} className="font-medium">
                  {event.title}
                </Label>
                <p className="text-muted-foreground text-xs md:text-sm">
                  {event.description}
                </p>
              </div>
              <div className="flex justify-end pt-1 md:pt-0">
                <Switch id={event.id} defaultChecked={event.defaultChecked} />
              </div>
            </div>
          ))}
        </CardContent>
        <Separator />
        <CardFooter className="flex flex-col space-y-2 pt-4 md:flex-row md:justify-end md:space-y-0 md:space-x-2 md:pt-6">
          <Button variant="outline" className="w-full md:w-auto">
            Restaurar Padrões
          </Button>
          <Button className="w-full md:w-auto">Salvar Alterações</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
