import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, X, Loader2, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import notesService from '@/services/notesService';

const OrganizationSidebar = ({
  noteTitle,
  setNoteTitle,
  selectedSubject,
  setSelectedSubject
}) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [error, setError] = useState('');

  // Load subjects on component mount
  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setSubjectsLoading(true);
      const response = await notesService.getUserSubjects();
      
      if (response.success && response.data.subjects) {
        setSubjects(response.data.subjects);
      } else {
        setSubjects([]);
      }
    } catch (error) {
      console.error('Error loading subjects:', error);
      setSubjects([]);
    } finally {
      setSubjectsLoading(false);
    }
  };

  const handleAddSubject = async () => {
    if (newSubjectName.trim()) {
      try {
        setLoading(true);
        setError('');
        
        // Create subject via API
        const response = await notesService.createSubject(newSubjectName.trim());
        
        if (response.success) {
          // Add to local state
          const newSubject = {
            name: newSubjectName.trim()
          };
          setSubjects(prevSubjects => [...prevSubjects, newSubject]);
          setSelectedSubject(newSubjectName.trim());
          setNewSubjectName('');
          setIsAddingSubject(false);
          
          // Reload subjects
          await loadSubjects();
        }
      } catch (error) {
        setError(error.message || 'Failed to create subject');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddSubject();
    } else if (e.key === 'Escape') {
      setIsAddingSubject(false);
      setNewSubjectName('');
      setError('');
    }
  };

  return (
    <div className="space-y-6">
      {/* File Organization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Study Organization
          </CardTitle>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Organize by Subject
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Note Title</label>
            <Input 
              placeholder="Auto-suggested from content..."
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
            />
          </div>
          
          {/* Subject Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="subject-select" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <BookOpen className="w-4 h-4 mr-1" />
                Subject
              </label>
              {!isAddingSubject && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsAddingSubject(true)}
                  className="p-1 h-6 w-6"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              )}
            </div>
            
            {isAddingSubject ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter new subject..."
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="text-sm"
                  autoFocus
                />
                <Button 
                  size="sm" 
                  onClick={handleAddSubject}
                  disabled={!newSubjectName.trim() || loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setIsAddingSubject(false);
                    setNewSubjectName('');
                    setError('');
                  }}
                  disabled={loading}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <select 
                id="subject-select"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                disabled={subjectsLoading}
              >
                <option value="">{subjectsLoading ? 'Loading subjects...' : 'Select subject...'}</option>
                {subjects.map((subject) => (
                  <option key={subject.name} value={subject.name}>
                    📖 {subject.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags</label>
            <Input 
              placeholder="Add tags (comma separated)"
              className="text-sm"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationSidebar;
