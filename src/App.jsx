import jsQR from "jsqr";
import { useEffect, useRef, useState } from "react";
import { toast, Bounce } from "react-toastify";
import { MdOutlineMenu } from "react-icons/md";

import "react-toastify/dist/ReactToastify.css";

function App() {
  const [userLocation, setUserLocation] = useState({});
  const [videoStream, setVideoStream] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(null);
  const [qrData, setQrData] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment", // 후면 카메라
          },
        });
        setVideoStream(stream);
        setPermissionGranted(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.log("카메라 권한 요청 실패:", error);
        setPermissionGranted(false);
      }
    };

    if (permissionGranted === null) {
      requestCameraPermission();
    }

    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [permissionGranted, videoStream]);

  useEffect(() => {
    if (qrData) {
      // db에서 보내는 작업
      alert(`qrdata : ${qrData}`);
    }
  }, [qrData]);

  useEffect(() => {
    if (videoStream) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const canvasContext = canvas.getContext("2d");

      const scan = () => {
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = videoWidth;
          canvas.height = videoHeight;
          canvasContext.clearRect(0, 0, canvas.width, canvas.height);
          canvasContext.drawImage(video, 0, 0, videoWidth, videoHeight);
          const imageData = canvasContext.getImageData(
            0,
            0,
            videoWidth,
            videoHeight
          );

          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            setQrData(code.data);
          }
        }
        requestAnimationFrame(scan);
      };
      requestAnimationFrame(scan);
    }
  }, [permissionGranted, videoStream]);

  // 위도, 경도 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      console.error("브라우저가 Geolocation API를 지원하지 않습니다.");
    }
  }, []);

  console.log(userLocation);

  return (
    <>
      <div className="max-w-sm w-full mx-auto">
        <div className="w-full flex justify-between">
          <div>
            <MdOutlineMenu size={28} />
          </div>

          <div className="flex gap-4">
            <p>login</p>
            <p>signin</p>
          </div>
        </div>
        <h1 className="text-gray-800 text-center font-bold py-4 border-b border-gray-400">
          QR Scanner
        </h1>

        <div className="w-full h-[500px] bg-gray-300 relative">
          <video
            className="absolute top-0 left-0 w-full h-full"
            id="videoElement"
            ref={videoRef}
            autoPlay={true}
            playsInline={true}
          ></video>
          <canvas
            className="absolute top-0 left-0 w-full h-full"
            id="canvasElement"
            ref={canvasRef}
          ></canvas>
        </div>
      </div>
    </>
  );
}

export default App;
