let mediaRecorder;
let recordedChunks = [];

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const status = document.getElementById("status");

startBtn.onclick = async () => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { displaySurface: "browser" },
      audio: true
    });

    recordedChunks = [];

    mediaRecorder = new MediaRecorder(stream, {
      mimeType: "video/webm; codecs=vp9"
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tab-recording-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    };

    mediaRecorder.start();
    status.textContent = "Status: Recording...";
    startBtn.disabled = true;
    stopBtn.disabled = false;
  } catch (err) {
    status.textContent = "Status: Failed to start recording";
    console.error("Error:", err);
  }
};

stopBtn.onclick = () => {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
    status.textContent = "Status: Stopped. Downloading...";
    startBtn.disabled = false;
    stopBtn.disabled = true;
  }
};
