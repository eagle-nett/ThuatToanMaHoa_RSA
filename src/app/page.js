'use client';

import { useState } from 'react';

// Hàm tính lũy thừa mô-đun (Modular Exponentiation)
function modularExponentiation(base, exponent, modulus) {
  let result = 1n; // Kết quả ban đầu
  let baseBigInt = BigInt(base) % BigInt(modulus); // Đảm bảo base trong phạm vi modulus
  const processLog = [];

  while (exponent > 0) {
    if (exponent % 2 === 1) {
      result = (result * baseBigInt) % BigInt(modulus);
      processLog.push(
        `Multiply: result = (result * base) % modulus = (${result} * ${baseBigInt}) % ${modulus} = ${result}`
      );
    }
    baseBigInt = (baseBigInt * baseBigInt) % BigInt(modulus); // Bình phương cơ số
    exponent = Math.floor(exponent / 2); // Chia exponent cho 2
    processLog.push(
      `Square: base = (base * base) % modulus = (${baseBigInt} * ${baseBigInt}) % ${modulus} = ${baseBigInt}`
    );
  }

  return { result, processLog };
}

// Hàm kiểm tra số nguyên tố
function isPrime(num) {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

// Hàm tính GCD và nghịch đảo mô-đun
function extendedGCD(a, b) {
  let old_r = a, r = b;
  let old_s = 1, s = 0;
  let old_t = 0, t = 1;

  const processLog = [];

  while (r !== 0) {
    const quotient = Math.floor(old_r / r);
    processLog.push(
      `q = ${quotient}, r = ${old_r} - ${quotient} * ${r} = ${old_r - quotient * r}`
    );

    [old_r, r] = [r, old_r - quotient * r];
    [old_s, s] = [s, old_s - quotient * s];
    [old_t, t] = [t, old_t - quotient * t];
  }

  return { gcd: old_r, x: old_s, y: old_t, processLog };
}

export default function Home() {
  const [menuOption, setMenuOption] = useState('mod'); // Lựa chọn menu

  // State cho Modular Exponentiation
  const [base, setBase] = useState('');
  const [exponent, setExponent] = useState('');
  const [modulus, setModulus] = useState('');
  const [modResult, setModResult] = useState(null);
  const [modLog, setModLog] = useState([]);

  // State cho tính d
  const [p, setP] = useState('');
  const [q, setQ] = useState('');
  const [e, setE] = useState('');
  const [rsaResult, setRsaResult] = useState(null);
  const [rsaLog, setRsaLog] = useState([]);

  // Xử lý tính Modular Exponentiation
  const handleModularCalculation = (event) => {
    event.preventDefault();
    const { result, processLog } = modularExponentiation(base, exponent, modulus);
    setModResult(result);
    setModLog(processLog);
  };

  // Xử lý tính d (RSA)
  const handleRsaCalculation = (event) => {
    event.preventDefault();
    try {
      const pValue = parseInt(p);
      const qValue = parseInt(q);
      const eValue = parseInt(e);

      if (isNaN(pValue) || isNaN(qValue) || isNaN(eValue)) {
        throw new Error('Vui lòng nhập số hợp lệ cho p, q và e.');
      }
      
      if (!isPrime(pValue) || !isPrime(qValue)) {
        throw new Error('Vui lòng nhập số nguyên tố hợp lệ cho p và q.');
      }

      const n = pValue * qValue;
      const phi = (pValue - 1) * (qValue - 1);
      const { gcd, x: d, processLog } = extendedGCD(eValue, phi);

      if (gcd !== 1) {
        throw new Error('e không nguyên tố cùng nhau với phi(n). Vui lòng chọn e khác!');
      }

      const privateKey = (d + phi) % phi;
      setRsaResult({ n, phi, privateKey });
      setRsaLog(processLog);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex">
      {/* Menu bên trái */}
      <div className="w-1/4 bg-gray-800 text-white p-5">
        <h1 className="text-2xl font-bold mb-6">Menu RSA</h1>
        <button
          onClick={() => setMenuOption('mod')}
          className={`block w-full py-2 px-4 text-left rounded-lg mb-4 ${
            menuOption === 'mod' ? 'bg-blue-600' : 'bg-gray-700'
          }`}
        >
          TÍNH MOD
        </button>
        <button
          onClick={() => setMenuOption('d')}
          className={`block w-full py-2 px-4 text-left rounded-lg ${
            menuOption === 'd' ? 'bg-blue-600' : 'bg-gray-700'
          }`}
        >
          TÍNH KHÓA D
        </button>
      </div>

      {/* Nội dung bên phải */}
      <div className="w-3/4 bg-white p-8">
        {menuOption === 'mod' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Phép tính lũy thừa mô-đun</h2>
            <form onSubmit={handleModularCalculation} className="space-y-4">
              <div>
                <label className="block text-gray-700">Cơ số (a):</label>
                <input
                  type="number"
                  value={base}
                  onChange={(e) => setBase(Number(e.target.value))}
                  required
                  className="w-full px-4 py-2 mt-1 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700">Số mũ (b):</label>
                <input
                  type="number"
                  value={exponent}
                  onChange={(e) => setExponent(Number(e.target.value))}
                  required
                  className="w-full px-4 py-2 mt-1 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700">Modulo (n):</label>
                <input
                  type="number"
                  value={modulus}
                  onChange={(e) => setModulus(Number(e.target.value))}
                  required
                  className="w-full px-4 py-2 mt-1 border rounded-md"
                />
              </div>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
                Thực hiện
              </button>
            </form>
            {modResult !== null && (
          <div className="mt-5 p-4 bg-green-100 rounded-lg">
                <h3 className="text-xl font-bold">Kết quả:</h3>
                <p>
                  {`${base}^${exponent} mod ${modulus} = ${modResult}`}
                  </p>
              </div>
            )}
            {modLog.length > 0 && (
              <div className="mt-6 bg-gray-100 p-4 rounded-md">
                <h3 className="text-xl font-bold mb-4">Quá trình thực thi:</h3>
                <table className="table-auto w-full border-collapse border border-red-300">
                  <thead>
                    <tr className="bg-gray-200">
                    <th className="border border-red-300 px-2 py-1">Bước nhảy</th>
                    <th className="border border-red-300 px-2 py-1">Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modLog.map((log, index) => (
                      <tr key={index}>
                  <td className="border border-gray-300 px-2 py-1">{index + 1}</td>
                  <td className="border border-gray-300 px-2 py-1">{log}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {menuOption === 'd' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Phép tính nghịch đảo mô-đun để tạo khóa bí mật RSA</h2>
            <form onSubmit={handleRsaCalculation} className="space-y-4">
              <div>
                <label className="block text-gray-700">Prime p:</label>
                <input
                  type="number"
                  value={p}
                  onChange={(e) => setP(e.target.value)}
                  required
                  className="w-full px-4 py-2 mt-1 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700">Prime q:</label>
                <input
                  type="number"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  required
                  className="w-full px-4 py-2 mt-1 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700">Public Key e:</label>
                <input
                  type="number"
                  value={e}
                  onChange={(e) => setE(e.target.value)}
                  required
                  className="w-full px-4 py-2 mt-1 border rounded-md"
                />
              </div>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
                Thực hiện
              </button>
            </form>
            {rsaResult && (
              <div className="mt-6 bg-green-100 p-4 rounded-md">
                <h3 className="text-xl font-bold">Kết quả:</h3>
                <p>n = {rsaResult.n}, phi(n) = {rsaResult.phi}, d = {rsaResult.privateKey}</p>
              </div>
            )}
            {rsaLog.length > 0 && (
              <div className="mt-6 bg-gray-100 p-4 rounded-md">
                <h3 className="text-xl font-bold mb-4">Các bước của thuật toán Euclid mở rộng::</h3>
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                    <th className="border border-red-300 px-2 py-1">Bước nhảy</th>
                    <th className="border border-red-300 px-2 py-1">Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rsaLog.map((log, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                        <td className="border border-gray-300 px-4 py-2">{log}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
