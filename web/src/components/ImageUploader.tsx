import { useState } from "react";
import { Upload, Button, Image, Typography, App } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { RcFile } from "antd/es/upload";
import { API_URL, imgUrl } from "../config";
import { TOKEN_STORAGE_KEY } from "../providers/dataProvider";

type Props = {
  resource: string;
  id: number;
  currentUrl?: string | null;
  onUploaded?: (newUrl: string) => void;
};

export function ImageUploader({ resource, id, currentUrl, onUploaded }: Props) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl ?? null);
  const { message } = App.useApp();

  const handleUpload = async (file: RcFile) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["jpg", "jpeg", "png", "webp"].includes(ext ?? "")) {
      message.error("Solo se permiten imágenes JPG, PNG o WebP");
      return false;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("archivo", file);

      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      const res = await fetch(`${API_URL}/${resource}/${id}/imagen`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);

      const data = await res.json();
      const url = data.imagen_url ?? null;
      setPreviewUrl(url);
      onUploaded?.(url);
      message.success("Imagen subida correctamente");
    } catch (e) {
      message.error("Error al subir la imagen");
    } finally {
      setUploading(false);
    }

    return false;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {previewUrl && (
        <Image
          src={imgUrl(previewUrl)}
          alt="Imagen actual"
          style={{ maxHeight: 200, objectFit: "contain" }}
          preview={false}
        />
      )}
      <Upload beforeUpload={handleUpload} showUploadList={false} accept="image/*">
        <Button icon={<UploadOutlined />} loading={uploading}>
          {previewUrl ? "Cambiar imagen" : "Subir imagen"}
        </Button>
      </Upload>
      {!previewUrl && (
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          Formatos: JPG, PNG, WebP
        </Typography.Text>
      )}
    </div>
  );
}
