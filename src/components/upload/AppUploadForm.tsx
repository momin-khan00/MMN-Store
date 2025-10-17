import { useState } from 'react';
import { useRouter } from 'next/router';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import { useAuth } from '@/context/AuthContext';
import { useSupabaseStorage } from '@/hooks/useSupabaseStorage';

export default function AppUploadForm() {
  const router = useRouter();
  const { user } = useAuth();
  const { uploadFile, isUploading, error: uploadError } = useSupabaseStorage();
  
  const [formState, setFormState] = useState({ name: '', description: '', category: 'Tools', version: '' });
  const [files, setFiles] = useState<{ apk: File | null; icon: File | null }>({ apk: null, icon: null });
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFiles(p => ({ ...p, [e.target.name]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !files.apk || !files.icon) {
      setStatusMessage("Please fill all fields and select an APK and an icon.");
      setIsSuccess(false);
      return;
    }

    setIsSubmitting(true);
    setIsSuccess(false);
    setStatusMessage("Preparing upload...");

    try {
      const timestamp = Date.now();
      
      setStatusMessage("Uploading APK file...");
      const apkPath = `apks/${user.uid}/${timestamp}-${files.apk.name}`;
      const apkUrl = await uploadFile(files.apk, apkPath);

      // Check for upload error after each upload
      if (!apkUrl) {
          throw new Error(uploadError || "Failed to upload APK. Please check file size and permissions.");
      }

      setStatusMessage("Uploading App Icon...");
      const iconPath = `icons/${user.uid}/${timestamp}-${files.icon.name}`;
      const iconUrl = await uploadFile(files.icon, iconPath);
      
      if (!iconUrl) {
        throw new Error(uploadError || "Failed to upload App Icon. Please check file size and permissions.");
      }

      setStatusMessage("Saving app details to database...");
      await addDoc(collection(firestore, 'apps'), {
        name: formState.name,
        description: formState.description,
        category: formState.category,
        version: formState.version,
        apkUrl,
        iconUrl,
        screenshots: [],
        developerId: user.uid,
        developerName: user.name,
        status: 'pending',
        downloadCount: 0,
        rating: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setStatusMessage("App submitted successfully! The page will now reload.");
      setIsSuccess(true);
      setTimeout(() => router.reload(), 2500);

    } catch (error: any) {
      // This will now show the REAL error from Supabase
      setStatusMessage(`Error: ${error.message}`);
      setIsSuccess(false);
      console.error("Submission Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = "w-full p-3 bg-dark-900 border border-dark-600 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand transition";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form Fields... (No changes here) */}
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
        {isSubmitting ? 'Submitting...' : 'Submit for Review'}
      </button>

      {statusMessage && (
        <p className={`text-center mt-4 ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>
          {statusMessage}
        </p>
      )}
    </form>
  );
}
