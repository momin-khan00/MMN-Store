import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useSupabaseStorage } from '../../hooks/useSupabaseStorage';
import { AppData } from '../../types/app';

interface AppFormData {
  name: string;
  description: string;
  category: string;
  version: string;
  permissions: string;
}

const AppUploadForm: React.FC = () => {
  const { currentUser } = useAuth();
  const { isUploading, uploadProgress, uploadFiles } = useSupabaseStorage();
  
  const { register, handleSubmit, formState: { errors } } = useForm<AppFormData>();
  
  const [apkFile, setApkFile] = useState<File | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [screenshotFiles, setScreenshotFiles] = useState<FileList | null>(null);

  const handleApkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setApkFile(e.target.files[0]);
    }
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIconFile(e.target.files[0]);
    }
  };

  const handleScreenshotsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setScreenshotFiles(e.target.files);
    }
  };

  const onSubmit = async (data: AppFormData) => {
    if (!currentUser || !apkFile || !iconFile) {
      alert('Please fill all required fields and upload APK and icon');
      return;
    }

    try {
      // Prepare files for upload
      const filesToUpload: { [key: string]: File } = {
        apk: apkFile,
        icon: iconFile,
      };
      
      // Add screenshots if any
      if (screenshotFiles) {
        for (let i = 0; i < screenshotFiles.length; i++) {
          filesToUpload[`screenshot${i}`] = screenshotFiles[i];
        }
      }
      
      // Upload files to Backblaze B2
      const uploadedFiles = await uploadFiles(filesToUpload);
      
      // Prepare screenshot URLs
      const screenshotUrls: string[] = [];
      Object.keys(uploadedFiles).forEach(key => {
        if (key.startsWith('screenshot')) {
          screenshotUrls.push(uploadedFiles[key]);
        }
      });
      
      // Parse permissions
      const permissions = data.permissions.split(',').map(p => p.trim());
      
      // Create a unique app ID
      const appId = `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create app data
      const appData: AppData = {
        id: appId,
        name: data.name,
        description: data.description,
        category: data.category,
        version: data.version,
        apkUrl: uploadedFiles.apk,
        iconUrl: uploadedFiles.icon,
        screenshots: screenshotUrls,
        developerId: currentUser.uid,
        developerName: currentUser.displayName || 'Unknown Developer',
        status: 'pending',
        downloadCount: 0,
        createdAt: serverTimestamp() as Date,
        updatedAt: serverTimestamp() as Date,
        size: apkFile.size,
        permissions,
        rating: 0,
        reviewsCount: 0,
        featured: false,
      };
      
      // Save to Firestore
      await setDoc(doc(db, 'apps', appId), appData);
      
      alert('App uploaded successfully! It will be visible after admin approval.');
      
      // Reset form
      setApkFile(null);
      setIconFile(null);
      setScreenshotFiles(null);
    } catch (error) {
      console.error('Error uploading app:', error);
      alert('Failed to upload app. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Upload New App</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            App Name *
          </label>
          <input
            type="text"
            {...register('name', { required: 'App name is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            {...register('category', { required: 'Category is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            <option value="games">Games</option>
            <option value="productivity">Productivity</option>
            <option value="social">Social</option>
            <option value="entertainment">Entertainment</option>
            <option value="education">Education</option>
            <option value="tools">Tools</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="finance">Finance</option>
            <option value="health">Health & Fitness</option>
            <option value="other">Other</option>
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Version *
          </label>
          <input
            type="text"
            {...register('version', { required: 'Version is required' })}
            placeholder="e.g., 1.0.0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.version && (
            <p className="mt-1 text-sm text-red-600">{errors.version.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            APK File *
          </label>
          <input
            type="file"
            accept=".apk"
            onChange={handleApkChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {apkFile && (
            <p className="mt-1 text-sm text-gray-600">
              Selected: {apkFile.name} ({(apkFile.size / (1024 * 1024)).toFixed(2)} MB)
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            App Icon *
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleIconChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {iconFile && (
            <p className="mt-1 text-sm text-gray-600">
              Selected: {iconFile.name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Screenshots
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleScreenshotsChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {screenshotFiles && (
            <p className="mt-1 text-sm text-gray-600">
              Selected: {screenshotFiles.length} screenshot(s)
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Permissions (comma-separated)
          </label>
          <input
            type="text"
            {...register('permissions')}
            placeholder="e.g., Camera, Storage, Location"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {isUploading && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        <button
          type="submit"
          disabled={isUploading}
          className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? 'Uploading...' : 'Upload App'}
        </button>
      </form>
    </div>
  );
};

export default AppUploadForm;
