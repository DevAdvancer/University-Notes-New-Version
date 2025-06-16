
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Eye, Edit, Youtube, Image, Sparkles, FileText, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useImageUpload } from "@/hooks/useImageUpload";

interface Note {
  id?: string;
  title: string;
  subcode: string;
  status: "pending" | "completed" | "not-started";
  content: string;
  youtube_url?: string;
  author_id?: string;
  last_editor_id?: string;
}

interface NoteEditorProps {
  note: Note | null;
  onClose: () => void;
  onSave: () => void;
}

const NoteEditor = ({ note, onClose, onSave }: NoteEditorProps) => {
  const { user } = useAuth();
  const [noteData, setNoteData] = useState({
    title: note?.title || "",
    subcode: note?.subcode || "",
    status: note?.status || "not-started" as const,
    content: note?.content || "# New Note\n\nStart writing your note here...",
    youtube_url: note?.youtube_url || "",
  });
  const [activeTab, setActiveTab] = useState("edit");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // image upload logic and handlers
  const { uploadImage, uploading: imageUploading, error: imageUploadError } = useImageUpload();
  const [dragActive, setDragActive] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Image compression function
  const compressImage = (file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.8): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = document.createElement('img');

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);
            
            const compressedFile = new File([blob], file.name, { 
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            
            console.log(`Image compressed: ${(file.size / 1024).toFixed(2)}KB → ${(compressedFile.size / 1024).toFixed(2)}KB`);
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleUploadImageClick = () => {
    document.getElementById("note-image-upload-input")?.click();
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Compress the image before uploading
    const compressedFile = await compressImage(file);
    const result = await uploadImage(compressedFile);

    if (result && result.url) {
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const before = noteData.content.substring(0, start);
        const after = noteData.content.substring(end);
        const md = `![](${result.url})`;
        setNoteData((prev) => ({
          ...prev,
          content: before + md + after,
        }));
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + md.length, start + md.length);
        }, 0);
      } else {
        setNoteData((prev) => ({
          ...prev,
          content: prev.content + `\n![](${result.url})\n`
        }));
      }
      toast({
        title: "Image uploaded",
        description: "The image was compressed and added to your note.",
      });
    } else if (imageUploadError) {
      toast({
        title: "Image upload failed",
        description: imageUploadError,
        variant: "destructive",
      });
    }
    event.target.value = "";
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    const files = Array.from(event.dataTransfer.files).filter(f =>
      f.type.startsWith("image/")
    );
    if (!files.length) return;

    const textarea = textareaRef.current;
    let insertPos = textarea ? textarea.selectionStart : noteData.content.length;
    let newContent = noteData.content;

    for (let file of files) {
      // Compress each image before uploading
      const compressedFile = await compressImage(file);
      const result = await uploadImage(compressedFile);
      if (result && result.url) {
        const md = `![](${result.url})\n`;
        newContent = [
          newContent.slice(0, insertPos),
          md,
          newContent.slice(insertPos)
        ].join("");
        insertPos += md.length;

        toast({
          title: "Image uploaded",
          description: `Compressed and inserted: ${file.name}`,
        });
      } else if (imageUploadError) {
        toast({
          title: "Image upload failed",
          description: imageUploadError,
          variant: "destructive",
        });
      }
    }

    setNoteData((prev) => ({
      ...prev,
      content: newContent,
    }));

    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(insertPos, insertPos);
      }
    }, 0);
  };

  const handleSave = async () => {
    if (!noteData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a note title.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    
    try {
      if (note?.id) {
        const { error } = await supabase
          .from('notes')
          .update({
            title: noteData.title,
            subcode: noteData.subcode,
            status: noteData.status,
            content: noteData.content,
            youtube_url: noteData.youtube_url || null,
            last_editor_id: user?.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', note.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('notes')
          .insert({
            title: noteData.title,
            subcode: noteData.subcode,
            status: noteData.status,
            content: noteData.content,
            youtube_url: noteData.youtube_url || null,
            author_id: user?.id,
            last_editor_id: user?.id
          });

        if (error) throw error;
      }

      toast({
        title: "Note Saved",
        description: "Your note has been saved successfully.",
      });
      
      onSave();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save note",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25";
      case "pending":
        return "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25";
      case "not-started":
        return "bg-gradient-to-r from-slate-500 to-gray-500 text-white shadow-lg shadow-slate-500/25";
      default:
        return "bg-gradient-to-r from-slate-500 to-gray-500 text-white shadow-lg shadow-slate-500/25";
    }
  };

  const renderMarkdown = (markdown: string) => {
    let html = markdown
      .replace(/```([\s\S]*?)```/gim, (_, code) => {
        const escaped = code
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\n/g, "<br/>");
        return `<pre class="bg-gray-900 border border-gray-700 rounded-xl p-4 overflow-x-auto my-6"><code class="text-green-300 text-sm font-mono">${escaped}</code></pre>`;
      })
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-slate-300 my-4">$1</blockquote>')
      .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-semibold mb-5 text-white">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-medium mb-4 text-gray-200">$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong class="font-bold text-blue-300 bg-blue-900/20 px-1 rounded">$1</strong>')
      .replace(/\*(.*)\*/gim, '<em class="italic text-purple-300">$1</em>')
      .replace(/`(.*?)`/gim, '<code class="bg-gray-900 border border-gray-700 px-3 py-1 rounded-lg text-sm font-mono text-green-300 shadow-sm">$1</code>')
      .replace(/\n\n/gim, '</p><p class="mb-6 text-gray-300 leading-relaxed">')
      .replace(/^(?!<h|<p|<ul|<ol)(.+)$/gim, '<p class="mb-6 text-gray-300 leading-relaxed">$1</p>')
      .replace(/^\- (.*$)/gim, '<li class="ml-6 mb-2 text-gray-300 flex items-start"><span class="text-blue-400 mr-2">•</span>$1</li>');

    html = html.replace(/!\[(.*?)\]\((.*?)\)/gim, (_match, alt, url) => {
      return `<div class="my-8 p-4 bg-gray-900/50 rounded-2xl border border-gray-700/50"><img src="${url}" alt="${alt}" class="w-full rounded-xl shadow-2xl border border-gray-600/30" /></div>`;
    });

    return html;
  };

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Enhanced Header */}
      <header className="relative z-10 bg-gradient-to-r from-slate-900/95 via-indigo-900/95 to-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Button 
                variant="ghost" 
                onClick={onClose} 
                className="flex items-center space-x-3 text-slate-300 hover:text-white hover:bg-slate-800/80 px-6 py-3 rounded-xl transition-all duration-200 group"
              >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Notes</span>
              </Button>
              <div className="border-l border-slate-600 pl-8">
                <div className="flex items-center space-x-4 mb-2">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-white">
                    {note?.id ? "Edit Note" : "Create New Note"}
                  </h1>
                </div>
                <p className="text-slate-400 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  {note?.id ? "Modify your existing note with rich formatting" : "Start writing something amazing with markdown support"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Badge className={`${getStatusColor(noteData.status)} px-6 py-3 text-sm font-bold rounded-full`}>
                {noteData.status.replace("-", " ").toUpperCase()}
              </Badge>
              <Button 
                onClick={handleSave} 
                disabled={saving} 
                className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 text-white px-8 py-3 shadow-xl hover:shadow-blue-500/25 transition-all duration-200 rounded-xl font-semibold"
              >
                <Save className="h-5 w-5" />
                <span>{saving ? "Saving..." : "Save Note"}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-12">
        <Card className="bg-gradient-to-br from-slate-900/90 via-indigo-900/30 to-slate-900/90 backdrop-blur-2xl border border-slate-700/50 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="pb-8 bg-gradient-to-r from-slate-800/50 to-indigo-800/30 border-b border-slate-600/30">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <Label htmlFor="note-title" className="text-slate-300 font-semibold text-lg flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Note Title
                </Label>
                <Input
                  id="note-title"
                  value={noteData.title}
                  onChange={(e) => setNoteData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter an engaging title..."
                  className="bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl h-12 text-lg transition-all duration-200"
                />
              </div>
              <div className="space-y-4">
                <Label htmlFor="subcode" className="text-slate-300 font-semibold text-lg">Subject Code</Label>
                <Input
                  id="subcode"
                  value={noteData.subcode}
                  onChange={(e) => setNoteData(prev => ({ ...prev, subcode: e.target.value }))}
                  placeholder="e.g., CS101, MATH201"
                  className="bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl h-12 text-lg transition-all duration-200"
                />
              </div>
              <div className="space-y-4">
                <Label htmlFor="status" className="text-slate-300 font-semibold text-lg">Progress Status</Label>
                <Select
                  value={noteData.status}
                  onValueChange={(value) => setNoteData(prev => ({ ...prev, status: value as any }))}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-600/50 text-white focus:border-blue-400 focus:ring-blue-400/20 rounded-xl h-12 text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600 backdrop-blur-xl rounded-xl">
                    <SelectItem value="not-started" className="text-white hover:bg-slate-700 rounded-lg">Not Started</SelectItem>
                    <SelectItem value="pending" className="text-white hover:bg-slate-700 rounded-lg">In Progress</SelectItem>
                    <SelectItem value="completed" className="text-white hover:bg-slate-700 rounded-lg">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                <Label htmlFor="youtube-url" className="text-slate-300 font-semibold text-lg flex items-center space-x-2">
                  <Youtube className="h-5 w-5 text-red-500" />
                  <span>YouTube URL</span>
                </Label>
                <Input
                  id="youtube-url"
                  value={noteData.youtube_url}
                  onChange={(e) => setNoteData(prev => ({ ...prev, youtube_url: e.target.value }))}
                  placeholder="https://youtube.com/watch?v=..."
                  className="bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl h-12 text-lg transition-all duration-200"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-2 mb-8">
                <TabsTrigger 
                  value="edit" 
                  className="flex items-center space-x-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/80 data-[state=active]:to-purple-600/80 text-white rounded-xl py-4 text-lg font-semibold transition-all duration-200"
                >
                  <Edit className="h-5 w-5" />
                  <span>Write & Edit</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="preview" 
                  className="flex items-center space-x-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/80 data-[state=active]:to-purple-600/80 text-white rounded-xl py-4 text-lg font-semibold transition-all duration-200"
                >
                  <Eye className="h-5 w-5" />
                  <span>Preview</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="edit" className="mt-8">
                <div
                  className="relative"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {dragActive && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-gradient-to-br from-blue-900/95 to-purple-900/95 backdrop-blur-lg rounded-2xl border-4 border-dashed border-blue-400 pointer-events-none transition-all duration-300">
                      <div className="text-center p-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                          <Image className="h-10 w-10 text-white" />
                        </div>
                        <div className="text-2xl text-white font-bold mb-3">
                          Drop Images Here
                        </div>
                        <div className="text-blue-200 text-lg">
                          Images will be automatically compressed for optimal storage
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <Label className="text-slate-300 font-semibold text-xl">
                        Content (Markdown Support)
                      </Label>
                      <Button
                        type="button"
                        size="lg"
                        variant="outline"
                        className="border-blue-400/50 text-blue-300 hover:bg-blue-400/10 hover:border-blue-400 transition-all duration-200 rounded-xl px-6 py-3"
                        onClick={handleUploadImageClick}
                        disabled={imageUploading}
                      >
                        <Image className="h-5 w-5 mr-3" />
                        {imageUploading ? "Compressing & Uploading..." : "Add Images (Auto-compress)"}
                      </Button>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      id="note-image-upload-input"
                      style={{ display: "none" }}
                      onChange={handleImageChange}
                      multiple
                    />
                    <Textarea
                      ref={textareaRef}
                      value={noteData.content}
                      onChange={(e) => setNoteData(prev => ({ ...prev, content: e.target.value }))}
                      className="min-h-[700px] font-mono text-base bg-slate-800/30 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-400 focus:ring-blue-400/20 rounded-2xl resize-none transition-all duration-200 p-6 leading-relaxed"
                      placeholder="# Start Writing Your Amazing Note Here

## Use Markdown for Rich Formatting
- **Bold text** for emphasis
- *Italic text* for style
- `Inline code` for quick snippets
- ```
Code blocks
``` for longer examples
- > Blockquotes for references
- Links, lists, and more!

Drag and drop images directly into this editor or use the upload button above. Images are automatically compressed to save storage space."
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="preview" className="mt-8">
                <div className="border border-slate-600/50 rounded-2xl p-12 bg-gradient-to-br from-slate-800/30 to-slate-700/30 backdrop-blur-sm min-h-[700px]">
                  <div 
                    className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-slate-300 prose-strong:text-white prose-em:text-slate-200"
                    dangerouslySetInnerHTML={{ 
                      __html: renderMarkdown(noteData.content) 
                    }}
                  />
                  {noteData.youtube_url && extractVideoId(noteData.youtube_url) && (
                    <div className="mt-12 p-8 bg-slate-800/50 rounded-2xl border border-slate-600/30 shadow-2xl">
                      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                          <Youtube className="h-6 w-6 text-white" />
                        </div>
                        Video Content
                      </h3>
                      <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-600/30">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${extractVideoId(noteData.youtube_url)}`}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="rounded-2xl"
                        ></iframe>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NoteEditor;
