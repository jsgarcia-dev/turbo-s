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
  onClose,
  open,
}: AvatarUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleFileChange = () => {};

  const handleUpload = async () => {};

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
          {error && <p className="text-center text-sm text-red-500">{error}</p>}

          {previewUrl && (
            <div className="relative">
              <Image
                src={previewUrl}
                alt="Preview"
                width={128}
                height={128}
                className="h-32 w-32 rounded-full object-cover"
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
          )}

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
              Formatos suportados: JPG, PNG, GIF (max 5MB)
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
            >
              {isUploading ? "Enviando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
