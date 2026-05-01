import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Edit, Trash2 } from "lucide-react";
import Swal from 'sweetalert2';

export default function Learning() {
  const { user } = useAuth();
  const { lessons, addLesson, updateLesson, deleteLesson } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any>(null);

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
        <input id="image" class="swal2-input" placeholder="Image URL">
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
        Swal.fire('Success!', 'Lesson added successfully', 'success');
      } catch (error) {
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
        <input id="image" class="swal2-input" placeholder="Image URL" value="${lesson.image || ''}">
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
          durationMin: parseInt((document.getElementById('duration') as HTMLInputElement).value),
          level: (document.getElementById('level') as HTMLSelectElement).value,
        };
      }
    });

    if (formValues) {
      try {
        await updateLesson(lesson.id, formValues);
        Swal.fire('Success!', 'Lesson updated successfully', 'success');
      } catch (error) {
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
        Swal.fire('Deleted!', 'Lesson deleted successfully', 'success');
      } catch (error) {
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
        {lessons.map((l) => (
          <div 
            key={l.id} 
            className="flex flex-col overflow-hidden rounded-lg border border-border/60 bg-card transition-all hover:shadow-md hover:border-border group"
          >
            <div className="overflow-hidden relative">
              <img 
                src={l.image} 
                alt={l.title} 
                className="h-40 w-full object-cover transition-transform group-hover:scale-105" 
              />
              {isAdmin && (
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEditLesson(l)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                  >
                    <Edit className="h-4 w-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteLesson(l.id)}
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
