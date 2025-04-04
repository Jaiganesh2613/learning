import { useState } from "react"

const QrCode = () => {
    const [img, setImg] = useState("")
    const [loading, setLoading] = useState(false)
    const [qrData, setQrData] = useState("")
    const [qrSize, setQrSize] = useState("")
    const [error, setError] = useState();

    async function generateQR(){

      setError("");

      if (!qrData.trim()) {
          setError("Please enter data for the QR code.");
          return;
      }

      if (!qrSize.trim() || isNaN(qrSize) || qrSize <= 0) {
          setError("Please enter a valid size for the QR code.");
          return;
      }
        setLoading(true);
        try{
            const url = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(qrData)}`;
            setImg(url);
        }catch(error){
            console.error("Error generating QR code", error)
        }finally{
            setLoading(false);

        }
    }
    function downloadQR() {
      fetch(img)
        .then((response) => response.blob())
        .then((blob) => {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "qrcode.png";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch((error) =>{
          console.error("Error downloading QR code", error)
        })
    }
  return (
    <div className="app-container">
        <h1>QR Code Generator</h1>
        {loading && <p>Please wait...</p>}
        {error && <p className="error-message">{error}</p>}
        {img && <img src={img} className="qr-code-image"/>}
      <div>
        <label htmlFor="dataInput" className="input-label">
            Data for QR code:
        </label>
        <input type="text" id="dataInput" value={qrData} placeholder="Enter data for QR code" onChange={(e) => setQrData(e.target.value)}/>
        <label htmlFor="sizeInput" className="input-label">
            Image size (e.g: 150):
        </label>
        <input type="text" id="sizeInput" value={qrSize} placeholder="Enter image size" onChange={(e) => setQrSize(e.target.value)}/>
        <button className="generate-button" disabled={loading} onClick={generateQR}>Generate QR Code</button>
        <button className="download-button" onClick={downloadQR}>Download QR Code</button>
      </div>
      <p className="footer">Designed By <a href="https://react.dev/">Jaiganesh</a></p>
    </div>
  )
}

export default QrCode
