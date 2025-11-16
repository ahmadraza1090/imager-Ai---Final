
import React, { useState, useCallback, useMemo } from 'react';
import { generateImages } from '../services/geminiService';
import { useAuth } from '../hooks/useAuth';
import { Resolution } from '../types';
// FIX: Import Variants type from framer-motion to fix type inference issues.
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Modal from '../components/Modal';
import ImageEditor from '../components/ImageEditor';
import Spinner from '../components/Spinner';

const allResolutions: Resolution[] = [
  { label: 'Square (1:1)', value: '1:1' },
  { label: 'Landscape (16:9)', value: '16:9' },
  { label: 'Portrait (9:16)', value: '9:16' },
  { label: 'Standard (4:3)', value: '4:3' },
  { label: 'Tall (3:4)', value: '3:4' },
];

const containerVariants: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
// FIX: Add Variants type annotation to ensure correct type inference for animation properties.
const itemVariants: Variants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } } };
const resultsContainerVariants: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
// FIX: Add Variants type annotation to ensure correct type inference for animation properties.
const imageVariants: Variants = { hidden: { opacity: 0, scale: 0.8, y: 20 }, visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } } };

const SkeletonLoader: React.FC = () => (
    <motion.div className="relative aspect-square bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden" variants={imageVariants}>
        <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent" animate={{ x: ['-100%', '100%'] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} />
    </motion.div>
);

const ImageCard: React.FC<{ src: string; onDownload: () => void; onEdit: () => void; }> = ({ src, onDownload, onEdit }) => (
    <motion.div className="relative group aspect-square bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg" variants={imageVariants} layout>
        <img src={src} alt="Generated AI" className="w-full h-full object-cover" />
        <motion.div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-4" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}>
            <motion.button onClick={onEdit} className="px-4 py-2 bg-white/20 text-white backdrop-blur-md rounded-lg hover:bg-white/30 flex items-center space-x-2 shadow-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>
                <span>Edit</span>
            </motion.button>
            <motion.button onClick={onDownload} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2 shadow-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
  const [resolution, setResolution] = useState<Resolution>(allResolutions[0]);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingImage, setEditingImage] = useState<string | null>(null);

  const tierConfig = useMemo(() => {
    switch (user?.tier) {
      case 'Pro': return { cost: 2, maxImages: 4, resolutions: allResolutions };
      case 'Basic': return { cost: 3, maxImages: 2, resolutions: allResolutions };
      default: return { cost: 4, maxImages: 1, resolutions: [allResolutions[0]] };
    }
  }, [user?.tier]);

  const creditsToDeduct = tierConfig.cost * numberOfImages;

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) { setError('Please enter a prompt.'); return; }
    if (!isAuthenticated) { setError('Please log in to generate images.'); return; }
    if (!deductCredits(creditsToDeduct)) { setError('Insufficient credits.'); return; }

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
  
  const handleNumberOfImagesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = parseInt(e.target.value, 10);
      setNumberOfImages(Math.min(value, tierConfig.maxImages));
  };
  
  const handleResolutionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value as Resolution['value'];
      const newResolution = allResolutions.find(r => r.value === value) || allResolutions[0];
      setResolution(newResolution);
  };

  return (
    <>
    <motion.div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16" variants={containerVariants} initial="hidden" animate="visible">
        <div className="max-w-3xl mx-auto">
            <motion.div className="text-center" variants={itemVariants}>
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">Image Generator</h1>
                <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">Turn your imagination into stunning visuals.</p>
            </motion.div>
            
            <motion.div className="mt-12 space-y-6" variants={itemVariants}>
                <motion.div>
                    <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Enter your imagination... (e.g., A futuristic cyberpunk city in rain, cinematic lighting)" className="w-full p-4 text-lg bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700/50 focus:border-primary-500 rounded-xl focus:ring-primary-500 transition duration-200 resize-none shadow-lg focus:shadow-2xl" rows={4} />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div variants={itemVariants}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Number of Images</label>
                        <select value={numberOfImages} onChange={handleNumberOfImagesChange} className="w-full p-3 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700/50 focus:border-primary-500 rounded-lg focus:ring-primary-500 transition shadow-md">
                            {[...Array(tierConfig.maxImages)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                        </select>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Aspect Ratio</label>
                        <select value={resolution.value} onChange={handleResolutionChange} disabled={tierConfig.resolutions.length === 1} className="w-full p-3 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700/50 focus:border-primary-500 rounded-lg focus:ring-primary-500 transition shadow-md disabled:opacity-50">
                            {tierConfig.resolutions.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                        </select>
                    </motion.div>
                </div>

                <motion.div className="flex flex-col items-center pt-4" variants={itemVariants}>
                    <motion.button onClick={handleGenerate} disabled={isLoading} className="w-full md:w-auto px-16 py-4 text-xl font-semibold text-white bg-gradient-to-r from-primary-600 to-secondary-500 rounded-lg shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center" whileHover={{ scale: isLoading ? 1 : 1.05, y: isLoading ? 0 : -3 }} whileTap={{ scale: isLoading ? 1 : 0.95 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
                        {isLoading ? (
                            <>
                                <Spinner />
                                <span className="ml-3">Generating...</span>
                            </>
                        ) : (
                            'Generate'
                        )}
                    </motion.button>
                    {isAuthenticated && <p className="mt-4 text-sm text-gray-500">This will cost <span className="font-semibold text-primary-600 dark:text-primary-400">{creditsToDeduct}</span> credits. You have <span className="font-semibold text-primary-600 dark:text-primary-400">{user?.credits}</span>.</p>}
                </motion.div>
                <AnimatePresence>{error && <motion.div className="text-center text-red-600 p-3 bg-red-100 dark:bg-red-900/50 rounded-lg" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>{error}</motion.div>}</AnimatePresence>
            </motion.div>
        </div>
        <div className="my-16"><motion.div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: '100%' }} transition={{ duration: 0.5, delay: 0.5 }} /></div>
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10"><h2 className="text-3xl font-bold text-gray-900 dark:text-white">Your Creations</h2><p className="mt-2 text-lg text-gray-500 dark:text-gray-400">Generated images will appear below.</p></div>
            <AnimatePresence>{isLoading && <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" variants={resultsContainerVariants} initial="hidden" animate="visible" exit="hidden">{[...Array(numberOfImages)].map((_, i) => (<SkeletonLoader key={i}/>))}</motion.div>}</AnimatePresence>
            <AnimatePresence>{!isLoading && generatedImages.length > 0 && <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" variants={resultsContainerVariants} initial="hidden" animate="visible">{generatedImages.map((src, index) => (<ImageCard key={index} src={src} onDownload={() => handleDownload(src, index)} onEdit={() => setEditingImage(src)} />))}</motion.div>}</AnimatePresence>
            {!isLoading && generatedImages.length === 0 && <motion.div className="text-center py-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}><svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg><h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No images generated yet</h3><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Your generated images will appear here.</p></motion.div>}
        </div>
    </motion.div>
    <Modal isOpen={!!editingImage} onClose={() => setEditingImage(null)} title="Image Editor">
        {editingImage && <ImageEditor imageSrc={editingImage} onClose={() => setEditingImage(null)} />}
    </Modal>
    </>
  );
};

export default GeneratorPage;
