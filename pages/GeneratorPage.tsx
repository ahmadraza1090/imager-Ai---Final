import React, { useState, useCallback } from 'react';
import { generateImages } from '../services/geminiService';
import { useAuth } from '../hooks/useAuth';
import { Resolution } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const resolutions: Resolution[] = [
  { label: 'Square (1:1)', value: '1:1' },
  { label: 'Landscape (16:9)', value: '16:9' },
  { label: 'Portrait (9:16)', value: '9:16' },
  { label: 'Standard (4:3)', value: '4:3' },
  { label: 'Tall (3:4)', value: '3:4' },
];

const SkeletonLoader: React.FC = () => (
    <div className="relative aspect-square bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden">
        <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
    </div>
);


const ImageCard: React.FC<{ src: string; onDownload: () => void }> = ({ src, onDownload }) => (
    <motion.div 
        className="relative group aspect-square bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
        <img src={src} alt="Generated AI" className="w-full h-full object-cover" />
        <motion.div 
            className="absolute inset-0 bg-black/60 flex items-center justify-center"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
        >
            <motion.button 
                onClick={onDownload} 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                <span>Download</span>
            </motion.button>
        </motion.div>
    </motion.div>
);


const GeneratorPage: React.FC = () => {
  const { isAuthenticated, user, deductCredits } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [numberOfImages, setNumberOfImages] = useState(1);
  const [resolution, setResolution] = useState<Resolution>(resolutions[0]);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const creditsToDeduct = 4 * numberOfImages;

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }
    if (!isAuthenticated) {
        setError('Please log in to generate images.');
        return;
    }
    if (!deductCredits(creditsToDeduct)) {
      setError('Insufficient credits.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const images = await generateImages(prompt, numberOfImages, resolution);
      setGeneratedImages(images);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, numberOfImages, resolution, isAuthenticated, deductCredits, creditsToDeduct]);

  const handleDownload = (imageSrc: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageSrc;
    const promptPart = prompt.slice(0, 20).replace(/\s+/g, '_');
    link.download = `imagerAi_${promptPart}_${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col">
        <div className="w-full py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">Image Generator</h1>
                    <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
                        Turn your imagination into stunning visuals.
                    </p>
                </div>
                
                <motion.div 
                    className="mt-10 p-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 space-y-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter your imagination... (e.g., A futuristic cyberpunk city in rain)"
                        className="w-full p-4 text-base bg-gray-100 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 rounded-lg focus:ring-blue-500 transition duration-200 resize-none shadow-inner"
                        rows={3}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number of Images</label>
                            <select
                                value={numberOfImages}
                                onChange={(e) => setNumberOfImages(parseInt(e.target.value))}
                                className="w-full p-3 bg-gray-100 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 rounded-lg focus:ring-blue-500 transition"
                            >
                                {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Generate up to 4 images at once.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Resolution</label>
                            <select
                                value={resolution.value}
                                onChange={(e) => setResolution(resolutions.find(r => r.value === e.target.value) || resolutions[0])}
                                className="w-full p-3 bg-gray-100 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 rounded-lg focus:ring-blue-500 transition"
                            >
                                {resolutions.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col items-center pt-4">
                        <motion.button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className={`w-full md:w-auto px-12 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-lg disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center`}
                            whileHover={{ scale: isLoading ? 1 : 1.05, y: isLoading ? 0 : -3 }}
                            whileTap={{ scale: isLoading ? 1 : 0.95 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <span>{isLoading ? 'Generating...' : 'Generate'}</span>
                        </motion.button>
                        {isAuthenticated && <p className="mt-3 text-sm text-gray-500">This will cost <span className="font-semibold text-blue-600 dark:text-blue-400">{creditsToDeduct}</span> credits. You have <span className="font-semibold text-blue-600 dark:text-blue-400">{user?.credits}</span>.</p>}
                    </div>

                    <AnimatePresence>
                    {error && (
                        <motion.div 
                            className="text-center text-red-600 p-3 bg-red-100 dark:bg-red-900/50 rounded-lg"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            {error}
                        </motion.div>
                    )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>

        <div className="flex-grow py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(numberOfImages)].map((_, i) => (
                           <SkeletonLoader key={i}/>
                        ))}
                    </div>
                )}

                <AnimatePresence>
                {!isLoading && generatedImages.length > 0 && (
                    <motion.div 
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { staggerChildren: 0.1 } }}
                    >
                        {generatedImages.map((src, index) => (
                            <ImageCard key={index} src={src} onDownload={() => handleDownload(src, index)} />
                        ))}
                    </motion.div>
                )}
                </AnimatePresence>

                {!isLoading && generatedImages.length === 0 && (
                    <div className="text-center py-16">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No images generated yet</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Your generated images will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default GeneratorPage;