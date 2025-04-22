
'use client';

import {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Card, CardHeader, CardContent, CardFooter} from '@/components/ui/card';
import {Label} from '@/components/ui/label';
import {useToast} from '@/hooks/use-toast';
import {suggestTags} from '@/ai/flows/suggest-tags';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Icons} from '@/components/icons';
import {AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction} from '@/components/ui/alert-dialog';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const {toast} = useToast();

  useEffect(() => {
    // Load notes from local storage on initial render
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  }, []);

  useEffect(() => {
    // Save notes to local storage whenever notes change
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleSuggestTags = async () => {
    if (!content) {
      toast({
        title: 'Error',
        description: 'Please enter some content to suggest tags.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const result = await suggestTags({noteContent: content});
      setSuggestedTags(result.tags);
      toast({
        title: 'Tags Suggested',
        description: 'Suggested tags have been generated.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to suggest tags.',
        variant: 'destructive',
      });
    }
  };

  const handleCreateNote = async () => {
    if (!title || !content) {
      toast({
        title: 'Error',
        description: 'Title and content are required.',
        variant: 'destructive',
      });
      return;
    }

    const newNote: Note = {
      id: generateId(),
      title,
      content,
      tags: suggestedTags,
    };

    setNotes([...notes, newNote]);
    setTitle('');
    setContent('');
    setSuggestedTags([]);
    toast({
      title: 'Success',
      description: 'Note created successfully.',
    });
  };

  const handleEditNote = () => {
    if (!editingNoteId) return;

    const updatedNotes = notes.map(note => {
      if (note.id === editingNoteId) {
        return {...note, title, content, tags: suggestedTags};
      }
      return note;
    });

    setNotes(updatedNotes);
    setEditingNoteId(null);
    setTitle('');
    setContent('');
    setSuggestedTags([]);
    toast({
      title: 'Success',
      description: 'Note updated successfully.',
    });
  };

  const startEditing = (note: Note) => {
    setEditingNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setSuggestedTags(note.tags);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    toast({
      title: 'Success',
      description: 'Note deleted successfully.',
    });
  };

  const isEditing = !!editingNoteId;

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row gap-4">
      {/* Note Creation Section */}
      <Card className="w-full md:w-1/2">
        <CardHeader>
          <Label htmlFor="title">{isEditing ? 'Edit Note' : 'Create New Note'}</Label>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Note title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Note content"
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </div>
          <div>
            <Button type="button" onClick={handleSuggestTags}>
              Suggest Tags
            </Button>
            {suggestedTags.length > 0 && (
              <div className="mt-2">
                <Label>Suggested Tags:</Label>
                <div className="flex gap-2">
                  {suggestedTags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="button" onClick={isEditing ? handleEditNote : handleCreateNote}>
            {isEditing ? 'Update Note' : 'Create Note'}
          </Button>
          {isEditing && (
            <Button variant="outline" onClick={() => {
              setEditingNoteId(null);
              setTitle('');
              setContent('');
              setSuggestedTags([]);
            }}>
              Cancel Edit
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Note List Section */}
      <Card className="w-full md:w-1/2">
        <CardHeader>
          <Label>My Notes</Label>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] w-full rounded-md border">
            <div className="p-4">
              {notes.length === 0 ? (
                <p>No notes created yet.</p>
              ) : (
                <div className="grid gap-4">
                  {notes.map(note => (
                    <Card key={note.id}>
                      <CardHeader>
                        <Label>{note.title}</Label>
                      </CardHeader>
                      <CardContent>
                        <p>{note.content.substring(0, 100)}...</p>
                        {note.tags.length > 0 && (
                          <div className="mt-2">
                            <Label>Tags:</Label>
                            <div className="flex gap-2">
                              {note.tags.map((tag, index) => (
                                <span key={index} className="px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <Button size="sm" onClick={() => startEditing(note)}>
                          <Icons.edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Icons.trash className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your note from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteNote(note.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
