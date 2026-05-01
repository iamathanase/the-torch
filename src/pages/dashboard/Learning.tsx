import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Edit, Trash2, Play } from "lucide-react";
import Swal from 'sweetalert2';

// Helper function to extract YouTube video ID from URL
const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  
  // Handle different YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};

export default function Learning() {
  const { user } = useAuth();
  const { lessons, addLesson, updateLesson, deleteLesson, refreshLessons } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [viewingLesson, setViewingLesson] = useState<any>(null);

  const isAdmin = user?.role === "admin";

  let pageTitle = "Learning Hub";
  let pageDescription = "Improve your skills with our courses.";

  if (user?.role === "farmer") {
    pageTitle = "Farming Academy";
    pageDescription = "Master farming techniques and agriculture best practices.";
  } else if (user?.role === "vendor") {
    pageTitle = "Business Academy";
    pageDescription = "Grow your equipment business with expert guidance.";
  } else if (user?.role === "gardener") {
    pageTitle = "Gardening Masterclass";
    pageDescription = "Learn advanced gardening techniques and tips.";
  } else if (user?.role === "customer") {
    pageTitle = "Learning Hub";
    pageDescription = "Discover agriculture and farming knowledge.";
  }

  const handleAddLesson = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Add New Lesson',
      html: `
        <input id="title" class="swal2-input" placeholder="Lesson Title">
        <select id="category" class="swal2-input">
          <option value="Agriculture">Agriculture</option>
          <option value="Gardening">Gardening</option>
          <option value="Business">Business</option>
          <option value="Irrigation">Irrigation</option>
          <option value="Other">Other</option>
        </select>
        <textarea id="content" class="swal2-textarea" placeholder="Lesson Content"></textarea>
        <input id="image" class="swal2-input" placeholder="Image URL (optional)">
        <input id="videoUrl" class="swal2-input" placeholder="YouTube Video URL (optional)">
        <input id="duration" type="number" class="swal2-input" placeholder="Duration (minutes)">
        <select id="level" class="swal2-input">
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Add Lesson',
      preConfirm: () => {
        return {
          title: (document.getElementById('title') as HTMLInputElement).value,
          category: (document.getElementById('category') as HTMLSelectElement).value,
          content: (document.getElementById('content') as HTMLTextAreaElement).value,
          image: (document.getElementById('image') as HTMLInputElement).value,
          videoUrl: (document.getElementById('videoUrl') as HTMLInputElement).value,
          durationMin: parseInt((document.getElementById('duration') as HTMLInputElement).value),
          level: (document.getElementById('level') as HTMLSelectElement).value,
        };
      }
    });

    if (formValues) {
      try {
        await addLesson({
          id: String(Date.now()),
          ...formValues,
          createdAt: new Date().toISOString(),
        });
        await refreshLessons(); // Refresh to get the latest lessons from backend
        Swal.fire('Success!', 'Lesson added successfully', 'success');
      } catch (error) {
        console.error('Add lesson error:', error);
        Swal.fire('Error!', 'Failed to add lesson', 'error');
      }
    }
  };

  const handleEditLesson = async (lesson: any) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Lesson',
      html: `
        <input id="title" class="swal2-input" placeholder="Lesson Title" value="${lesson.title}">
        <select id="category" class="swal2-input">
          <option value="Agriculture" ${lesson.category === 'Agriculture' ? 'selected' : ''}>Agriculture</option>
          <option value="Gardening" ${lesson.category === 'Gardening' ? 'selected' : ''}>Gardening</option>
          <option value="Business" ${lesson.category === 'Business' ? 'selected' : ''}>Business</option>
          <option value="Irrigation" ${lesson.category === 'Irrigation' ? 'selected' : ''}>Irrigation</option>
          <option value="Other" ${lesson.category === 'Other' ? 'selected' : ''}>Other</option>
        </select>
        <textarea id="content" class="swal2-textarea" placeholder="Lesson Content">${lesson.content}</textarea>
        <input id="image" class="swal2-input" placeholder="Image URL (optional)" value="${lesson.image || ''}">
        <input id="videoUrl" class="swal2-input" placeholder="YouTube Video URL (optional)" value="${lesson.videoUrl || ''}">
        <input id="duration" type="number" class="swal2-input" placeholder="Duration (minutes)" value="${lesson.durationMin}">
        <select id="level" class="swal2-input">
          <option value="beginner" ${lesson.level === 'beginner' ? 'selected' : ''}>Beginner</option>
          <option value="intermediate" ${lesson.level === 'intermediate' ? 'selected' : ''}>Intermediate</option>
          <option value="advanced" ${lesson.level === 'advanced' ? 'selected' : ''}>Advanced</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Update Lesson',
      preConfirm: () => {
        return {
          title: (document.getElementById('title') as HTMLInputElement).value,
          category: (document.getElementById('category') as HTMLSelectElement).value,
          content: (document.getElementById('content') as HTMLTextAreaElement).value,
          image: (document.getElementById('image') as HTMLInputElement).value,
          videoUrl: (document.getElementById('videoUrl') as HTMLInputElement).value,
          durationMin: parseInt((document.getElementById('duration') as HTMLInputElement).value),
          level: (document.getElementById('level') as HTMLSelectElement).value,
        };
      }
    });

    if (formValues) {
      try {
        await updateLesson(lesson.id, formValues);
        await refreshLessons(); // Refresh to get the latest lessons from backend
        Swal.fire('Success!', 'Lesson updated successfully', 'success');
      } catch (error) {
        console.error('Update lesson error:', error);
        Swal.fire('Error!', 'Failed to update lesson', 'error');
      }
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    const result = await Swal.fire({
      title: 'Delete Lesson?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Delete'
    });

    if (result.isConfirmed) {
      try {
        await deleteLesson(lessonId);
        await refreshLessons(); // Refresh to get the latest lessons from backend
        Swal.fire('Deleted!', 'Lesson deleted successfully', 'success');
      } catch (error) {
        console.error('Delete lesson error:', error);
        Swal.fire('Error!', 'Failed to delete lesson', 'error');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-4xl font-bold">{pageTitle}</h1>
          <p className="mt-2 text-base text-muted-foreground">{pageDescription}</p>
        </div>
        {isAdmin && (
          <Button variant="hero" onClick={handleAddLesson}>
            <Plus className="h-4 w-4 mr-2" />
            Add Lesson
          </Button>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((l) => {
          const videoId = getYouTubeVideoId(l.videoUrl || '');
          const thumbnailUrl = videoId 
            ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
            : l.image;

          return (
            <div 
              key={l.id} 
              className="flex flex-col overflow-hidden rounded-lg border border-border/60 bg-card transition-all hover:shadow-md hover:border-border group cursor-pointer"
              onClick={() => setViewingLesson(l)}
            >
              <div className="overflow-hidden relative">
                <img 
                  src={thumbnailUrl} 
                  alt={l.title} 
                  className="h-40 w-full object-cover transition-transform group-hover:scale-105" 
                />
                {videoId && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                    <div className="bg-red-600 rounded-full p-3">
                      <Play className="h-6 w-6 text-white fill-white" />
                    </div>
                  </div>
                )}
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditLesson(l);
                      }}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                    >
                      <Edit className="h-4 w-4 text-blue-600" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteLesson(l.id);
                      }}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex items-start gap-2">
                  <h3 className="flex-1 font-semibold leading-tight text-foreground line-clamp-2">{l.title}</h3>
                  <span className="shrink-0 rounded-full bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary capitalize">
                    {l.level}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{l.category}</p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span className="font-medium">{l.durationMin} minutes</span>
                  {videoId && (
                    <span className="ml-2 text-red-600 font-medium">• Video</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lesson View Modal */}
      {viewingLesson && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setViewingLesson(null)}>
          <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold">{viewingLesson.title}</h2>
              <button onClick={() => setViewingLesson(null)} className="p-2 hover:bg-muted rounded-md transition">
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Video Player */}
              {getYouTubeVideoId(viewingLesson.videoUrl) && (
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(viewingLesson.videoUrl)}`}
                    title={viewingLesson.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              )}

              {/* Lesson Info */}
              <div className="flex items-center gap-4 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-primary/15 text-primary text-sm font-medium capitalize">
                  {viewingLesson.level}
                </span>
                <span className="px-3 py-1 rounded-full bg-muted text-foreground text-sm font-medium">
                  {viewingLesson.category}
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  {viewingLesson.durationMin} minutes
                </span>
              </div>

              {/* Lesson Content */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Lesson Content</h3>
                <div className="prose prose-sm max-w-none text-foreground">
                  <p className="whitespace-pre-wrap">{viewingLesson.content}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
