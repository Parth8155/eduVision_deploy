import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FolderOpen, Plus, X, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import notesService from '@/services/notesService';

const OrganizationSidebar = ({
  noteTitle,
  setNoteTitle,
  selectedSubject,
  setSelectedSubject,
  selectedFolder,
  setSelectedFolder
}) => {
  const [subjects, setSubjects] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [foldersLoading, setFoldersLoading] = useState(true);
  
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [error, setError] = useState('');

  // Default subjects with emojis
  const defaultSubjects = [
    { value: "mathematics", label: "📐 Mathematics" },
    { value: "physics", label: "⚛️ Physics" },
    { value: "chemistry", label: "🧪 Chemistry" },
    { value: "biology", label: "🧬 Biology" },
    { value: "history", label: "📚 History" },
    { value: "literature", label: "📖 Literature" }
  ];

  // Load subjects from backend
  useEffect(() => {
    loadSubjects();
  }, []);

  // Load folders when a subject is selected
  useEffect(() => {
    console.log('useEffect triggered - selectedSubject:', selectedSubject, 'subjectsLoading:', subjectsLoading);
    if (selectedSubject && !subjectsLoading) {
      console.log('Calling loadFolders for subject:', selectedSubject);
      loadFolders();
    } else {
      console.log('Not calling loadFolders - selectedSubject:', selectedSubject, 'subjectsLoading:', subjectsLoading);
    }
  }, [selectedSubject, subjectsLoading]);

  const loadSubjects = async () => {
    try {
      console.log('Loading subjects...');
      setSubjectsLoading(true);
      const response = await notesService.getUserSubjects();
      console.log('Subjects response:', response);
      
      if (response.success && response.data.subjects) {
        // Convert backend subjects to frontend format
        const backendSubjects = response.data.subjects.map(subject => ({
          value: subject._id.toLowerCase().replace(/\s+/g, '-'),
          label: `📚 ${subject._id}`,
          count: subject.count
        }));

        console.log('Backend subjects:', backendSubjects);

        // Merge with default subjects, avoiding duplicates
        const allSubjects = [...defaultSubjects];
        backendSubjects.forEach(backendSubject => {
          if (!allSubjects.some(defaultSubj => defaultSubj.value === backendSubject.value)) {
            allSubjects.push(backendSubject);
          }
        });

        setSubjects(allSubjects);
      } else {
        setSubjects(defaultSubjects);
      }
    } catch (error) {
      setSubjects(defaultSubjects);
    } finally {
      setSubjectsLoading(false);
    }
  };

  const loadFolders = async () => {
    try {
      setFoldersLoading(true);
      const response = await notesService.getUserFolders();
      
      if (response.success && response.data.folders) {
        console.log('Selected subject:', selectedSubject);
        console.log('Available folders from backend:', response.data.folders);
        
        // Filter folders by selected subject
        const subjectFolders = response.data.folders
          .filter(folder => {
            const folderSubject = folder._id.subject.toLowerCase().replace(/\s+/g, '-');
            const selectedSubjectLower = selectedSubject.toLowerCase();
            
            console.log(`Comparing folder subject "${folderSubject}" with selected "${selectedSubjectLower}"`);
            
            return folderSubject === selectedSubjectLower || 
                   folder._id.subject.toLowerCase() === selectedSubjectLower;
          })
          .map(folder => ({
            value: folder._id.folder.toLowerCase().replace(/\s+/g, '-'),
            label: `📁 ${folder._id.folder}`,
            count: folder.count
          }));

        console.log('Filtered subject folders:', subjectFolders);

        // Add default folders
        const defaultFolders = [
          { value: "general", label: "📁 General" },
          { value: "assignments", label: "📁 Assignments" }
        ];

        const allFolders = [...defaultFolders];
        subjectFolders.forEach(subjectFolder => {
          if (!allFolders.some(defaultFolder => defaultFolder.value === subjectFolder.value)) {
            allFolders.push(subjectFolder);
          }
        });

        console.log('Final folders list:', allFolders);
        setFolders(allFolders);
      } else {
        console.log('No folders data from backend, using defaults');
        setFolders([
          { value: "general", label: "📁 General" },
          { value: "assignments", label: "📁 Assignments" }
        ]);
      }
    } catch (error) {
      console.error('Failed to load folders:', error);
      setFolders([
        { value: "general", label: "📁 General" },
        { value: "assignments", label: "📁 Assignments" }
      ]);
    } finally {
      setFoldersLoading(false);
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
          const subjectValue = newSubjectName.toLowerCase().replace(/\s+/g, '-');
          const newSubject = {
            value: subjectValue,
            label: `📚 ${newSubjectName.trim()}`
          };
          setSubjects(prevSubjects => [...prevSubjects, newSubject]);
          setSelectedSubject(subjectValue);
          setNewSubjectName('');
          setIsAddingSubject(false);
          
          // Reload subjects to get updated data from backend
          await loadSubjects();
        }
      } catch (error) {
        console.error('Failed to create subject:', error);
        setError(error.message || 'Failed to create subject');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddFolder = async () => {
    if (newFolderName.trim() && selectedSubject) {
      try {
        setLoading(true);
        setError('');
        
        // Get the actual subject name from the subjects list
        const subjectObj = subjects.find(s => s.value === selectedSubject);
        const subjectName = subjectObj ? subjectObj.label.replace(/📚 |📐 |⚛️ |🧪 |🧬 |📚 |📖 /, '').trim() : selectedSubject;
        
        console.log('Creating folder:', newFolderName.trim(), 'for subject:', subjectName);
        
        // Create folder via API
        const response = await notesService.createFolder(newFolderName.trim(), subjectName);
        
        if (response.success) {
          console.log('Folder created successfully:', response.data);
          
          // Add to local state
          const folderValue = newFolderName.toLowerCase().replace(/\s+/g, '-');
          const newFolder = {
            value: folderValue,
            label: `📁 ${newFolderName.trim()}`
          };
          setFolders(prevFolders => [...prevFolders, newFolder]);
          setSelectedFolder(folderValue);
          setNewFolderName('');
          setIsAddingFolder(false);
          
          // Reload folders to get updated data from backend
          await loadFolders();
        } else {
          console.error('Failed to create folder:', response);
          setError(response.message || 'Failed to create folder');
        }
      } catch (error) {
        console.error('Failed to create folder:', error);
        setError(error.message || 'Failed to create folder');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleKeyPress = (e, type) => {
    if (e.key === 'Enter') {
      if (type === 'subject') {
        handleAddSubject();
      } else if (type === 'folder') {
        handleAddFolder();
      }
    } else if (e.key === 'Escape') {
      if (type === 'subject') {
        setIsAddingSubject(false);
        setNewSubjectName('');
        setError('');
      } else if (type === 'folder') {
        setIsAddingFolder(false);
        setNewFolderName('');
        setError('');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* File Organization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <FolderOpen className="w-5 h-5 mr-2" />
            Organization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Note Title</label>
            <Input 
              placeholder="Auto-suggested from content..."
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="subject-select" className="text-sm font-medium text-gray-700">Subject</label>
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
                  onKeyDown={(e) => handleKeyPress(e, 'subject')}
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
                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                value={selectedSubject}
                onChange={(e) => {
                  console.log('Subject selected:', e.target.value);
                  setSelectedSubject(e.target.value);
                }}
                disabled={subjectsLoading}
              >
                <option value="">{subjectsLoading ? 'Loading subjects...' : 'Select subject...'}</option>
                {subjects.map((subject) => (
                  <option key={subject.value} value={subject.value}>
                    {subject.label}
                  </option>
                ))}
              </select>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="folder-select" className="text-sm font-medium text-gray-700">Folder</label>
              {!isAddingFolder && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsAddingFolder(true)}
                  className="p-1 h-6 w-6"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              )}
            </div>
            
            {isAddingFolder ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter new folder name..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, 'folder')}
                  className="text-sm"
                  autoFocus
                />
                <Button 
                  size="sm" 
                  onClick={handleAddFolder}
                  disabled={!newFolderName.trim() || !selectedSubject || loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setIsAddingFolder(false);
                    setNewFolderName('');
                    setError('');
                  }}
                  disabled={loading}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <select 
                  id="folder-select"
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  value={selectedFolder}
                  onChange={(e) => {
                    console.log('Folder selected:', e.target.value);
                    setSelectedFolder(e.target.value);
                  }}
                  disabled={foldersLoading || !selectedSubject}
                >
                  <option value="">
                    {!selectedSubject ? 'Select a subject first...' : 
                     foldersLoading ? 'Loading folders...' : 
                     'Choose folder...'}
                  </option>
                  {folders.map((folder) => (
                    <option key={folder.value} value={folder.value}>
                      {folder.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tags</label>
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
