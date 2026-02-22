import React, { useState } from 'react';

interface EventDetails {
  name: string;
  price: number;
}

const PromptPayCheckout: React.FC = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const eventData: EventDetails = {
    name: 'Concert: The React Developer 2026',
    price: 1500,
  };

  const generateQR = async () => {
    setLoading(true);
    setError('');
    
    try {
      // เรียก API ของ Laravel ที่เราเพิ่งสร้าง
      const response = await fetch('http://localhost:8000/api/generate-promptpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: eventData.price }),
      });

      const data = await response.json();

      if (data.success) {
        setQrCodeUrl(data.qr_code); // นำ URL รูป QR Code มาเก็บไว้ใน State
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', textAlign: 'center', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>{eventData.name}</h2>
      <p>ยอดชำระ: ฿{eventData.price.toLocaleString()}</p>

      {!qrCodeUrl ? (
        <button 
          onClick={generateQR} 
          disabled={loading}
          style={{ padding: '10px 20px', backgroundColor: '#1b43db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {loading ? 'กำลังสร้าง QR Code...' : 'สแกนจ่ายด้วย PromptPay'}
        </button>
      ) : (
        <div>
          <h3>สแกน QR Code เพื่อชำระเงิน</h3>
          {/* แสดงรูป QR Code ที่ได้จาก Omise */}
          <img src={qrCodeUrl} alt="PromptPay QR Code" style={{ width: '100%', maxWidth: '250px' }} />
          <p style={{ color: '#666', fontSize: '14px' }}>QR Code มีอายุการใช้งานจำกัด กรุณาชำระเงินทันที</p>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default PromptPayCheckout;