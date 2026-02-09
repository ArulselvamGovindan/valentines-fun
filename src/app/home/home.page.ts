import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { CommonModule, NgFor, NgIf, NgStyle } from "@angular/common";
import { IonContent } from "@ionic/angular/standalone";

interface MediaItem {
  src: string;
  alt: string;
  caption: string;
}

interface VideoItem {
  src: string;
  caption: string;
  poster?: string;
}

@Component({
  selector: "app-home",
  standalone: true,
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
  imports: [IonContent, CommonModule, NgFor, NgIf, NgStyle],
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("bgMusic") bgMusic?: ElementRef<HTMLAudioElement>;
  @ViewChild("revealSection") revealSection?: ElementRef<HTMLElement>;
  readonly playDurationMs = 8000;
  canReveal = false;
  revealed = false;
  musicEnabled = false;
  activePhotoIndex = 0;
  photoFlying = false;
  activeNoteIndex = 0;
  showBurst = false;
  buttonLabel = "Catch me if you can 💞";
  helperText = "Try to click the button... 💫";
  buttonStyle: Record<string, string> = { "--x": "0px", "--y": "0px" };
  private nudgeCount = 0;
  private noteAutoplayId?: number;
  private photoAutoplayId?: number;
  private photoAutoplayPaused = false;
  private burstTimeoutId?: number;

  readonly burstItems = Array.from({ length: 14 }, (_, index) => index);

  private readonly photoCaptionPool = [
    "Sunlit smiles and soft skies ✨",
    "Little adventures, big love 💞",
    "Quiet moments that feel like home 🏡",
    "Golden-hour glow with you 🌅",
    "Sweet laughs and softer hearts 💗",
    "Every day feels like a gift 🎁",
    "Our favorite kind of magic ✨",
    "Hold this moment forever 💫",
    "Warm hugs and brighter days 🌸",
    "Stolen glances and happy sighs 😊",
    "Love, captured in a heartbeat 💖",
    "Together looks good on us 🫶",
  ];

  private readonly photoFiles = [
    "assets/placeholders/8d5e800b-217c-4d0a-b8ab-74e744425c19.jpg",
    "assets/placeholders/IMG_0235.JPG",
    "assets/placeholders/IMG_0236.JPG",
    "assets/placeholders/IMG_0240.JPG",
    "assets/placeholders/IMG_0268.JPG",
    "assets/placeholders/IMG_0321.JPG",
    "assets/placeholders/IMG_0326.JPG",
    "assets/placeholders/IMG_0340.JPG",
    "assets/placeholders/IMG_0352.JPG",
    "assets/placeholders/IMG_0406.JPG",
    "assets/placeholders/IMG_0489.JPG",
    "assets/placeholders/IMG_0517.JPG",
    "assets/placeholders/IMG_0518.JPG",
    "assets/placeholders/IMG_0565.JPG",
    "assets/placeholders/IMG_0566.JPG",
    "assets/placeholders/IMG_0567.JPG",
    "assets/placeholders/IMG_0598.JPG",
    "assets/placeholders/IMG_0599.JPG",
    "assets/placeholders/IMG_0600.JPG",
    "assets/placeholders/IMG_0601.JPG",
    "assets/placeholders/IMG_0606.JPG",
    "assets/placeholders/IMG_0626.JPG",
    "assets/placeholders/IMG_0632.JPG",
    "assets/placeholders/IMG_0653.JPG",
    "assets/placeholders/IMG_0683.JPG",
    "assets/placeholders/IMG_0760.JPG",
    "assets/placeholders/IMG_0761.JPG",
    "assets/placeholders/IMG_0777.JPG",
    "assets/placeholders/IMG_0782.JPG",
    "assets/placeholders/IMG_0794.JPG",
    "assets/placeholders/IMG_0802.JPG",
    "assets/placeholders/IMG_0831.JPG",
    "assets/placeholders/IMG_0832.JPG",
    "assets/placeholders/IMG_0884.JPG",
    "assets/placeholders/IMG_0885.JPG",
    "assets/placeholders/IMG_0890.JPG",
    "assets/placeholders/IMG_0903.JPG",
    "assets/placeholders/IMG_0904.JPG",
    "assets/placeholders/IMG_1016.JPG",
    "assets/placeholders/IMG_1041.JPG",
    "assets/placeholders/IMG_1057.JPG",
    "assets/placeholders/IMG_1110.JPG",
    "assets/placeholders/IMG_1126.JPG",
    "assets/placeholders/IMG_1148.JPG",
    "assets/placeholders/IMG_1165.JPG",
    "assets/placeholders/IMG_1168.JPG",
    "assets/placeholders/IMG_1186.JPG",
    "assets/placeholders/IMG_6345.JPG",
    "assets/placeholders/IMG_6407.JPG",
    "assets/placeholders/IMG_6534.JPG",
    "assets/placeholders/IMG_6553.JPG",
    "assets/placeholders/IMG_6576.JPG",
    "assets/placeholders/IMG_6579.JPG",
    "assets/placeholders/IMG_6692.JPG",
    "assets/placeholders/IMG_6749.JPG",
    "assets/placeholders/IMG_0143.JPG",
    "assets/placeholders/IMG_0218.JPG",
    "assets/placeholders/IMG_0222.JPG",
    "assets/placeholders/f1ab9705-49ad-4bd0-91b3-abc3af03c1bc.jpg",
    "assets/placeholders/3d1c1996-bcde-4ea2-9499-c4df2ba45379.jpg",
    "assets/placeholders/7e9894e1-b49d-49a5-a7cc-0200c5298bab.jpg",
  ];

  readonly photos: MediaItem[] = this.photoFiles.map((src, index) => ({
    src,
    alt: `Memory ${index + 1}`,
    caption: this.photoCaptionPool[index % this.photoCaptionPool.length],
  }));

  readonly notes = [
    "You are my best day, every day. 💖",
    "Thank you for being my favorite home. 🏡",
    "Forever starts again every time you smile. ✨",
    "Your love is my calm and my thrill. 💫",
    "Every song reminds me of you. 🎶",
  ];

  readonly videos: VideoItem[] = [
    {
      src: "assets/placeholders/v6.mp4",
      caption: "Laughs we get to keep forever 😊",
      poster: "assets/placeholders/IMG_0626.JPG",
    },
    {
      src: "assets/placeholders/v5.mp4",
      caption: "Every frame feels like home 🏡",
      poster: "assets/placeholders/IMG_0606.JPG",
    },
    {
      src: "assets/placeholders/v4.mp4",
      caption: "You, me, and the best memories 💞",
      poster: "assets/placeholders/IMG_0601.JPG",
    },
    {
      src: "assets/placeholders/v7.mp4",
      caption: "My favorite chapter is us 💖",
      poster: "assets/placeholders/IMG_0632.JPG",
    },
    {
      src: "assets/placeholders/v0.mp4",
      caption: "A cozy reel of our best smiles 💞",
      poster: "assets/placeholders/IMG_0598.JPG",
    },
    {
      src: "assets/placeholders/v1.mp4",
      caption: "Moments that feel like home 🏡",
      poster: "assets/placeholders/IMG_0598.JPG",
    },
    {
      src: "assets/placeholders/v2.mp4",
      caption: "Little clips, huge smiles 💗",
      poster: "assets/placeholders/IMG_0599.JPG",
    },
    {
      src: "assets/placeholders/v3.mp4",
      caption: "A love story in motion ✨",
      poster: "assets/placeholders/IMG_0600.JPG",
    },
    {
      src: "assets/placeholders/v8.mp4",
      caption: "Tiny adventures, forever vibes ✈️",
      poster: "assets/placeholders/IMG_0632.JPG",
    },
    {
      src: "assets/placeholders/IMG_1043.MOV",
      caption: "A soft moment I never forget 🌙",
      poster: "assets/placeholders/IMG_0632.JPG",
    },
  ];

  constructor() {}

  ngOnInit(): void {
    this.tryStartMusic();

    window.setTimeout(() => {
      this.canReveal = true;
      this.buttonLabel = "OK 💘";
      this.helperText = "Gotcha. The surprises are ready 💝.";
    }, this.playDurationMs);
  }

  ngAfterViewInit(): void {
    this.tryStartMusic(true);
  }

  ngOnDestroy(): void {
    this.stopNoteAutoplay();
    this.stopPhotoAutoplay();
    if (this.burstTimeoutId) {
      window.clearTimeout(this.burstTimeoutId);
      this.burstTimeoutId = undefined;
    }
  }

  get activePhoto(): MediaItem | null {
    return this.photos[this.activePhotoIndex] ?? null;
  }

  get activeNote(): string {
    return this.notes[this.activeNoteIndex] ?? "";
  }

  enableMusic(): void {
    this.tryStartMusic(true);
  }

  nudgeButton(): void {
    this.tryStartMusic();
    if (this.canReveal) {
      return;
    }

    this.nudgeCount += 1;
    const offset = this.randomOffset();
    this.buttonStyle = { "--x": `${offset.x}px`, "--y": `${offset.y}px` };
    this.helperText = this.getHelperText();
  }

  handleReveal(): void {
    this.tryStartMusic(true);
    if (!this.canReveal) {
      this.nudgeButton();
      return;
    }

    this.showBurst = true;
    if (this.burstTimeoutId) {
      window.clearTimeout(this.burstTimeoutId);
    }
    this.burstTimeoutId = window.setTimeout(() => {
      this.showBurst = false;
      this.burstTimeoutId = undefined;
    }, 3000);
    this.revealed = true;
    this.helperText = "Happy Valentine's Day, my love 💖.";
    window.setTimeout(() => {
      this.revealSection?.nativeElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      this.startNoteAutoplay();
      this.startPhotoAutoplay();
    }, 1600);
  }

  setPhoto(index: number): void {
    if (index === this.activePhotoIndex) {
      return;
    }
    this.triggerPhotoFlight(() => {
      this.activePhotoIndex = index;
      this.restartPhotoAutoplay();
    });
  }

  nextPhoto(): void {
    this.triggerPhotoFlight(() => {
      this.activePhotoIndex = (this.activePhotoIndex + 1) % this.photos.length;
    });
  }

  private startPhotoAutoplay(): void {
    if (
      this.photoAutoplayId ||
      this.photos.length < 2 ||
      this.photoAutoplayPaused
    ) {
      return;
    }
    this.photoAutoplayId = window.setInterval(() => {
      this.nextPhoto();
    }, 5600);
  }

  private stopPhotoAutoplay(): void {
    if (!this.photoAutoplayId) {
      return;
    }
    window.clearInterval(this.photoAutoplayId);
    this.photoAutoplayId = undefined;
  }

  private restartPhotoAutoplay(): void {
    this.stopPhotoAutoplay();
    this.startPhotoAutoplay();
  }

  pausePhotoAutoplay(): void {
    this.photoAutoplayPaused = true;
    this.stopPhotoAutoplay();
  }

  resumePhotoAutoplay(): void {
    if (!this.photoAutoplayPaused) {
      return;
    }
    this.photoAutoplayPaused = false;
    this.startPhotoAutoplay();
  }

  pauseVideo(video: HTMLVideoElement): void {
    video.pause();
  }

  resumeVideo(video: HTMLVideoElement): void {
    const result = video.play();
    if (result && typeof result.then === "function") {
      result.catch(() => undefined);
    }
  }

  setNote(index: number): void {
    this.activeNoteIndex = index;
    this.restartNoteAutoplay();
  }

  private randomOffset(): { x: number; y: number } {
    const maxX = 120;
    const maxY = 45;
    return {
      x: Math.round((Math.random() * 2 - 1) * maxX),
      y: Math.round((Math.random() * 2 - 1) * maxY),
    };
  }

  private getHelperText(): string {
    const messages = [
      "Too slow, try again! 💘",
      "Hehe, almost! 😘",
      "Keep trying, my love 💞.",
      "Your smile powers this button 😊.",
      "Not yet... almost time! ⏳",
    ];
    return messages[this.nudgeCount % messages.length];
  }

  private triggerPhotoFlight(update: () => void): void {
    if (this.photoFlying || !this.photos.length) {
      return;
    }
    this.photoFlying = true;
    window.setTimeout(() => {
      update();
      this.photoFlying = false;
    }, 320);
  }

  private startNoteAutoplay(): void {
    if (this.noteAutoplayId) {
      return;
    }
    this.noteAutoplayId = window.setInterval(() => {
      if (!this.notes.length) {
        return;
      }
      this.activeNoteIndex = (this.activeNoteIndex + 1) % this.notes.length;
    }, 2600);
  }

  private stopNoteAutoplay(): void {
    if (!this.noteAutoplayId) {
      return;
    }
    window.clearInterval(this.noteAutoplayId);
    this.noteAutoplayId = undefined;
  }

  private restartNoteAutoplay(): void {
    this.stopNoteAutoplay();
    this.startNoteAutoplay();
  }

  private tryStartMusic(unmute = false): void {
    const audio = this.bgMusic?.nativeElement;
    if (!audio) {
      return;
    }

    if (unmute) {
      audio.muted = false;
    }

    const result = audio.play();
    if (result && typeof result.then === "function") {
      result
        .then(() => {
          this.musicEnabled = true;
        })
        .catch(() => undefined);
    } else if (!audio.paused) {
      this.musicEnabled = true;
    }
  }
}
