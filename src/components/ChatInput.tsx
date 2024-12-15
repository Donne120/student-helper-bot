import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Send, Upload, Camera } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onSendAudio: (blob: Blob) => void;
  onFileUpload: (file: File) => void;
}

export const ChatInput = ({
  onSendMessage,
  onSendAudio,
  onFileUpload,
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.current.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        onSendAudio(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/") || file.type === "application/pdf") {
        onFileUpload(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image or PDF file",
          variant: "destructive",
        });
      }
    }
  };

  const takeScreenshot = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d")?.drawImage(video, 0, 0);

      stream.getTracks().forEach((track) => track.stop());

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "screenshot.png", { type: "image/png" });
          onFileUpload(file);
        }
      }, "image/png");
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not capture screenshot",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-2 items-center p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*,.pdf"
        onChange={handleFileUpload}
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" onClick={takeScreenshot}>
        <Camera className="h-5 w-5" />
      </Button>
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Send a message..."
        className="flex-1"
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={isRecording ? stopRecording : startRecording}
        className={isRecording ? "text-primary animate-pulse" : ""}
      >
        <Mic className="h-5 w-5" />
      </Button>
      <Button variant="default" size="icon" onClick={handleSend}>
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
};