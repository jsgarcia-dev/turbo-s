"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface AvatarUploadModalProps {
  onUploadSuccess: (url: string) => void;
  onClose: () => void;
  open: boolean;
  currentAvatarUrl?: string;
}

export default function AvatarUploadModal({
  onUploadSuccess,
  onClose,
  open,
  currentAvatarUrl,
}: AvatarUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    // Verificar tamanho (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      setError("Imagem muito grande. Máximo permitido é 5MB.");
      return;
    }

    // Verificar tipo
    if (!file.type.startsWith("image/")) {
      setError("Apenas arquivos de imagem são permitidos.");
      return;
    }

    setSelectedFile(file);
    setError("");

    // Criar URL para preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError("");

    try {
      // Criar um FormData para enviar o arquivo
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Enviar para a API de upload
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao fazer upload da imagem");
      }

      const data = await response.json();
      onUploadSuccess(data.url);
    } catch (err) {
      console.error("Erro no upload:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Ocorreu um erro ao fazer upload da imagem.",
      );
      setIsUploading(false);
    }
  };

  const resetState = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError("");
    setIsUploading(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Alterar foto de perfil</DialogTitle>
          <DialogDescription>
            Escolha uma nova foto para o seu perfil
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center gap-6 py-4">
          {error && (
            <p className="text-destructive text-center text-sm">{error}</p>
          )}

          {previewUrl ? (
            <div className="relative">
              <Image
                src={previewUrl}
                alt="Preview"
                width={128}
                height={128}
                className="border-border h-32 w-32 rounded-full border-2 object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setPreviewUrl(null);
                  setSelectedFile(null);
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 absolute -top-2 -right-2 rounded-full p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : currentAvatarUrl ? (
            <div className="relative">
              <img
                src={currentAvatarUrl}
                alt="Current profile photo"
                className="border-border/50 h-32 w-32 rounded-full border-2 object-cover opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="bg-background/80 rounded px-2 py-1 text-center text-xs font-medium">
                  Imagem atual
                </p>
              </div>
            </div>
          ) : null}

          <div className="flex w-full flex-col items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="avatar-upload"
            />
            <label htmlFor="avatar-upload" className="w-full">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                asChild
              >
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  Escolher imagem
                </span>
              </Button>
            </label>
            <p className="text-muted-foreground text-center text-xs">
              Formatos suportados: JPG, PNG, GIF (máx 5MB)
            </p>
          </div>

          <div className="flex w-full justify-between gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="relative overflow-hidden"
            >
              {isUploading ? (
                <>
                  <span className="flex items-center gap-2">
                    <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                    Enviando...
                  </span>
                </>
              ) : (
                "Salvar"
              )}
              <span className="absolute inset-0 -z-10 animate-[shimmer_3s_infinite] bg-[linear-gradient(90deg,transparent_25%,rgba(59,130,246,0.3)_50%,transparent_95%)] bg-[length:200%_100%] dark:bg-[linear-gradient(90deg,transparent_25%,rgba(16,185,129,0.15)_50%,transparent_75%)]" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
