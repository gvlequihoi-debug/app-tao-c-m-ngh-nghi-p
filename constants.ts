
import { Profession, AspectRatio, ImageStyle } from './types';

export const PROFESSIONS: Profession[] = [
  { id: 'teacher', nameVI: 'Giáo viên', nameEN: 'Teacher' },
  { id: 'doctor', nameVI: 'Bác sĩ', nameEN: 'Doctor' },
  { id: 'traffic_police', nameVI: 'Công an giao thông', nameEN: 'Traffic Police Officer' },
  { id: 'police', nameVI: 'Công an', nameEN: 'Police Officer' },
  { id: 'nurse', nameVI: 'Y tá', nameEN: 'Nurse' },
  { id: 'border_guard', nameVI: 'Bộ đội biên phòng', nameEN: 'Border Guard' },
  { id: 'navy_soldier', nameVI: 'Bộ đội hải quân', nameEN: 'Navy Soldier' },
  { id: 'soldier', nameVI: 'Bộ đội', nameEN: 'Soldier' },
  { id: 'director', nameVI: 'Giám đốc', nameEN: 'Director/CEO' },
  { id: 'firefighter', nameVI: 'Lính cứu hỏa', nameEN: 'Firefighter' },
  { id: 'pilot', nameVI: 'Phi công', nameEN: 'Pilot' },
  { id: 'engineer', nameVI: 'Kỹ sư', nameEN: 'Engineer' },
  { id: 'astronaut', nameVI: 'Phi hành gia', nameEN: 'Astronaut' },
];

export const ASPECT_RATIOS: AspectRatio[] = ['1:1', '16:9', '3:4', '4:3', '9:16'];

export const IMAGE_STYLES: ImageStyle[] = [
  { id: 'realistic', nameVI: 'Chân thực', promptFragment: 'The final image should be photorealistic, matching the style of the original photo.' },
  { id: 'cartoon', nameVI: 'Hoạt hình', promptFragment: 'Transform the image into a high-quality, friendly cartoon/anime style.' },
];