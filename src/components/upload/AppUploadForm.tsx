import { useState } from 'react';
import { useRouter } from 'next/router';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import { useAuth } from '@/context/AuthContext';
import { useSupabaseStorage } from '@/hooks/useSupabaseStorage';
import type { App } from '@/types/app';

export default function AppUploadForm() {
  const router = useRouter();
  const { user } = useAuth();
  const { uploadFile, isUploading, error: uploadError } = useSupabaseStorage();
  
  const [formState, setFormState] = useState({ name: '', description: '', category: 'Tools', version: '' });
  const [files, setFiles] = useState<{ apk: File | null; icon: File | null }>({ apk: null, icon: null });
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const file = e.target.files ? e.target.files[0] : null;
    setFiles(prevState => ({ ...prevState, [name]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !files.apk || !files.icon) {
      setStatusMessage("Please fill all required fields and select an APK and an icon.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("Preparing upload...");

    try {
      const timestamp = Date.now();
      
      // CORRECTED PATHS: Create full paths inside the 'apps' bucket
      setStatusMessage("Uploading APK file...");
      const apkPath = `apks/${user.uid}/${timestamp}-${files.apk.name}`;
      const apkUrl = await uploadFile(files.apk, 'apps', apkPath);

      setStatusMessage("Uploading App Icon...");
      const iconPath = `icons/${user.uid}/${timestamp}-${files.icon.name}`;
      const iconUrl = await uploadFile(files.icon, 'apps', iconPath);

      if (!apkUrl || !iconUrl) {
        throw new Error(uploadError || "Failed to upload files to storage. Please try again.");
      }

      setStatusMessage("Saving app details...");
      const appData: Omit<App, 'id' | 'createdAt'> = {
        ...formState,
        apkUrl,
        iconUrl,
        screenshots: [], // We will add screenshots later
        developerId: user.uid,
        developerName: user.name,
        status: 'pending',
        downloadCount: 0,
        rating: 0,
        createdAt: serverTimestamp() as any,
      };

      await addDoc(collection(firestore, 'apps'), appData);

      setStatusMessage("✅ App submitted successfully for review!");
      setTimeout(() => router.reload(), 2000);

    } catch (error: any) {
      setStatusMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = "w-full p-3 bg-dark-900 border border-dark-600 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand transition";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form Fields... */}
      <div>
        <label className="block mb-2 font-semibold">App Name</label>
        <input type="text" name="name" onChange={handleInputChange} required className={inputStyle} />
      </div>
      <div>
        <label className="block mb-2 font-semibold">Description</label>
        <textarea name="description" rows={4} onChange={handleInputChange} required className={inputStyle}></textarea>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 font-semibold">Category</label>
          <select name="category" onChange={handleInputChange} className={inputStyle}>
            <option>Tools</option><option>Productivity</option><option>Games</option><option>Social</option>
          </select>
        </div>
        <div>
          <label className="block mb-2 font-semibold">Version (e.g., 1.0.0)</label>
          <input type="text" name="version" onChange={handleInputChange} required className={inputStyle} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
              <label className="block mb-2 font-semibold">APK File (.apk)</label>
              <input type="file" name="apk" accept=".apk" onChange={handleFileChange} required className={`${inputStyle} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-brand/20 file:text-brand`}/>
          </div>
          <div>
              <label className="block mb-2 font-semibold">App Icon (.png, .jpg)</label>
              <input type="file" name="icon" accept="image/png, image/jpeg" onChange={handleFileChange} required className={`${inputStyle} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-brand/20 file:text-brand`}/>
          </div>
      </div>
      
      <button type="submit" disabled={isSubmitting || isUploading} className="w-full bg-accent hover:bg-accent-dark font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed">
        {isSubmitting ? statusMessage : 'Submit for Review'}
      </button>

      {statusMessage && !isSubmitting && <p className="text-center mt-4">{statusMessage}</p>}
    </form>
  );
}
