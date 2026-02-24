'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  folder?: string;
}

export function ImageUpload({ value, onChange, folder = 'img' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Apenas imagens são permitidas');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Tamanho máximo: 5MB');
      return;
    }

    setUploading(true);
    setError('');

    const ext = file.name.split('.').pop();
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { data, error: uploadError } = await supabase.storage
      .from('images')
      .upload(filename, file, { upsert: true, contentType: file.type });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(data.path);
    onChange(publicUrl);
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => onChange('');

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 group">
          <Image src={value} alt="Preview" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button type="button" onClick={() => inputRef.current?.click()}
              className="bg-white text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-1.5">
              <i className="fa-solid fa-arrow-up-from-bracket" />Trocar
            </button>
            <button type="button" onClick={handleRemove}
              className="bg-red-500 text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-red-600 transition-colors flex items-center gap-1.5">
              <i className="fa-solid fa-trash" />Remover
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="relative w-full aspect-video rounded-2xl border-2 border-dashed border-slate-200 hover:border-brand-400 bg-slate-50 hover:bg-brand-50/30 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group">
          {uploading ? (
            <>
              <i className="fa-solid fa-circle-notch fa-spin text-2xl text-brand-500" />
              <p className="text-sm text-slate-500">Enviando...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-slate-200 group-hover:bg-brand-100 flex items-center justify-center transition-colors">
                <i className="fa-solid fa-image text-xl text-slate-400 group-hover:text-brand-500 transition-colors" />
              </div>
              <p className="text-sm font-medium text-slate-500 group-hover:text-brand-600 transition-colors">
                Clique ou arraste uma imagem
              </p>
              <p className="text-xs text-slate-400">PNG, JPG, WEBP • Máx. 5MB</p>
            </>
          )}
        </div>
      )}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <i className="fa-solid fa-circle-exclamation" />{error}
        </p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
    </div>
  );
}
