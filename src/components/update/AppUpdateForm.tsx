import { useState } from 'react';
import { useRouter } from 'next/router';
import { useUpdateApp } from '@/hooks/useUpdateApp';
import type { App } from '@/types/app';

interface AppUpdateFormProps {
  app: App;
}

export default function AppUpdateForm({ app }: AppUpdateFormProps) {
  const router = useRouter();
  const { isUpdating, statusMessage, updateApp } = useUpdateApp();
  
  const [formState, setFormState] = useState({
    name: app.name,
    description: app.description,
    category: app.category,
    version: app.version,
  });
  const [files, setFiles] = useState<{ apk: File | null; icon: File | null }>({ apk: null, icon: null });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFiles(p => ({ ...p, [e.target.name]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateApp(app, formState, files);
    if (success) {
      setTimeout(() => {
        router.push('/dashboard/developer'); // Redirect to dashboard on success
      }, 2000);
    }
  };

  const inputStyle = "w-full p-3 bg-dark-900 border border-dark-600 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand transition";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form Fields pre-filled with existing data */}
      <div>
        <label className="block mb-2 font-semibold">App Name</label>
        <input type="text" name="name" value={formState.name} onChange={handleInputChange} required className={inputStyle} />
      </div>
      <div>
        <label className="block mb-2 font-semibold">Description</label>
        <textarea name="description" value={formState.description} rows={4} onChange={handleInputChange} required className={inputStyle}></textarea>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 font-semibold">Category</label>
          <select name="category" value={formState.category} onChange={handleInputChange} className={inputStyle}>
            <option>Tools</option><option>Productivity</option><option>Games</option><option>Social</option>
          </select>
        </div>
        <div>
          <label className="block mb-2 font-semibold">Version (e.g., 1.0.1)</label>
          <input type="text" name="version" value={formState.version} onChange={handleInputChange} required className={inputStyle} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
              <label className="block mb-2 font-semibold">New APK (Optional)</label>
              <input type="file" name="apk" accept=".apk" onChange={handleFileChange} className={`${inputStyle} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-brand/20 file:text-brand`}/>
              <p className="text-xs text-gray-500 mt-1">Leave empty to keep the current version.</p>
          </div>
          <div>
              <label className="block mb-2 font-semibold">New Icon (Optional)</label>
              <input type="file" name="icon" accept="image/png, image/jpeg" onChange={handleFileChange} className={`${inputStyle} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-brand/20 file:text-brand`}/>
              <p className="text-xs text-gray-500 mt-1">Leave empty to keep the current icon.</p>
          </div>
      </div>
      
      <button type="submit" disabled={isUpdating} className="w-full bg-accent hover:bg-accent-dark font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed">
        {isUpdating ? statusMessage : 'Update & Submit for Re-Approval'}
      </button>

      {statusMessage && !isUpdating && <p className="text-center mt-4">{statusMessage}</p>}
    </form>
  );
}
