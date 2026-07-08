
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const SOCKET_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace("/api", "")
  : "http://localhost:5000";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

function VideoCall() {
  const { sessionId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const socketRef = useRef(null);
  const pcRef = useRef(null);           // RTCPeerConnection
  const localStreamRef = useRef(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [status, setStatus] = useState("Waiting for other user to join…");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [peerJoined, setPeerJoined] = useState(false);

  useEffect(() => {
    startCall();
    return () => cleanup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCall = async () => {
    try {
      // 1. Get local media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // 2. Connect socket
      const socket = io(SOCKET_URL);
      socketRef.current = socket;

      socket.on("connect", () => {
        socket.emit("join-room", { sessionId, userId: user._id });
      });

      // 3. When a peer joins → we are the caller → send offer
      socket.on("peer-joined", async () => {
        setPeerJoined(true);
        setStatus("Connected! Starting video…");
        const pc = createPC(socket, stream);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("offer", { sessionId, offer });
      });

      // 4. Receive offer → we are the callee → send answer
      socket.on("offer", async ({ offer }) => {
        setPeerJoined(true);
        setStatus("Connected! Starting video…");
        const pc = createPC(socket, stream);
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("answer", { sessionId, answer });
      });

      // 5. Receive answer
      socket.on("answer", async ({ answer }) => {
        if (pcRef.current) {
          await pcRef.current.setRemoteDescription(
            new RTCSessionDescription(answer)
          );
        }
      });

      // 6. ICE candidates
      socket.on("ice-candidate", async ({ candidate }) => {
        try {
          if (pcRef.current && candidate) {
            await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
          }
        } catch {}
      });

      // 7. Peer left
      socket.on("peer-left", () => {
        setStatus("The other user has left the call.");
        setPeerJoined(false);
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
      });
    } catch (err) {
      setStatus("Camera / microphone access denied. Please allow access.");
      console.error(err);
    }
  };

  const createPC = (socket, stream) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    pcRef.current = pc;

    // Add local tracks
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    // Send ICE candidates to signaling server
    pc.onicecandidate = ({ candidate }) => {
      if (candidate) {
        socket.emit("ice-candidate", { sessionId, candidate });
      }
    };

    // Receive remote stream
    pc.ontrack = ({ streams }) => {
      if (remoteVideoRef.current && streams[0]) {
        remoteVideoRef.current.srcObject = streams[0];
      }
    };

    return pc;
  };

  const toggleMic = () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    stream.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
    setMicOn((p) => !p);
  };

  const toggleCam = () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    stream.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
    setCamOn((p) => !p);
  };

  const endCall = () => {
    socketRef.current?.emit("leave-room", { sessionId });
    cleanup();
    navigate("/schedule");
  };

  const cleanup = () => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    pcRef.current?.close();
    socketRef.current?.disconnect();
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white font-semibold">SkillSwap — Live Session</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Users size={15} />
          <span>{peerJoined ? "2 participants" : "1 participant"}</span>
        </div>
      </div>

      {/* Video area */}
      <div className="flex-1 relative flex items-center justify-center bg-gray-950 p-4">

        {/* Remote video (large) */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full max-w-4xl rounded-2xl bg-gray-900 aspect-video object-cover shadow-2xl"
        />

        {/* Status overlay when no peer */}
        {!peerJoined && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <div className="w-20 h-20 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-4 animate-pulse">
              <Users size={32} className="text-indigo-400" />
            </div>
            <p className="text-lg font-medium">{status}</p>
            <p className="text-slate-500 text-sm mt-2">
              Share this session link or wait for the other user to join.
            </p>
          </div>
        )}

        {/* Local video (small, bottom-right) */}
        <div className="absolute bottom-6 right-6 w-44 rounded-xl overflow-hidden border-2 border-indigo-500/40 shadow-xl bg-gray-900">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full aspect-video object-cover"
          />
          <div className="absolute bottom-1.5 left-2 text-xs text-white/70 font-medium">
            You
          </div>
        </div>

      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-5 py-6 bg-gray-900 border-t border-gray-800">

        {/* Mute */}
        <button
          onClick={toggleMic}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
            micOn
              ? "bg-gray-700 hover:bg-gray-600 text-white"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
          title={micOn ? "Mute microphone" : "Unmute microphone"}
        >
          {micOn ? <Mic size={22} /> : <MicOff size={22} />}
        </button>

        {/* Camera */}
        <button
          onClick={toggleCam}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
            camOn
              ? "bg-gray-700 hover:bg-gray-600 text-white"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
          title={camOn ? "Turn off camera" : "Turn on camera"}
        >
          {camOn ? <Video size={22} /> : <VideoOff size={22} />}
        </button>

        {/* End Call */}
        <button
          onClick={endCall}
          className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white shadow-lg transition-all scale-110 hover:scale-125"
          title="End call"
        >
          <PhoneOff size={24} />
        </button>

      </div>
    </div>
  );
}

export default VideoCall;
