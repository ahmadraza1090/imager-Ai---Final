import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageEditorProps {
  imageSrc: string;
  onClose: () => void;
}

// Icon Components for UI clarity
const SunIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const ContrastIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5a7 7 0 100 14 7 7 0 000-14z" /><path d="M12 5v14" /></svg>;
const SaturateIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2.65l7.07 7.07a8 8 0 11-14.14 0L12 2.65z" /></svg>;
const RotateLeftIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-6 6m0 0l-6-6m6 6V9a6 6 0 0112 0v3" /></svg>;
const RotateRightIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 15l6 6m0 0l6-6m-6 6V9a6 6 0 00-12 0v3" /></svg>;
const FlipHorizontalIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19.5v-15M4.5 12h15M7.5 16.5l-3-4.5 3-4.5M16.5 7.5l3 4.5-3 4.5" /></svg>;
const FlipVerticalIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12h15M12 4.5v15M7.5 16.5l4.5 3 4.5-3M16.5 7.5l-4.5-3-4.5 3" /></svg>;

const TooltipButton: React.FC<{ onClick: () => void; tooltip: string; children: React.ReactNode }> = ({ onClick, tooltip, children }) => (
    <div className="relative group flex justify-center">
        <button onClick={onClick} className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            {children}
        </button>
        <span className="absolute -top-10 scale-0 w-max transition-transform origin-bottom group-hover:scale-100 bg-gray-800 dark:bg-gray-900 p-2 text-xs text-white rounded-md shadow-lg">
            {tooltip}
        </span>
    </div>
);

const ImageEditor: React.FC<ImageEditorProps> = ({ imageSrc, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(new Image());
  const [activeTab, setActiveTab] = useState<'adjust' | 'filters' | 'transform'>('adjust');

  const [adjustments, setAdjustments] = useState({ brightness: 100, contrast: 100, saturate: 100 });
  const [filters, setFilters] = useState({ grayscale: false, sepia: false, invert: false });
  const [transform, setTransform] = useState({ rotate: 0, scaleX: 1, scaleY: 1 });

  const drawImage = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const image = imageRef.current;
    if (!canvas || !ctx) return;

    const { naturalWidth, naturalHeight } = image;
    const { rotate, scaleX, scaleY } = transform;

    const rad = (rotate * Math.PI) / 180;
    const absCos = Math.abs(Math.cos(rad));
    const absSin = Math.abs(Math.sin(rad));
    
    canvas.width = naturalWidth * absCos + naturalHeight * absSin;
    canvas.height = naturalHeight * absCos + naturalWidth * absSin;

    ctx.filter = [
      `brightness(${adjustments.brightness}%)`,
      `contrast(${adjustments.contrast}%)`,
      `saturate(${adjustments.saturate}%)`,
      filters.grayscale ? 'grayscale(100%)' : '',
      filters.sepia ? 'sepia(100%)' : '',
      filters.invert ? 'invert(100%)' : '',
    ].join(' ').trim();
    
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rad);
    ctx.scale(scaleX, scaleY);
    ctx.drawImage(image, -naturalWidth / 2, -naturalHeight / 2, naturalWidth, naturalHeight);
    
    ctx.setTransform(1, 0, 0, 1, 0, 0);

  }, [adjustments, filters, transform]);

  useEffect(() => {
    const image = imageRef.current;
    image.crossOrigin = 'anonymous';
    image.src = imageSrc;
    image.onload = () => drawImage();
  }, [imageSrc, drawImage]);
  
  useEffect(() => {
    drawImage();
  }, [adjustments, filters, transform, drawImage]);

  const handleAdjustChange = (e: React.ChangeEvent<HTMLInputElement>) => setAdjustments({ ...adjustments, [e.target.name]: parseInt(e.target.value) });
  const handleFilterToggle = (filterName: keyof typeof filters) => setFilters({ ...filters, [filterName]: !filters[filterName] });
  const handleRotate = (deg: number) => setTransform({ ...transform, rotate: (transform.rotate + deg) % 360 });
  const handleFlip = (axis: 'X' | 'Y') => {
      if (axis === 'X') setTransform({ ...transform, scaleX: transform.scaleX * -1 });
      if (axis === 'Y') setTransform({ ...transform, scaleY: transform.scaleY * -1 });
  };
  
  const handleReset = () => {
    setAdjustments({ brightness: 100, contrast: 100, saturate: 100 });
    setFilters({ grayscale: false, sepia: false, invert: false });
    setTransform({ rotate: 0, scaleX: 1, scaleY: 1 });
  };

  const handleDownload = () => {
      const canvas = canvasRef.current;
      if (canvas) {
          const link = document.createElement('a');
          link.download = `imagerAi_edited_${Date.now()}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
      }
  };

  const tabContent = {
    adjust: (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2"><SunIcon /> Brightness: {adjustments.brightness}%</label>
                <input type="range" name="brightness" min="0" max="200" value={adjustments.brightness} onChange={handleAdjustChange} className="w-full" />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2"><ContrastIcon /> Contrast: {adjustments.contrast}%</label>
                <input type="range" name="contrast" min="0" max="200" value={adjustments.contrast} onChange={handleAdjustChange} className="w-full" />
            </div>
             <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2"><SaturateIcon /> Saturation: {adjustments.saturate}%</label>
                <input type="range" name="saturate" min="0" max="200" value={adjustments.saturate} onChange={handleAdjustChange} className="w-full" />
            </div>
        </div>
    ),
    filters: (
        <div className="grid grid-cols-3 gap-2">
            {Object.keys(filters).map(key => (
                <button key={key} onClick={() => handleFilterToggle(key as keyof typeof filters)} className={`px-3 py-2 text-sm rounded-lg transition-colors ${filters[key as keyof typeof filters] ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
            ))}
        </div>
    ),
    transform: (
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 text-center">
                <p className="text-sm font-medium">Rotate</p>
                <div className="flex justify-center gap-2">
                    <TooltipButton onClick={() => handleRotate(-90)} tooltip="Rotate Left (-90°)"> <RotateLeftIcon /> </TooltipButton>
                    <TooltipButton onClick={() => handleRotate(90)} tooltip="Rotate Right (90°)"> <RotateRightIcon /> </TooltipButton>
                </div>
            </div>
             <div className="space-y-2 text-center">
                <p className="text-sm font-medium">Flip</p>
                <div className="flex justify-center gap-2">
                    <TooltipButton onClick={() => handleFlip('X')} tooltip="Flip Horizontal"> <FlipHorizontalIcon /> </TooltipButton>
                    <TooltipButton onClick={() => handleFlip('Y')} tooltip="Flip Vertical"> <FlipVerticalIcon /> </TooltipButton>
                </div>
            </div>
        </div>
    ),
  }

  return (
    <div className="space-y-4">
        <div className="w-full max-h-[40vh] flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-lg overflow-auto p-2">
            <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-900/50 p-1 rounded-lg flex space-x-1">
            {(['adjust', 'filters', 'transform'] as const).map(tab => (
                 <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === tab ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-white shadow' : 'text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50'}`}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                 </button>
            ))}
        </div>

        <div className="py-2">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {tabContent[activeTab]}
                </motion.div>
            </AnimatePresence>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <motion.button onClick={handleReset} className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700" whileHover={{scale: 1.05}} whileTap={{scale:0.95}}>Reset</motion.button>
            <motion.button onClick={handleDownload} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 shadow" whileHover={{scale: 1.05}} whileTap={{scale:0.95}}>Download Edited</motion.button>
        </div>
    </div>
  );
};

export default ImageEditor;
