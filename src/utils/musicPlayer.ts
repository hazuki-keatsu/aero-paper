// 音乐播放器数据类型定义
export interface Song {
  id: number;
  title: string;
  artist: string;
  cover: string;
  src: string;
}

// 播放模式枚举
export enum PlayMode {
  Normal = 'normal',    // 正常播放
  Shuffle = 'shuffle',  // 随机播放
  Repeat = 'repeat',    // 列表循环
  RepeatOne = 'repeat-one' // 单曲循环
}

// 音乐播放器类
export class MusicPlayer {
  private playlist: Song[];
  private originalPlaylist: Song[]; // 保存原始播放列表
  private currentTrackIndex: number = 0;
  private isPlaying: boolean = false;
  private isPlaylistVisible: boolean = false;
  private isMuted: boolean = false;
  private previousVolume: number = 50; // 保存静音前的音量
  private playMode: PlayMode = PlayMode.Normal; // 当前播放模式
  
  // DOM元素
  private player!: HTMLDivElement;
  private playerButton!: HTMLDivElement;
  private audio!: HTMLAudioElement;
  private playPauseBtn!: HTMLButtonElement;
  private playIcon!: SVGElement;
  private pauseIcon!: SVGElement;
  private prevBtn!: HTMLButtonElement;
  private nextBtn!: HTMLButtonElement;
  private minimizeBtn!: HTMLButtonElement;
  private progressSlider!: HTMLInputElement;
  private progressFill!: HTMLDivElement;
  private volumeFill!: HTMLDivElement;
  private currentTimeEl!: HTMLSpanElement;
  private durationEl!: HTMLSpanElement;
  private volumeSlider!: HTMLInputElement;
  private coverImage!: HTMLImageElement;
  private songTitle!: HTMLDivElement;
  private songArtist!: HTMLDivElement;
  private playlistBtn!: HTMLButtonElement;
  private volumeBtn!: HTMLButtonElement;
  private volumeOnIcon!: SVGElement;
  private volumeOffIcon!: SVGElement;
  private playlistEl!: HTMLDivElement;
  private playlistItems!: NodeListOf<HTMLDivElement>;
  private volumeTooltip?: HTMLDivElement; // 音量提示框
  private progressTooltip?: HTMLDivElement; // 进度提示框
  private shuffleBtn!: HTMLButtonElement; // 随机播放按钮
  private repeatBtn!: HTMLButtonElement; // 循环播放按钮
  private repeatOffIcon!: SVGElement; // 循环关闭图标
  private repeatOneIcon!: SVGElement; // 单曲循环图标
  private repeatStatus!: HTMLSpanElement; // 循环状态文字

  constructor(playlist: Song[]) {
    this.playlist = [...playlist]; // 创建副本
    this.originalPlaylist = [...playlist]; // 保存原始列表
    this.initElements();
    this.bindEvents();
    this.loadTrack(this.currentTrackIndex);
    this.setVolume(); // 初始化音量显示
    this.updateVolumeIcon(); // 初始化音量图标
    this.createVolumeTooltip(); // 创建音量提示框
    this.createProgressTooltip(); // 创建进度提示框
    this.updateButtonTitle(); // 初始化按钮提示文字
  }

  private initElements(): void {
    this.player = document.getElementById('music-player') as HTMLDivElement;
    this.playerButton = document.getElementById('player-button') as HTMLDivElement;
    this.audio = document.getElementById('audio-player') as HTMLAudioElement;
    this.playPauseBtn = document.getElementById('play-pause-btn') as HTMLButtonElement;
    this.playIcon = document.getElementById('play-icon') as unknown as SVGElement;
    this.pauseIcon = document.getElementById('pause-icon') as unknown as SVGElement;
    this.prevBtn = document.getElementById('prev-btn') as HTMLButtonElement;
    this.nextBtn = document.getElementById('next-btn') as HTMLButtonElement;
    this.minimizeBtn = document.getElementById('minimize-btn') as HTMLButtonElement;
    this.progressSlider = document.getElementById('progress-slider') as HTMLInputElement;
    this.progressFill = document.getElementById('progress-fill') as HTMLDivElement;
    this.volumeFill = document.getElementById('volume-fill') as HTMLDivElement;
    this.currentTimeEl = document.getElementById('current-time') as HTMLSpanElement;
    this.durationEl = document.getElementById('duration') as HTMLSpanElement;
    this.volumeSlider = document.getElementById('volume-slider') as HTMLInputElement;
    this.coverImage = document.getElementById('cover-image') as HTMLImageElement;
    this.songTitle = document.getElementById('song-title') as HTMLDivElement;
    this.songArtist = document.getElementById('song-artist') as HTMLDivElement;
    this.playlistBtn = document.getElementById('playlist-btn') as HTMLButtonElement;
    this.volumeBtn = document.getElementById('volume-btn') as HTMLButtonElement;
    this.volumeOnIcon = document.getElementById('volume-on-icon') as unknown as SVGElement;
    this.volumeOffIcon = document.getElementById('volume-off-icon') as unknown as SVGElement;
    this.playlistEl = document.getElementById('playlist') as HTMLDivElement;
    this.playlistItems = document.querySelectorAll('.playlist-item') as NodeListOf<HTMLDivElement>;
    this.shuffleBtn = document.getElementById('shuffle-btn') as HTMLButtonElement;
    this.repeatBtn = document.getElementById('repeat-btn') as HTMLButtonElement;
    this.repeatOffIcon = document.getElementById('repeat-off-icon') as unknown as SVGElement;
    this.repeatOneIcon = document.getElementById('repeat-one-icon') as unknown as SVGElement;
    this.repeatStatus = document.getElementById('repeat-status') as HTMLSpanElement;
  }

  private bindEvents(): void {
    this.playerButton?.addEventListener('click', () => this.expand());
    this.minimizeBtn?.addEventListener('click', () => this.minimize());
    this.playPauseBtn?.addEventListener('click', () => this.togglePlay());
    this.prevBtn?.addEventListener('click', () => this.previousTrack());
    this.nextBtn?.addEventListener('click', () => this.nextTrack());
    this.progressSlider?.addEventListener('input', () => this.seek());
    this.progressSlider?.addEventListener('mousedown', () => this.showProgressTooltip());
    this.progressSlider?.addEventListener('mouseup', () => this.hideProgressTooltip());
    this.progressSlider?.addEventListener('mouseleave', () => this.hideProgressTooltip());
    this.audio?.addEventListener('timeupdate', () => this.updateProgress());
    this.audio?.addEventListener('loadedmetadata', () => this.updateDuration());
    this.audio?.addEventListener('ended', () => this.onTrackEnded());
    this.volumeSlider?.addEventListener('input', () => this.setVolume());
    this.volumeSlider?.addEventListener('mousedown', () => this.showVolumeTooltip());
    this.volumeSlider?.addEventListener('mouseup', () => this.hideVolumeTooltip());
    this.volumeSlider?.addEventListener('mouseleave', () => this.hideVolumeTooltip());
    this.playlistBtn?.addEventListener('click', () => this.togglePlaylist());
    this.volumeBtn?.addEventListener('click', () => this.toggleMute());
    this.shuffleBtn?.addEventListener('click', () => this.toggleShuffle());
    this.repeatBtn?.addEventListener('click', () => this.toggleRepeat());
    
    this.playlistItems?.forEach((item, index) => {
      item.addEventListener('click', () => this.selectTrack(index));
    });
  }

  private formatTime(seconds: number): string {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  private expand(): void {
    this.player?.classList.remove('minimized');
    this.player?.classList.add('expanded');
  }

  private minimize(): void {
    this.player?.classList.remove('expanded');
    this.player?.classList.add('minimized');
    // 最小化时隐藏播放列表
    this.hidePlaylist();
  }

  private togglePlay(): void {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  private play(): void {
    const track = this.playlist[this.currentTrackIndex];
    if (this.audio && !this.audio.src) {
      this.audio.src = track.src;
    }
    this.audio?.play().then(() => {
      this.isPlaying = true;
      this.playIcon?.classList.add('hidden');
      this.pauseIcon?.classList.remove('hidden');
      this.playPauseBtn?.classList.add('playing');
    }).catch((error: Error) => {
      console.error('播放失败:', error);
    });
  }

  private pause(): void {
    this.audio?.pause();
    this.isPlaying = false;
    this.playIcon?.classList.remove('hidden');
    this.pauseIcon?.classList.add('hidden');
    this.playPauseBtn?.classList.remove('playing');
  }

  private previousTrack(): void {
    const wasPlaying = this.isPlaying; // 记录当前播放状态
    
    if (this.playMode === PlayMode.Shuffle) {
      // 随机播放模式：随机选择一首歌
      this.playRandomTrack();
    } else {
      // 正常模式或循环模式：播放上一首
      this.currentTrackIndex = this.currentTrackIndex > 0 
        ? this.currentTrackIndex - 1 
        : this.playlist.length - 1;
      this.loadTrack(this.currentTrackIndex);
    }
    
    // 如果之前在播放，继续播放新的音轨
    if (wasPlaying) {
      this.play();
    }
  }

  private nextTrack(): void {
    const wasPlaying = this.isPlaying; // 记录当前播放状态
    
    switch (this.playMode) {
      case PlayMode.RepeatOne:
        // 单曲循环：重新播放当前歌曲
        this.loadTrack(this.currentTrackIndex);
        break;
      case PlayMode.Shuffle:
        // 随机播放：随机选择下一首
        this.playRandomTrack();
        break;
      case PlayMode.Repeat:
      case PlayMode.Normal:
      default:
        // 正常播放或列表循环：播放下一首
        this.currentTrackIndex = this.currentTrackIndex < this.playlist.length - 1 
          ? this.currentTrackIndex + 1 
          : 0;
        this.loadTrack(this.currentTrackIndex);
        break;
    }
    
    // 如果之前在播放，继续播放新的音轨
    if (wasPlaying) {
      this.play();
    }
  }

  private loadTrack(index: number): void {
    const track = this.playlist[index];
    if (this.audio) {
      if (this.isPlaying) {
        this.audio.src = track.src;
      } else {
        this.audio.removeAttribute('src');
      }
    }
    if (this.coverImage) this.coverImage.src = track.cover;
    if (this.songTitle) this.songTitle.textContent = track.title;
    if (this.songArtist) this.songArtist.textContent = track.artist;
    
    // 重置播放状态和按钮状态
    this.isPlaying = false;
    this.playIcon?.classList.remove('hidden');
    this.pauseIcon?.classList.add('hidden');
    this.playPauseBtn?.classList.remove('playing');
    
    // 更新播放列表活动状态
    this.updatePlaylistActiveState(index);
    
    // 重置进度
    if (this.progressSlider) this.progressSlider.value = '0';
    if (this.progressFill) this.animateProgressBar('0%');
    if (this.currentTimeEl) this.currentTimeEl.textContent = '0:00';
  }

  private updatePlaylistActiveState(activeIndex: number): void {
    this.playlistItems?.forEach((item, index) => {
      if (index === activeIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  private selectTrack(index: number): void {
    this.currentTrackIndex = index;
    this.loadTrack(index);
    if (this.isPlaying) {
      this.play();
    }
  }

  private seek(): void {
    if (this.progressSlider && this.audio) {
      const seekTime = (parseFloat(this.progressSlider.value) / 100) * this.audio.duration;
      this.audio.currentTime = seekTime;
      // 添加进度条动画
      this.animateProgressBar(this.progressSlider.value + '%');
      // 显示进度提示
      this.showProgressTooltip();
    }
  }

  private updateProgress(): void {
    if (this.audio?.duration) {
      const progress = (this.audio.currentTime / this.audio.duration) * 100;
      if (this.progressSlider) this.progressSlider.value = progress.toString();
      if (this.progressFill) {
        // 使用动画更新进度条，但在自动播放时使用更短的动画时间
        this.animateProgressBar(progress + '%', true);
      }
      if (this.currentTimeEl) this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
    }
  }

  private updateDuration(): void {
    if (this.durationEl && this.audio) {
      this.durationEl.textContent = this.formatTime(this.audio.duration);
    }
  }

  private setVolume(): void {
    if (this.volumeSlider && this.audio && this.volumeFill) {
      const volume = parseFloat(this.volumeSlider.value) / 100;
      this.audio.volume = volume;
      
      // 添加缓动动画到音量条
      this.animateVolumeBar(this.volumeSlider.value + '%');
      
      // 显示实时音量值
      this.showVolumeTooltip();
      
      // 如果不是手动设置为0，则取消静音状态
      if (volume > 0 && this.isMuted) {
        this.isMuted = false;
        this.updateVolumeIcon();
      } else if (volume === 0 && !this.isMuted) {
        // 如果手动调节到0，设置为静音状态
        this.isMuted = true;
        this.updateVolumeIcon();
      }
    }
  }

  private toggleMute(): void {
    if (!this.audio || !this.volumeSlider || !this.volumeFill || !this.volumeBtn) return;
    
    // 添加按钮点击动画
    this.addButtonClickAnimation(this.volumeBtn);
    
    if (this.isMuted) {
      // 取消静音：恢复之前的音量
      this.audio.volume = this.previousVolume / 100;
      this.volumeSlider.value = this.previousVolume.toString();
      this.animateVolumeBar(this.previousVolume + '%');
      this.isMuted = false;
    } else {
      // 静音：保存当前音量并设置为0
      this.previousVolume = parseFloat(this.volumeSlider.value);
      this.audio.volume = 0;
      this.volumeSlider.value = '0';
      this.animateVolumeBar('0%');
      this.isMuted = true;
    }
    
    this.updateVolumeIcon();
  }

  private updateVolumeIcon(): void {
    if (!this.volumeOnIcon || !this.volumeOffIcon) return;
    
    if (this.isMuted || (this.audio && this.audio.volume === 0)) {
      this.volumeOnIcon.classList.add('hidden');
      this.volumeOffIcon.classList.remove('hidden');
      // 添加图标切换动画
      this.addIconSwitchAnimation(this.volumeOffIcon);
    } else {
      this.volumeOnIcon.classList.remove('hidden');
      this.volumeOffIcon.classList.add('hidden');
      // 添加图标切换动画
      this.addIconSwitchAnimation(this.volumeOnIcon);
    }
  }

  // 音量条缓动动画
  private animateVolumeBar(targetWidth: string): void {
    if (!this.volumeFill) return;
    
    // 添加CSS过渡效果
    this.volumeFill.style.transition = 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    this.volumeFill.style.width = targetWidth;
    
    // 添加脉冲效果
    this.volumeFill.style.transform = 'scaleY(1.2)';
    
    setTimeout(() => {
      if (this.volumeFill) {
        this.volumeFill.style.transform = 'scaleY(1)';
      }
    }, 150);
    
    // 清除过渡效果，避免影响后续操作
    setTimeout(() => {
      if (this.volumeFill) {
        this.volumeFill.style.transition = '';
      }
    }, 300);
  }

  // 按钮点击动画
  private addButtonClickAnimation(button: HTMLElement): void {
    // 添加点击波纹效果
    button.style.transform = 'scale(0.95)';
    button.style.transition = 'transform 0.1s ease-out';
    
    setTimeout(() => {
      button.style.transform = 'scale(1.05)';
    }, 50);
    
    setTimeout(() => {
      button.style.transform = 'scale(1)';
    }, 150);
    
    setTimeout(() => {
      button.style.transition = '';
    }, 200);
  }

  // 图标切换动画
  private addIconSwitchAnimation(icon: SVGElement): void {
    // 添加弹性缩放动画
    icon.style.transform = 'scale(0.8)';
    icon.style.transition = 'transform 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    
    setTimeout(() => {
      icon.style.transform = 'scale(1)';
    }, 50);
    
    setTimeout(() => {
      icon.style.transition = '';
    }, 250);
  }

  // 创建音量提示框
  private createVolumeTooltip(): void {
    this.volumeTooltip = document.createElement('div');
    this.volumeTooltip.className = 'volume-tooltip';
    this.volumeTooltip.style.cssText = `
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease-out;
      z-index: 1000;
    `;
    
    // 添加到音量滑块的父容器
    if (this.volumeSlider && this.volumeSlider.parentElement) {
      this.volumeSlider.parentElement.style.position = 'relative';
      this.volumeSlider.parentElement.appendChild(this.volumeTooltip);
    }
  }

  // 显示音量提示框
  private showVolumeTooltip(): void {
    if (this.volumeTooltip && this.volumeSlider) {
      const volume = Math.round(parseFloat(this.volumeSlider.value));
      this.volumeTooltip.textContent = `${volume}%`;
      this.volumeTooltip.style.opacity = '1';
    }
  }

  // 隐藏音量提示框
  private hideVolumeTooltip(): void {
    if (this.volumeTooltip) {
      this.volumeTooltip.style.opacity = '0';
    }
  }

  // 进度条缓动动画
  private animateProgressBar(targetWidth: string, isAutoUpdate: boolean = false): void {
    if (!this.progressFill) return;
    
    // 自动更新时使用更短的动画时间，手动拖拽时使用较长的动画时间
    const duration = isAutoUpdate ? '0.1s' : '0.3s';
    const curve = isAutoUpdate ? 'ease-out' : 'cubic-bezier(0.4, 0, 0.2, 1)';
    
    // 添加CSS过渡效果
    this.progressFill.style.transition = `width ${duration} ${curve}`;
    this.progressFill.style.width = targetWidth;
    
    if (!isAutoUpdate) {
      // 手动拖拽时添加脉冲效果
      this.progressFill.style.transform = 'scaleY(1.5)';
      
      setTimeout(() => {
        if (this.progressFill) {
          this.progressFill.style.transform = 'scaleY(1)';
        }
      }, 150);
    }
    
    // 清除过渡效果，避免影响后续操作
    setTimeout(() => {
      if (this.progressFill && !isAutoUpdate) {
        this.progressFill.style.transition = '';
      }
    }, isAutoUpdate ? 100 : 300);
  }

  // 创建进度提示框
  private createProgressTooltip(): void {
    this.progressTooltip = document.createElement('div');
    this.progressTooltip.className = 'progress-tooltip';
    this.progressTooltip.style.cssText = `
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease-out;
      z-index: 1000;
      margin-bottom: 8px;
    `;
    
    // 添加到进度滑块的父容器
    if (this.progressSlider && this.progressSlider.parentElement) {
      this.progressSlider.parentElement.style.position = 'relative';
      this.progressSlider.parentElement.appendChild(this.progressTooltip);
    }
  }

  // 显示进度提示框
  private showProgressTooltip(): void {
    if (this.progressTooltip && this.progressSlider && this.audio) {
      const progress = parseFloat(this.progressSlider.value);
      const currentTime = (progress / 100) * this.audio.duration;
      this.progressTooltip.textContent = this.formatTime(currentTime);
      this.progressTooltip.style.opacity = '1';
    }
  }

  // 隐藏进度提示框
  private hideProgressTooltip(): void {
    if (this.progressTooltip) {
      this.progressTooltip.style.opacity = '0';
    }
  }

  private togglePlaylist(): void {
    // 添加按钮点击动画
    if (this.playlistBtn) {
      this.addButtonClickAnimation(this.playlistBtn);
    }
    
    this.isPlaylistVisible = !this.isPlaylistVisible;
    if (this.playlistEl) {
      if (this.isPlaylistVisible) {
        // 展开播放列表动画
        this.showPlaylist();
      } else {
        // 收起播放列表动画
        this.hidePlaylist();
      }
    }
  }

  private showPlaylist(): void {
    if (this.playlistEl) {
      // 添加显示类来触发动画
      this.playlistEl.classList.add('show');
      this.isPlaylistVisible = true;
    }
  }

  private hidePlaylist(): void {
    if (this.playlistEl) {
      // 移除显示类来触发收起动画
      this.playlistEl.classList.remove('show');
      this.isPlaylistVisible = false;
    }
  }

  private onTrackEnded(): void {
    // 根据播放模式处理歌曲结束
    switch (this.playMode) {
      case PlayMode.RepeatOne:
        // 单曲循环：重新播放当前歌曲
        if (this.isPlaying) {
          this.play();
        }
        break;
      case PlayMode.Repeat:
      case PlayMode.Shuffle:
        // 列表循环或随机播放：播放下一首
        this.nextTrack();
        if (this.isPlaying) {
          setTimeout(() => this.play(), 100); // 稍微延迟以确保加载完成
        }
        break;
      case PlayMode.Normal:
      default:
        // 正常模式：检查是否是最后一首
        if (this.currentTrackIndex < this.playlist.length - 1) {
          this.nextTrack();
          if (this.isPlaying) {
            setTimeout(() => this.play(), 100);
          }
        } else {
          // 最后一首歌结束，停止播放
          this.pause();
        }
        break;
    }
  }

  // 播放模式相关方法
  private toggleShuffle(): void {
    if (this.shuffleBtn) {
      this.addButtonClickAnimation(this.shuffleBtn);
    }

    if (this.playMode === PlayMode.Shuffle) {
      // 关闭随机播放
      this.playMode = PlayMode.Normal;
      this.shuffleBtn?.classList.remove('active');
      // 恢复原始播放列表顺序
      this.restoreOriginalPlaylist();
    } else {
      // 开启随机播放
      this.playMode = PlayMode.Shuffle;
      this.shuffleBtn?.classList.add('active');
      // 如果当前是循环模式，则关闭循环
      if (this.repeatBtn?.classList.contains('active')) {
        this.playMode = PlayMode.Shuffle; // 随机播放优先
        this.repeatBtn.classList.remove('active');
      }
      // 打乱播放列表
      this.shufflePlaylist();
    }
    
    this.updateButtonTitle();
  }

  private toggleRepeat(): void {
    if (this.repeatBtn) {
      this.addButtonClickAnimation(this.repeatBtn);
    }

    switch (this.playMode) {
      case PlayMode.Normal:
      case PlayMode.Shuffle:
        // 切换到列表循环
        this.playMode = PlayMode.Repeat;
        this.repeatBtn?.classList.add('active');
        this.repeatBtn?.classList.remove('repeat-one'); // 移除单曲循环样式
        this.repeatOffIcon?.classList.remove('hidden');
        this.repeatOneIcon?.classList.add('hidden');
        if (this.repeatStatus) this.repeatStatus.textContent = '列表';
        // 如果当前是随机模式，则关闭随机
        if (this.shuffleBtn?.classList.contains('active')) {
          this.shuffleBtn.classList.remove('active');
          this.restoreOriginalPlaylist();
        }
        break;
      case PlayMode.Repeat:
        // 切换到单曲循环
        this.playMode = PlayMode.RepeatOne;
        this.repeatBtn?.classList.add('repeat-one'); // 添加单曲循环样式
        this.repeatOffIcon?.classList.add('hidden');
        this.repeatOneIcon?.classList.remove('hidden');
        if (this.repeatStatus) this.repeatStatus.textContent = '单曲';
        break;
      case PlayMode.RepeatOne:
        // 关闭循环
        this.playMode = PlayMode.Normal;
        this.repeatBtn?.classList.remove('active');
        this.repeatBtn?.classList.remove('repeat-one'); // 移除单曲循环样式
        this.repeatOffIcon?.classList.remove('hidden');
        this.repeatOneIcon?.classList.add('hidden');
        if (this.repeatStatus) this.repeatStatus.textContent = '循环';
        break;
    }
    
    this.updateButtonTitle();
  }

  private shufflePlaylist(): void {
    // 保存当前播放的歌曲
    const currentSong = this.playlist[this.currentTrackIndex];
    
    // 创建不包含当前歌曲的列表
    const otherSongs = this.playlist.filter((_, index) => index !== this.currentTrackIndex);
    
    // 打乱其他歌曲
    for (let i = otherSongs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [otherSongs[i], otherSongs[j]] = [otherSongs[j], otherSongs[i]];
    }
    
    // 重建播放列表，当前歌曲保持在第一位
    this.playlist = [currentSong, ...otherSongs];
    this.currentTrackIndex = 0;
  }

  private restoreOriginalPlaylist(): void {
    // 保存当前播放的歌曲
    const currentSong = this.playlist[this.currentTrackIndex];
    
    // 恢复原始播放列表
    this.playlist = [...this.originalPlaylist];
    
    // 找到当前歌曲在原始列表中的位置
    this.currentTrackIndex = this.playlist.findIndex(song => song.id === currentSong.id);
    if (this.currentTrackIndex === -1) {
      this.currentTrackIndex = 0;
    }
  }

  private playRandomTrack(): void {
    // 生成随机索引，确保不重复当前歌曲
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * this.playlist.length);
    } while (randomIndex === this.currentTrackIndex && this.playlist.length > 1);
    
    this.currentTrackIndex = randomIndex;
    this.loadTrack(this.currentTrackIndex);
  }

  private updateButtonTitle(): void {
    // 更新按钮提示文字
    if (this.shuffleBtn) {
      this.shuffleBtn.title = this.playMode === PlayMode.Shuffle ? '关闭随机播放' : '随机播放';
    }
    
    if (this.repeatBtn) {
      switch (this.playMode) {
        case PlayMode.Repeat:
          this.repeatBtn.title = '单曲循环';
          break;
        case PlayMode.RepeatOne:
          this.repeatBtn.title = '关闭循环';
          break;
        default:
          this.repeatBtn.title = '列表循环';
          break;
      }
    }
  }

  // 获取当前播放器状态
  public getState() {
    return {
      isExpanded: this.player?.classList.contains('expanded') || false,
      currentTrack: this.currentTrackIndex,
      isPlaying: this.isPlaying,
      currentTime: this.audio?.currentTime || 0,
      volume: this.audio?.volume ? this.audio.volume * 100 : 50,
      playMode: this.playMode,
      isMuted: this.isMuted,
      isPlaylistVisible: this.isPlaylistVisible,
      previousVolume: this.previousVolume
    };
  }

  // 恢复播放器状态
  public restoreState(state: any) {
    if (!state) return;

    // 恢复播放状态
    if (state.currentTrack !== undefined && state.currentTrack !== this.currentTrackIndex) {
      this.currentTrackIndex = state.currentTrack;
      this.loadTrack(this.currentTrackIndex);
    }

    // 恢复音量
    if (state.volume !== undefined) {
      this.audio.volume = state.volume / 100;
      this.volumeSlider.value = state.volume.toString();
      this.setVolume();
    }

    // 恢复播放模式
    if (state.playMode !== undefined) {
      this.playMode = state.playMode;
      this.updateModeButtons();
    }

    // 恢复静音状态
    if (state.isMuted !== undefined) {
      this.isMuted = state.isMuted;
      this.updateVolumeIcon();
    }

    // 恢复其他状态
    if (state.previousVolume !== undefined) {
      this.previousVolume = state.previousVolume;
    }

    // 恢复展开状态
    if (state.isExpanded) {
      this.expand();
    } else {
      this.minimize();
    }

    // 恢复播放列表可见性
    if (state.isPlaylistVisible) {
      this.showPlaylist();
    }

    // 恢复播放位置（如果音频已加载）
    if (state.currentTime && this.audio.readyState >= 2) {
      this.audio.currentTime = state.currentTime;
    }

    // 如果之前在播放，恢复播放状态
    if (state.isPlaying) {
      // 延迟一下确保音频加载完成
      setTimeout(() => {
        this.play();
      }, 100);
    }
  }

  // 清理播放器资源
  public destroy() {
    // 暂停播放
    if (this.audio) {
      this.audio.pause();
    }

    // 移除提示框
    if (this.volumeTooltip && this.volumeTooltip.parentNode) {
      this.volumeTooltip.parentNode.removeChild(this.volumeTooltip);
    }
    if (this.progressTooltip && this.progressTooltip.parentNode) {
      this.progressTooltip.parentNode.removeChild(this.progressTooltip);
    }
  }

  // 更新模式按钮状态的辅助方法
  private updateModeButtons() {
    // 更新随机播放按钮
    if (this.shuffleBtn) {
      if (this.playMode === PlayMode.Shuffle) {
        this.shuffleBtn.classList.add('active');
      } else {
        this.shuffleBtn.classList.remove('active');
      }
    }

    // 更新循环播放按钮
    if (this.repeatBtn && this.repeatOffIcon && this.repeatOneIcon) {
      this.repeatBtn.classList.remove('active', 'repeat-one');
      
      switch (this.playMode) {
        case PlayMode.Repeat:
          this.repeatBtn.classList.add('active');
          this.repeatOffIcon.classList.remove('hidden');
          this.repeatOneIcon.classList.add('hidden');
          break;
        case PlayMode.RepeatOne:
          this.repeatBtn.classList.add('active', 'repeat-one');
          this.repeatOffIcon.classList.add('hidden');
          this.repeatOneIcon.classList.remove('hidden');
          break;
        default:
          this.repeatOffIcon.classList.remove('hidden');
          this.repeatOneIcon.classList.add('hidden');
          break;
      }
    }

    this.updateButtonTitle();
  }
}
