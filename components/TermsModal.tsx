
import React from 'react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm animate-fade-in" style={{ animationDuration: '0.2s' }}>
      <div className="relative w-full max-w-2xl p-6 mx-4 bg-gray-900/80 border border-yellow-500/50 rounded-lg shadow-2xl shadow-yellow-500/30">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">Điều khoản sử dụng</h2>
        <div className="prose prose-invert text-gray-300 max-h-[60vh] overflow-y-auto pr-4">
          <p>Chào mừng bạn đến với ứng dụng "ƯỚC MƠ CỦA EM". Vui lòng đọc kỹ các điều khoản sau trước khi sử dụng.</p>
          
          <h3 className="text-yellow-500">1. Chấp nhận điều khoản</h3>
          <p>Bằng việc sử dụng ứng dụng, bạn đồng ý tuân thủ các điều khoản và điều kiện này. Nếu bạn không đồng ý, vui lòng không sử dụng ứng dụng.</p>

          <h3 className="text-yellow-500">2. Nội dung do người dùng cung cấp</h3>
          <p>Bạn chịu hoàn toàn trách nhiệm về hình ảnh bạn tải lên. Bạn cam đoan rằng bạn có quyền sử dụng hình ảnh này và nó không vi phạm pháp luật hay quyền của bất kỳ bên thứ ba nào (ví dụ: bản quyền, quyền riêng tư).</p>
          <p>Nghiêm cấm tải lên nội dung bất hợp pháp, bạo lực, khiêu dâm, hoặc xúc phạm người khác.</p>

          <h3 className="text-yellow-500">3. Nội dung do AI tạo ra</h3>
          <p>Ứng dụng sử dụng trí tuệ nhân tạo (AI) để tạo ra hình ảnh dựa trên ảnh bạn cung cấp. Chất lượng và tính chính xác của hình ảnh do AI tạo ra không được đảm bảo. Hình ảnh có thể không giống hoàn toàn hoặc chứa các chi tiết không mong muốn.</p>
          <p>Bạn có thể sử dụng hình ảnh được tạo ra cho mục đích cá nhân, phi thương mại. Chúng tôi không chịu trách nhiệm về bất kỳ hậu quả nào phát sinh từ việc sử dụng các hình ảnh này.</p>

          <h3 className="text-yellow-500">4. Quyền riêng tư</h3>
          <p>Chúng tôi cam kết bảo vệ quyền riêng tư của bạn. Hình ảnh bạn tải lên sẽ được xử lý để tạo ra kết quả và sẽ không được lưu trữ lâu dài trên máy chủ của chúng tôi hay chia sẻ với bên thứ ba mà không có sự đồng ý của bạn, trừ khi được yêu cầu bởi pháp luật.</p>

          <h3 className="text-yellow-500">5. Giới hạn trách nhiệm</h3>
          <p>Ứng dụng được cung cấp "nguyên trạng". Chúng tôi không chịu trách nhiệm cho bất kỳ thiệt hại trực tiếp, gián tiếp nào phát sinh từ việc sử dụng hoặc không thể sử dụng ứng dụng.</p>

          <h3 className="text-yellow-500">6. Thay đổi điều khoản</h3>
          <p>Chúng tôi có quyền cập nhật các điều khoản này bất cứ lúc nào. Các thay đổi sẽ có hiệu lực ngay khi được đăng tải. Việc bạn tiếp tục sử dụng ứng dụng sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận các điều khoản mới.</p>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-bold text-indigo-950 bg-yellow-400 hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-500"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
