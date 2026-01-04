// pages/select.js
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

export default function SelectCharacter() {
  const router = useRouter();

  const characters = [
    {
      id: "jenkins",
      name: "Jenkins Knight",
      title: "CI/CD Defender",
      video: "/assets/characters/jenkins-knight.mp4",
      music: "/assets/music/jenkins.mp3",
    },
    {
      id: "docker",
      name: "Docker Mage",
      title: "Container Master",
      video: "/assets/characters/docker-mage.mp4",
      music: "/assets/music/docker.mp3",
    },
    {
      id: "kubernetes",
      name: "Kubernetes Ninja",
      title: "Cloud Deployer",
      video: "/assets/characters/kubernetes-ninja.mp4",
      music: "/assets/music/kubernetes.mp3",
    },
    {
      id: "git",
      name: "Git Ranger",
      title: "Version Guardian",
      video: "/assets/characters/git-ranger.mp4",
      music: "/assets/music/git.mp3",
    },
  ];

  const [index, setIndex] = useState(0);
  const audioRef = useRef(null);
  const current = characters[index];

  const playMusic = (url) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = url;
      audioRef.current.load();
      audioRef.current.play().catch(() => {}); // autoplay protection
    }
  };

  useEffect(() => {
    audioRef.current = new Audio(current.music);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;
    audioRef.current.play().catch(() => {});
    return () => {
      audioRef.current.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      playMusic(current.music);
    }
  }, [index]);

  const nextCharacter = () => setIndex((i) => (i + 1) % characters.length);
  const prevCharacter = () =>
    setIndex((i) => (i - 1 + characters.length) % characters.length);

  const selectCharacter = () => {
    audioRef.current.pause();
    router.push(`/world?character=${current.id}`);
  };

  return (
    <div className="relative w-screen h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        key={current.id}
        src={current.video}
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full object-contain"
      />

      {/* Navigation buttons */}
      <button
        onClick={prevCharacter}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400 text-6xl hover:text-green-200 transition-all"
      >
        &lt;
      </button>

      <button
        onClick={nextCharacter}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400 text-6xl hover:text-green-200 transition-all"
      >
        &gt;
      </button>

      {/* Character Info */}
      <div className="absolute bottom-32 text-center text-white">
        <h1 className="text-4xl font-bold text-green-400 mb-2">
          {current.name}
        </h1>
        <p className="text-xl text-gray-300">{current.title}</p>
      </div>

      {/* Select button */}
      <button
        onClick={selectCharacter}
        className="absolute bottom-12 px-8 py-3 bg-green-500 rounded-xl text-lg font-bold hover:bg-green-400 transition-all"
      >
        Select Hero
      </button>
    </div>
  );
}
