
import React, { useState, useCallback } from 'react';
import { generateImage } from '../services/geminiService';
import { PROFESSIONS, ASPECT_RATIOS, IMAGE_STYLES } from '../constants';
import { Profession, AspectRatio, ImageStyle } from '../types';
import Spinner from './Spinner';

// Helper component moved outside MainApp to prevent re-creation on every render
const Section: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => (
  <div className="space-y-3">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{title}</label>
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
    let prompt = `Take the person in the provided image and realistically depict them as a ${selectedProfession.nameEN}. They should be wearing the appropriate uniform or attire for this profession. ${selectedStyle.promptFragment}`;
    
    if (isIdPhoto) {
      prompt += ` The background must be a solid, plain blue, suitable for an official ID card. The person should be facing forward with a neutral expression, cropped from the chest up. The final image should be suitable for a ${idPhotoSize} ID photo.`;
    }
    
    if (advancedPrompt.trim()) {
      prompt += ` Also, incorporate the following details: ${advancedPrompt.trim()}.`;
    }
    
    return prompt;
  }, [selectedProfession, selectedStyle, isIdPhoto, advancedPrompt, idPhotoSize]);

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
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
          ƯỚC MƠ CỦA EM
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          "Trên con đường bước đến thành công không có dấu chân của kẻ lười biếng".
          (Designed by LoveLe)
        </p>
      </header>

      <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls Column */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-6">
          <Section title="1. Tải ảnh của bạn">
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    {uploadedImage ? (
                         <img src={uploadedImage.url} alt="Uploaded preview" className="mx-auto h-32 w-32 object-cover rounded-full" />
                    ) : (
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 dark:focus-within:ring-offset-gray-800 focus-within:ring-indigo-500">
                            <span>{uploadedImage ? "Thay đổi ảnh" : "Tải ảnh lên"}</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
                        </label>
                        <p className="pl-1">hoặc kéo và thả</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, GIF tối đa 10MB</p>
                </div>
            </div>
          </Section>
          
          <Section title="2. Chọn nghề nghiệp">
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700"
              value={selectedProfession.id}
              onChange={(e) => setSelectedProfession(PROFESSIONS.find(p => p.id === e.target.value) || PROFESSIONS[0])}
            >
              {PROFESSIONS.map(p => <option key={p.id} value={p.id}>{p.nameVI}</option>)}
            </select>
          </Section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Section title="3. Tỉ lệ khung hình">
              <div className="flex space-x-2">
                {ASPECT_RATIOS.map(ratio => (
                  <button key={ratio} onClick={() => setSelectedAspectRatio(ratio)} className={`w-full py-2 rounded-md text-sm font-medium ${selectedAspectRatio === ratio ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                    {ratio}
                  </button>
                ))}
              </div>
            </Section>

            <Section title="4. Phong cách ảnh">
              <div className="flex space-x-2">
                {IMAGE_STYLES.map(style => (
                  <button key={style.id} onClick={() => setSelectedStyle(style)} className={`w-full py-2 rounded-md text-sm font-medium ${selectedStyle.id === style.id ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                    {style.nameVI}
                  </button>
                ))}
              </div>
            </Section>
             <Section title="5. Số lượng ảnh">
              <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700"
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
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 transition-colors duration-200"
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
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded"
                    checked={isIdPhoto}
                    onChange={(e) => setIsIdPhoto(e.target.checked)}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="id-photo" className="font-medium text-gray-700 dark:text-gray-300">Tạo ảnh thẻ với nền xanh</label>
                </div>
              </div>
              {isIdPhoto && (
                <div className="pl-8 pt-3 space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Kích thước ảnh thẻ:</label>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => setIdPhotoSize('3x4')}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        idPhotoSize === '3x4'
                          ? 'bg-indigo-600 text-white shadow'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      3x4
                    </button>
                    <button
                      type="button"
                      onClick={() => setIdPhotoSize('4x6')}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        idPhotoSize === '4x6'
                          ? 'bg-indigo-600 text-white shadow'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      4x6
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Section>

          <div className="pt-5">
            <button
              onClick={handleGenerate}
              disabled={isLoading || !uploadedImage}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-indigo-500"
            >
              {isLoading ? <><Spinner /> Đang tạo...</> : '✨ Tạo ảnh'}
            </button>
          </div>
        </div>
        
        {/* Result Column */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center justify-center min-h-[400px] lg:min-h-0">
          {isLoading && (
            <div className="text-center">
              <Spinner size="lg"/>
              <p className="mt-4 text-lg font-medium">AI đang vẽ nên ước mơ của bạn...</p>
              <p className="text-sm text-gray-500">Quá trình này có thể mất một chút thời gian.</p>
            </div>
          )}
          {error && (
            <div className="text-center text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="mt-4 font-semibold">Ối, có lỗi xảy ra!</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}
          {!isLoading && !error && generatedImages && generatedImages.length > 0 && (
            <div className="text-center w-full">
                <h3 className="text-2xl font-bold mb-4">Đây là kết quả của bạn!</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    {generatedImages.map((imgSrc, index) => (
                        <div key={index} className="relative group aspect-square">
                            <img src={imgSrc} alt={`Generated dream job ${index + 1}`} className="w-full h-full object-cover rounded-lg shadow-md" />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center rounded-lg">
                                <a
                                    href={imgSrc}
                                    download={`dream-job-image-${index + 1}.png`}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                    Tải về
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          )}
          {!isLoading && !error && !generatedImages && (
            <div className="text-center text-gray-500 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-20 w-20 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <p className="mt-4 text-lg font-medium">Kết quả của bạn sẽ xuất hiện ở đây</p>
              <p className="text-sm">Hãy điền thông tin và nhấn "Tạo ảnh" để bắt đầu.</p>
            </div>
          )}
        </div>
      </div>
      <footer className="text-center mt-10 py-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          @2025 By Lovele - 0971738589
        </p>
      </footer>
    </div>
  );
};

export default MainApp;
