// services/voiceService.js

/**
 * Handles voice recording functionality
 * In a real implementation, this would connect to a speech-to-text API
 */
export class VoiceRecordingService {
    constructor() {
      this.mediaRecorder = null;
      this.audioChunks = [];
      this.stream = null;
      this.isRecording = false;
      this.onStatusChange = null;
      this.onTranscriptReady = null;
      this.timer = null;
      this.recordingTime = 0;
    }
  
    /**
     * Start voice recording
     * @returns {Promise} - Promise resolving when recording starts
     */
    startRecording() {
      return new Promise(async (resolve, reject) => {
        try {
          // Check if browser supports MediaRecorder
          if (!navigator.mediaDevices || !window.MediaRecorder) {
            throw new Error("Your browser doesn't support voice recording. Try using Chrome or Firefox.");
          }
          
          // Request microphone access
          this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          this.mediaRecorder = new MediaRecorder(this.stream);
          this.audioChunks = [];
          
          // Setup event handlers
          this.mediaRecorder.ondataavailable = (event) => {
            this.audioChunks.push(event.data);
          };
          
          this.mediaRecorder.onstop = () => {
            // Create the audio blob when recording stops
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            
            // Stop all tracks in the stream
            this.stream.getTracks().forEach(track => track.stop());
            
            // Update state
            this.isRecording = false;
            if (this.onStatusChange) this.onStatusChange(false);
            
            // Simulate transcription (in reality, this would call a speech-to-text API)
            this.simulateTranscription(audioBlob);
          };
          
          // Start recording
          this.mediaRecorder.start();
          this.isRecording = true;
          
          // Start timer
          this.recordingTime = 0;
          this.timer = setInterval(() => {
            this.recordingTime += 1;
            if (this.onStatusChange) this.onStatusChange(true, this.recordingTime);
          }, 1000);
          
          if (this.onStatusChange) this.onStatusChange(true, 0);
          resolve();
        } catch (error) {
          console.error("Error starting voice recording:", error);
          reject(error);
        }
      });
    }
  
    /**
     * Stop voice recording
     */
    stopRecording() {
      if (this.mediaRecorder && this.isRecording) {
        this.mediaRecorder.stop();
        if (this.timer) {
          clearInterval(this.timer);
          this.timer = null;
        }
      }
    }
  
    /**
     * Simulate speech-to-text transcription
     * In a real implementation, this would call a backend API
     * @param {Blob} audioBlob - The recorded audio
     */
    simulateTranscription(audioBlob) {
      // Create a simulated audio URL for playback
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Simulate processing delay
      setTimeout(() => {
        // Generate simulated transcripts based on recording duration
        const transcriptionOptions = [
          "Is climate change primarily caused by human activities?",
          "What are the facts about vaccine safety and effectiveness?",
          "Are electric vehicles actually better for the environment?",
          "What is the truth about the economic impact of immigration?",
          "Is there evidence that artificial intelligence will lead to job losses?",
          "What are the actual statistics about crime rates in major cities?",
          "Is organic food healthier than conventionally grown food?",
          "What do we know about the effectiveness of face masks during pandemics?",
          "Are social media platforms negatively affecting mental health?",
          "What's the evidence regarding the gender pay gap?"
        ];
        
        // Select a random transcription based on recording length
        const transcriptionIndex = Math.min(
          Math.floor(this.recordingTime / 3) % transcriptionOptions.length,
          transcriptionOptions.length - 1
        );
        
        const transcription = transcriptionOptions[transcriptionIndex];
        
        // Call the callback with results
        if (this.onTranscriptReady) {
          this.onTranscriptReady({
            text: transcription,
            audioUrl: audioUrl,
            confidence: 0.87,
            duration: this.recordingTime
          });
        }
      }, 2000); // Simulate processing time
    }
  }
  
  /**
   * Format recording time in MM:SS format
   * @param {number} seconds - Time in seconds
   * @returns {string} - Formatted time
   */
  export const formatRecordingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };