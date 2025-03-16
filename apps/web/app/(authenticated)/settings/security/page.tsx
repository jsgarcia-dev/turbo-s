import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Shield, Smartphone, Key, LogOut, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Segurança | Configurações",
  description: "Gerencie as configurações de segurança da sua conta",
};

export default function SecurityPage() {
  const securitySettings = [
    {
      id: "2fa",
      title: "Autenticação em duas etapas",
      description:
        "Requer um código adicional ao fazer login, mesmo que alguém tenha sua senha",
      icon: Key,
      defaultChecked: false,
    },
    {
      id: "login-alerts",
      title: "Alertas de login",
      description:
        "Receba notificações quando houver um novo login na sua conta",
      icon: AlertCircle,
      defaultChecked: true,
    },
  ];

  const connectedDevices = [
    {
      id: "device-1",
      name: "iPhone 13 Pro",
      type: "Telefone",
      location: "São Paulo, Brasil",
      lastActive: "Agora",
      isCurrentDevice: true,
    },
    {
      id: "device-2",
      name: "MacBook Pro",
      type: "Computador",
      location: "São Paulo, Brasil",
      lastActive: "10 minutos atrás",
      isCurrentDevice: false,
    },
    {
      id: "device-3",
      name: "Windows PC",
      type: "Computador",
      location: "Rio de Janeiro, Brasil",
      lastActive: "2 dias atrás",
      isCurrentDevice: false,
    },
  ];

  const recentActivities = [
    {
      id: "activity-1",
      action: "Login bem-sucedido",
      device: "iPhone 13 Pro",
      location: "São Paulo, Brasil",
      time: "Hoje, 14:30",
      ipAddress: "192.168.1.1",
    },
    {
      id: "activity-2",
      action: "Senha alterada",
      device: "MacBook Pro",
      location: "São Paulo, Brasil",
      time: "Ontem, 10:15",
      ipAddress: "192.168.1.2",
    },
    {
      id: "activity-3",
      action: "Login bem-sucedido",
      device: "Windows PC",
      location: "Rio de Janeiro, Brasil",
      time: "2 dias atrás, 08:45",
      ipAddress: "192.168.1.3",
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pt-4 pb-2 md:pt-6 md:pb-4">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Shield className="h-4 w-4 text-emerald-500 md:h-5 md:w-5" />
            <span>Configurações de Segurança</span>
          </CardTitle>
          <CardDescription className="text-sm">
            Configure medidas adicionais de segurança para proteger sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          {securitySettings.map((setting) => {
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
                <div className="flex items-center justify-end gap-2">
                  {setting.id === "2fa" && !setting.defaultChecked && (
                    <Button variant="outline" size="sm">
                      Configurar
                    </Button>
                  )}
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
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Smartphone className="h-4 w-4 text-blue-500 md:h-5 md:w-5" />
            <span>Dispositivos Conectados</span>
          </CardTitle>
          <CardDescription className="text-sm">
            Dispositivos que estão atualmente conectados à sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 md:space-y-4">
          {connectedDevices.map((device) => (
            <div
              key={device.id}
              className="hover:bg-muted/50 flex flex-col space-y-2 rounded-lg border p-3 transition-colors md:flex-row md:items-center md:justify-between md:space-y-0 md:p-4"
            >
              <div className="flex items-center gap-3 md:gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 md:h-10 md:w-10 dark:bg-blue-950">
                  <Smartphone className="h-4 w-4 text-blue-500 md:h-5 md:w-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-1 md:gap-2">
                    <h3 className="font-medium">{device.name}</h3>
                    {device.isCurrentDevice && (
                      <Badge
                        variant="outline"
                        className="border-green-200 bg-green-50 text-xs text-green-500 dark:border-green-800 dark:bg-green-950"
                      >
                        Dispositivo atual
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-xs md:text-sm">
                    {device.type} • {device.location} • Ativo:{" "}
                    {device.lastActive}
                  </p>
                </div>
              </div>
              <div className="flex justify-end pt-1 md:pt-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive/90 h-8 w-8"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Desconectar</span>
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
        <Separator />
        <CardFooter className="pt-4 md:pt-6">
          <Button variant="outline" className="w-full text-sm md:text-base">
            Desconectar todos os outros dispositivos
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="pt-4 pb-2 md:pt-6 md:pb-4">
          <CardTitle className="text-base md:text-lg">
            Atividades Recentes
          </CardTitle>
          <CardDescription className="text-sm">
            Histórico recente de atividades da sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 md:space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex flex-col space-y-1 rounded border p-2 md:p-3"
              >
                <div className="flex justify-between">
                  <span className="text-sm font-medium md:text-base">
                    {activity.action}
                  </span>
                  <span className="text-muted-foreground text-xs md:text-sm">
                    {activity.time}
                  </span>
                </div>
                <div className="text-muted-foreground text-xs md:text-sm">
                  <p>Dispositivo: {activity.device}</p>
                  <p>Localização: {activity.location}</p>
                  <p>IP: {activity.ipAddress}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="flex justify-end pt-4 md:pt-6">
          <Button
            variant="outline"
            className="w-full text-sm md:w-auto md:text-base"
          >
            Ver histórico completo
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
