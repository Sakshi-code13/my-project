// phaser-scenes/PipelineScene.js
import Phaser from "phaser";

export default class PipelineScene extends Phaser.Scene {
  constructor() {
    super("PipelineScene");
  }

  preload() {
    // Get selected character passed from React
    const selected = window.selectedCharacter || "jenkins";

    // Define all asset paths
    const videoMap = {
      jenkins: "/assets/characters/jenkins-knight.mp4",
      docker: "/assets/characters/docker-mage.mp4",
      kubernetes: "/assets/characters/kubernetes-ninja.mp4",
      git: "/assets/characters/git-ranger.mp4",
    };

    const bgMap = {
      jenkins: "/assets/backgrounds/jenkins-bg.jpg",
      docker: "/assets/backgrounds/docker-bg.jpg",
      kubernetes: "/assets/backgrounds/kubernetes-bg.jpg",
      git: "/assets/backgrounds/git-bg.jpg",
    };

    const musicMap = {
      jenkins: "/assets/music/jenkins.mp3",
      docker: "/assets/music/docker.mp3",
      kubernetes: "/assets/music/kubernetes.mp3",
      git: "/assets/music/git.mp3",
    };

    // Store selected hero and paths
    this.selected = selected;
    this.videoPath = videoMap[selected];
    this.bgPath = bgMap[selected];
    this.musicPath = musicMap[selected];

    // Load assets
    this.load.image("background", this.bgPath);
    this.load.video("characterVideo", this.videoPath, "loadeddata", false, true);
    this.load.audio("bgMusic", this.musicPath);
  }

  create() {
    // Set base background color
    this.cameras.main.setBackgroundColor("#101010");

    // Debugging info
    const bgLoaded = this.textures.exists("background");
    console.log("Loaded background:", bgLoaded, this.bgPath);

    // Add the background (or fallback)
    if (bgLoaded) {
      const bg = this.add.image(400, 225, "background");
      bg.setDisplaySize(800, 450);
    } else {
      this.add
        .text(400, 225, "⚠️ Background not found", {
          color: "#ff4444",
          fontSize: "20px",
        })
        .setOrigin(0.5);
    }

    // Add the hero video
    this.video = this.add.video(400, 250, "characterVideo");
    this.video.setScale(0.6);
    this.video.setVisible(true);
    this.video.play(true);

    // Play music (requires user click due to browser autoplay policy)
    this.music = this.sound.add("bgMusic", { loop: true, volume: 0.4 });
    this.add
      .text(400, 420, "🎵 Tap anywhere to start music", {
        color: "#00ff99",
        fontSize: "14px",
      })
      .setOrigin(0.5);

    this.input.once("pointerdown", () => {
      this.music.play();
    });

    // Add hero title
    const titles = {
      jenkins: "Jenkins Knight - CI/CD Defender",
      docker: "Docker Mage - Container Master",
      kubernetes: "Kubernetes Ninja - Cloud Deployer",
      git: "Git Ranger - Version Guardian",
    };

    const colors = {
      jenkins: "#C77DFF",
      docker: "#00B4D8",
      kubernetes: "#38BDF8",
      git: "#10B981",
    };

    this.add
      .text(400, 50, titles[this.selected], {
        fontSize: "26px",
        color: colors[this.selected],
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Fade-in transition
    this.cameras.main.fadeIn(1000, 0, 0, 0);

    // Enable arrow key input
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    // Move video left or right
    if (this.video && this.cursors.left.isDown) this.video.x -= 5;
    else if (this.video && this.cursors.right.isDown) this.video.x += 5;
  }
}
