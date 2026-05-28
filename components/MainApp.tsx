
import React, { useState, useCallback } from 'react';
import { Download, Sparkles, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { generateImage } from '../services/geminiService';
import { PROFESSIONS, ASPECT_RATIOS, IMAGE_STYLES } from '../constants';
import { Profession, AspectRatio, ImageStyle } from '../types';
import Spinner from './Spinner';

// Helper component updated to be a glowing container
const Section: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => (
  <div className="p-4 rounded-xl border border-yellow-500/30 bg-black/20 shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all duration-300 hover:border-yellow-500/50 hover:shadow-[0_0_35px_rgba(234,179,8,0.5)]">
    <label className="block text-sm font-semibold text-yellow-400 uppercase tracking-wider mb-3">{title}</label>
    {children}
  </div>
);

const MainApp: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<{ base64: string, mimeType: string, url: string } | null>(null);
  const [selectedProfession, setSelectedProfession] = useState<Profession>(PROFESSIONS[0]);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio>('1:1');
  const [selectedStyle, setSelectedStyle] = useState<ImageStyle>(IMAGE_STYLES[0]);
  const [numberOfImages, setNumberOfImages] = useState<number>(1);
  const [advancedPrompt, setAdvancedPrompt] = useState('');
  const [isIdPhoto, setIsIdPhoto] = useState(false);
  const [idPhotoSize, setIdPhotoSize] = useState<'3x4' | '4x6'>('3x4');
  const [idPhotoClothing, setIdPhotoClothing] = useState<'default' | 'suit' | 'aodai' | 'shirt'>('default');
  const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = (event.target?.result as string).split(',')[1];
        setUploadedImage({
          base64: base64String,
          mimeType: file.type,
          url: URL.createObjectURL(file),
        });
        setGeneratedImages(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const constructPrompt = useCallback(() => {
    let prompt = "";
    if (isIdPhoto) {
      let clothingPrompt = "";
      if (idPhotoClothing === 'suit') {
        clothingPrompt = "The person should be neatly dressed in a formal professional dark suit (comple/vest) with a clean buttoned white collared shirt underneath and a matching tie (if male) or a formal vest collar (if female), looking extremely neat, elegant, and professional for an official passport photo.";
      } else if (idPhotoClothing === 'aodai') {
        clothingPrompt = "The person should be beautifully dressed in an elegant traditional Vietnamese Ao Dai (áo dài Việt Nam) with classic stand-up collar and graceful pattern, looking incredibly formal, neat, and highly respectful for an official portrait photo.";
      } else if (idPhotoClothing === 'shirt') {
        clothingPrompt = "The person should be neatly dressed in a clean, ironed, plain white collared shirt (áo sơ mi trắng), looking very neat, scholarly, and professional for a student or office credential photo.";
      } else {
        clothingPrompt = `The person should be neatly dressed in elegant professional attire or a clean, smart uniform/suit of a ${selectedProfession.nameEN}, styled nicely for a credential portrait, cropped nicely from the chest up.`;
      }

      prompt = `Strictly preserve, maintain, and keep the exact, original facial features, facial structure, eyes, nose, lips, jawline, ears, and unique likeness of the person in the input image. You MUST NOT modify their face, physical structure, or change their identity - they must be perfectly recognizable as the exact same person. 
Do not age, de-age, distort, or change the shape of their eyes, nose, or mouth.
Perform only a gentle professional skincare retouching: make their face skin look smooth, clean, soft, and remove temporary blemishes, spots, or acne while preserving their natural skin pores and realistic texture.
Enhance and adjust the lighting on their face to be beautifully bright, balanced, and soft studio-quality professional lighting with subtle professional skin shine and clean colors, suitable for an official ID card.
The person should face directly forward at the camera with a neat, symmetric neutral expression. 
The background must be changed to a solid, completely plain cobalt blue background.
${clothingPrompt} ${selectedStyle.promptFragment} The final photo should look like a highly professional, beautiful ${idPhotoSize} ID photo.`;
    } else {
      prompt = `Take the person in the provided image and realistically depict them as a ${selectedProfession.nameEN}. They should be wearing the appropriate uniform or attire for this profession. ${selectedStyle.promptFragment}`;
    }
    
    if (advancedPrompt.trim()) {
      prompt += ` Also, incorporate the following details: ${advancedPrompt.trim()}.`;
    }
    
    return prompt;
  }, [selectedProfession, selectedStyle, isIdPhoto, idPhotoClothing, advancedPrompt, idPhotoSize]);

  const handleGenerate = async () => {
    if (!uploadedImage) {
      setError('Vui lòng tải lên một hình ảnh trước.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages(null);

    const prompt = constructPrompt();
    const finalAspectRatio: AspectRatio = isIdPhoto ? '3:4' : selectedAspectRatio;

    try {
      const results = await generateImage({
        base64Image: uploadedImage.base64,
        mimeType: uploadedImage.mimeType,
        prompt: prompt,
        aspectRatio: finalAspectRatio,
        numberOfImages: numberOfImages,
      });
      setGeneratedImages(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
          ƯỚC MƠ CỦA EM
        </h1>
        <p className="mt-3 text-lg text-gray-300 max-w-2xl mx-auto">
          "Trên con đường bước đến thành công không có dấu chân của kẻ lười biếng".
        </p>
      </header>

      <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls Column */}
        <div className="bg-black/30 backdrop-blur-lg p-6 rounded-xl shadow-[0_0_45px_rgba(234,179,8,0.35)] border border-yellow-500/30 space-y-4">
          <Section title="1. Tải ảnh của bạn">
            <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-yellow-500/50 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    {uploadedImage ? (
                         <img src={uploadedImage.url} alt="Uploaded preview" className="mx-auto h-32 w-32 object-cover rounded-full border-2 border-yellow-400/70 p-1" />
                    ) : (
                        <svg className="mx-auto h-12 w-12 text-yellow-600" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                    <div className="flex text-sm text-gray-400 justify-center">
                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-yellow-400 hover:text-yellow-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 focus-within:ring-yellow-500">
                            <span>{uploadedImage ? "Thay đổi ảnh" : "Tải ảnh lên"}</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
                        </label>
                        <p className="pl-1">hoặc kéo và thả</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF tối đa 10MB</p>
                </div>
            </div>
          </Section>
          
          <Section title="2. Chọn nghề nghiệp">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-yellow-500/30 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm rounded-md bg-gray-900/50 text-white"
              value={selectedProfession.id}
              onChange={(e) => setSelectedProfession(PROFESSIONS.find(p => p.id === e.target.value) || PROFESSIONS[0])}
            >
              {PROFESSIONS.map(p => <option key={p.id} value={p.id}>{p.nameVI}</option>)}
            </select>
          </Section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Section title="3. Tỉ lệ">
              <div className="flex flex-wrap gap-2">
                {ASPECT_RATIOS.map(ratio => (
                  <button key={ratio} onClick={() => setSelectedAspectRatio(ratio)} className={`flex-1 min-w-[4rem] py-2 rounded-md text-sm font-bold transition-all duration-200 ${selectedAspectRatio === ratio ? 'bg-yellow-400 text-indigo-950 shadow-lg shadow-yellow-400/50' : 'bg-black/20 border border-yellow-500/20 text-gray-300 hover:bg-yellow-900/30 hover:border-yellow-500/40'}`}>
                    {ratio}
                  </button>
                ))}
              </div>
            </Section>

            <Section title="4. Phong cách">
              <div className="flex space-x-2">
                {IMAGE_STYLES.map(style => (
                  <button key={style.id} onClick={() => setSelectedStyle(style)} className={`w-full py-2 rounded-md text-sm font-bold transition-all duration-200 ${selectedStyle.id === style.id ? 'bg-yellow-400 text-indigo-950 shadow-lg shadow-yellow-400/50' : 'bg-black/20 border border-yellow-500/20 text-gray-300 hover:bg-yellow-900/30 hover:border-yellow-500/40'}`}>
                    {style.nameVI}
                  </button>
                ))}
              </div>
            </Section>
             <Section title="5. Số lượng">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-yellow-500/30 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm rounded-md bg-gray-900/50 text-white"
                value={numberOfImages}
                onChange={(e) => setNumberOfImages(parseInt(e.target.value, 10))}
              >
                <option value={1}>1 ảnh</option>
                <option value={2}>2 ảnh</option>
                <option value={3}>3 ảnh</option>
                <option value={4}>4 ảnh</option>
              </select>
            </Section>
          </div>

          <Section title="6. Mô tả nâng cao (tùy chọn)">
            <textarea
              rows={3}
              className="shadow-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border border-yellow-500/30 rounded-md bg-gray-900/50 text-white transition-colors duration-200"
              placeholder="Ví dụ: đang mỉm cười, đứng trước một tòa nhà hiện đại..."
              value={advancedPrompt}
              onChange={(e) => setAdvancedPrompt(e.target.value)}
            />
          </Section>

          <Section title="7. Tùy chọn khác">
            <div>
              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="id-photo"
                    type="checkbox"
                    className="focus:ring-yellow-600 h-4 w-4 text-yellow-500 border-gray-600 rounded bg-gray-700"
                    checked={isIdPhoto}
                    onChange={(e) => setIsIdPhoto(e.target.checked)}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="id-photo" className="font-medium text-gray-200">Tạo ảnh thẻ với nền xanh</label>
                </div>
              </div>
              {isIdPhoto && (
                <div className="pl-8 pt-3 space-y-3 border-l-2 border-yellow-500/20 ml-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-400 block">Kích thước ảnh thẻ:</label>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => setIdPhotoSize('3x4')}
                        className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all duration-200 ${
                          idPhotoSize === '3x4'
                            ? 'bg-yellow-400 text-indigo-950 shadow-lg shadow-yellow-400/50 animate-pulse-once'
                            : 'bg-black/20 border border-yellow-500/20 text-gray-300 hover:bg-yellow-900/30 hover:border-yellow-500/40'
                        }`}
                      >
                        3x4
                      </button>
                      <button
                        type="button"
                        onClick={() => setIdPhotoSize('4x6')}
                        className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all duration-200 ${
                          idPhotoSize === '4x6'
                            ? 'bg-yellow-400 text-indigo-950 shadow-lg shadow-yellow-400/50 animate-pulse-once'
                            : 'bg-black/20 border border-yellow-500/20 text-gray-300 hover:bg-yellow-900/30 hover:border-yellow-500/40'
                        }`}
                      >
                        4x6
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <label className="text-sm font-medium text-gray-400 block">Trang phục ảnh thẻ:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setIdPhotoClothing('default')}
                        className={`px-3 py-2 rounded-md text-xs font-bold transition-all duration-200 ${
                          idPhotoClothing === 'default'
                            ? 'bg-yellow-400 text-indigo-950 shadow-lg shadow-yellow-400/50'
                            : 'bg-black/20 border border-yellow-500/20 text-gray-300 hover:bg-yellow-900/30 hover:border-yellow-500/40'
                        }`}
                      >
                        Mặc định nghề nghiệp
                      </button>
                      <button
                        type="button"
                        onClick={() => setIdPhotoClothing('suit')}
                        className={`px-3 py-2 rounded-md text-xs font-bold transition-all duration-200 ${
                          idPhotoClothing === 'suit'
                            ? 'bg-yellow-400 text-indigo-950 shadow-lg shadow-yellow-400/50'
                            : 'bg-black/20 border border-yellow-500/20 text-gray-300 hover:bg-yellow-900/30 hover:border-yellow-500/40'
                        }`}
                      >
                        Áo Comple / Vest
                      </button>
                      <button
                        type="button"
                        onClick={() => setIdPhotoClothing('aodai')}
                        className={`px-3 py-2 rounded-md text-xs font-bold transition-all duration-200 ${
                          idPhotoClothing === 'aodai'
                            ? 'bg-yellow-400 text-indigo-950 shadow-lg shadow-yellow-400/50'
                            : 'bg-black/20 border border-yellow-500/20 text-gray-300 hover:bg-yellow-900/30 hover:border-yellow-500/40'
                        }`}
                      >
                        Áo dài Việt Nam
                      </button>
                      <button
                        type="button"
                        onClick={() => setIdPhotoClothing('shirt')}
                        className={`px-3 py-2 rounded-md text-xs font-bold transition-all duration-200 ${
                          idPhotoClothing === 'shirt'
                            ? 'bg-yellow-400 text-indigo-950 shadow-lg shadow-yellow-400/50'
                            : 'bg-black/20 border border-yellow-500/20 text-gray-300 hover:bg-yellow-900/30 hover:border-yellow-500/40'
                        }`}
                      >
                        Áo sơ mi trắng
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Section>

          <div className="pt-5">
            <button
              onClick={handleGenerate}
              disabled={isLoading || !uploadedImage}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-lg shadow-yellow-400/50 text-base font-bold text-indigo-950 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-yellow-400/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-yellow-500"
            >
              {isLoading ? <><Spinner /> Đang tạo...</> : '✨ Tạo ảnh'}
            </button>
          </div>
        </div>
        
        {/* Result Column */}
        <div className="bg-black/30 backdrop-blur-lg p-6 rounded-xl shadow-[0_0_45px_rgba(234,179,8,0.35)] border border-yellow-500/30 flex flex-col items-center justify-center min-h-[400px] lg:min-h-0">
          {isLoading && (
            <div className="text-center">
              <div className="relative inline-block">
                <Spinner size="lg"/>
                <Sparkles className="absolute -top-2 -right-2 text-yellow-400 animate-pulse" size={24} />
              </div>
              <p className="mt-4 text-lg font-medium text-yellow-400">AI đang vẽ nên ước mơ của bạn...</p>
              <p className="text-sm text-gray-400">Quá trình này có thể mất một chút thời gian.</p>
            </div>
          )}
          {error && (
            <div className="text-center text-red-400">
              <AlertCircle className="mx-auto h-12 w-12 mb-4" />
              <p className="font-semibold">Ối, có lỗi xảy ra!</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}
          {!isLoading && !error && generatedImages && generatedImages.length > 0 && (
            <div className="text-center w-full animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-yellow-400">Ước mơ của bạn</h3>
                  {generatedImages.length > 1 && (
                    <button 
                      onClick={() => {
                        generatedImages.forEach((img, i) => {
                          const link = document.createElement('a');
                          link.href = img;
                          link.download = `dream-job-${i + 1}.png`;
                          link.click();
                        });
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-full bg-yellow-400 text-indigo-950 hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-400/30"
                    >
                      <Download size={14} />
                      Tải tất cả
                    </button>
                  )}
                </div>
                
                <div className="flex sm:grid sm:grid-cols-2 gap-6 overflow-x-auto sm:overflow-x-visible pb-4 sm:pb-0 sm:max-h-[65vh] sm:overflow-y-auto p-2 rounded-xl bg-black/40 border border-yellow-500/10 snap-x snap-mandatory">
                    {generatedImages.map((imgSrc, index) => (
                        <div 
                            key={index} 
                            className="relative group min-w-[85%] sm:min-w-0 aspect-square animate-fade-in snap-center"
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            <div className="w-full h-full overflow-hidden rounded-xl border-2 border-yellow-500/20 group-hover:border-yellow-400 transition-all duration-500 shadow-lg group-hover:shadow-2xl group-hover:shadow-yellow-400/30">
                              <img 
                                src={imgSrc} 
                                alt={`Generated dream job ${index + 1}`} 
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                              />
                            </div>
                            
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-end p-4 rounded-xl">
                                <a
                                    href={imgSrc}
                                    download={`dream-job-image-${index + 1}.png`}
                                    className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2 px-6 py-2.5 border border-transparent text-sm font-bold rounded-full shadow-xl text-indigo-950 bg-yellow-400 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                                >
                                    <Download size={18} />
                                    Tải ảnh về
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
                <p className="mt-4 text-xs text-gray-500 italic">Mẹo: Bạn có thể nhấn chuột phải vào ảnh để lưu thủ công.</p>
            </div>
          )}
          {!isLoading && !error && !generatedImages && (
            <div className="text-center text-gray-400">
              <ImageIcon className="mx-auto h-20 w-20 text-gray-700 mb-4" />
              <p className="mt-4 text-lg font-medium">Kết quả của bạn sẽ xuất hiện ở đây</p>
              <p className="text-sm">Hãy điền thông tin và nhấn "Tạo ảnh" để bắt đầu.</p>
            </div>
          )}
        </div>
      </div>
      <footer className="text-center mt-10 py-4">
        <p className="text-sm text-gray-500">
          @2025 By Lovele - 0971738589
        </p>
      </footer>
    </div>
  );
};

export default MainApp;
