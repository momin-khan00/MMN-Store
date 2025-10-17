import { useState } from 'react';
import { useRouter } from 'next/router';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import { useAuth } from '@/context/AuthContext';

export default function AppUploadForm() {
    const router = useRouter();
    const { user } = useAuth();
    
    const [formState, setFormState] = useState({ name: '', description: '', category: 'Tools', version: '' });
    const [files, setFiles] = useState<{ apk: File | null; icon: File | null }>({ apk: null, icon: null });
    const [statusMessage, setStatusMessage] = useState('');
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
            setStatusMessage("Error: Please fill all fields and select both files.");
            return;
        }

        setIsSubmitting(true);
        setStatusMessage("Initializing secure upload...");

        try {
            // Step 1: Call our Netlify Function to get secure URLs
            setStatusMessage("1/4: Preparing secure storage...");
            const response = await fetch('/.netlify/functions/createSignedUrls', {
                method: 'POST',
                body: JSON.stringify({
                    uid: user.uid,
                    apkFileName: files.apk.name,
                    iconFileName: files.icon.name,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to prepare upload.');
            }

            const { apkSignedUrl, iconSignedUrl, apkUrl, iconUrl } = await response.json();

            // Step 2: Upload APK using the secure URL
            setStatusMessage("2/4: Uploading APK file...");
            await fetch(apkSignedUrl, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/vnd.android.package-archive' },
                body: files.apk,
            });

            // Step 3: Upload Icon using the secure URL
            setStatusMessage("3/4: Uploading App Icon...");
            await fetch(iconSignedUrl, {
                method: 'PUT',
                headers: { 'Content-Type': files.icon.type },
                body: files.icon,
            });

            // Step 4: Save metadata to Firestore
            setStatusMessage("4/4: Saving app details...");
            await addDoc(collection(firestore, 'apps'), {
                name: formState.name, description: formState.description, category: formState.category,
                version: formState.version, apkUrl, iconUrl, screenshots: [], developerId: user.uid,
                developerName: user.name, status: 'pending', downloadCount: 0, rating: 0,
                createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
            });

            setStatusMessage("✅ Success! Your app is submitted.");
            setTimeout(() => router.reload(), 3000);

        } catch (error: any) {
            console.error("Detailed Submission Error:", error);
            setStatusMessage(`❌ FAILED: ${error.message}`);
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
                <textarea name="description" rows={4} onChange(handleInputChange) required className={inputStyle}></textarea>
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

            <button type="submit" disabled={isSubmitting} className="w-full bg-accent hover:bg-accent-dark font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed">
                {isSubmitting ? statusMessage : 'Submit for Review'}
            </button>

            {statusMessage && !isSubmitting && (
                <p className="text-center mt-4">
                    {statusMessage}
                </p>
            )}
        </form>
    );
}
