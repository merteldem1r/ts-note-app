import "bootstrap/dist/css/bootstrap.min.css";
import './index.css';
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useLocalStorage } from "./hooks/useLocalStorage.ts";
import { useMemo } from "react";
import { v4 as uuidv4 } from 'uuid';
import { NewNote } from "./pages/NewNote.tsx";
import { NoteList } from "./pages/NoteList.tsx";
import { NoteLayout } from "./components/NoteLayout.tsx";
import { NotePage } from "./pages/NotePage.tsx";
import { NoteEdit } from "./pages/NoteEdit.tsx";

export type Note = {
  id: string
} & NoteData

export type RawNote = {
  id: string
} & RawNoteData

export type RawNoteData = {
  title: string
  markdown: string
  tagIds: string[]
}

export type NoteData = {
  title: string
  markdown: string
  tags: Tag[]
}

export type Tag = {
  id: string
  label: string
}

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  const notesWithTags = useMemo(() => {
    return notes.map(note => {
      return { ...note, tags: tags.filter(tag => note.tagIds.includes(tag.id)) }
    })
  }, [notes, tags])

  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes(prev => {
      return [...prev, { ...data, id: uuidv4(), tagIds: tags.map(tag => tag.id) }]
    })
  }

  function addTag(tag: Tag) {
    setTags(prev => [...prev, tag])
  }

  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    setNotes(prev => {
      return prev.map(note => {
        if (note.id === id) {
          return { ...note, ...data, tagIds: tags.map(tag => tag.id) }
        } else {
          return note
        }
      })
    })
  }

  function onDeleteNote(id: string): void {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
  }

  function updateTag(id: string, label: string): void {
    setTags(prev => {
      return prev.map(tag => {
        if (tag.id === id) {
          return { ...tag, label }
        } else {
          return tag
        }
      })
    })
  }

  function deleteTag(id: string): void {
    setTags(prev => {
      return prev.filter(tag => tag.id !== id);
    })
  }

  return (
    <Container className="my-4">
      <RouterProvider router={
        createBrowserRouter(createRoutesFromElements([
          <Route path="/" element={
            <NoteList
              notes={notesWithTags}
              availableTags={tags}
              onUpdateTag={updateTag}
              onDeleteTag={deleteTag}
            />}
          />,
          <Route
            path="/new"
            element={
              <NewNote
                onSubmit={onCreateNote}
                onAddTag={addTag}
                availableTags={tags}
              />}
          />,
          <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
            <Route index element={<NotePage onDelete={onDeleteNote} />} />
            <Route path="edit" element={
              <NoteEdit
                onSubmit={onUpdateNote}
                onAddTag={addTag}
                availableTags={tags}
              />}
            />
          </Route>,

          <Route path="*" element={<Navigate to="/" />} />,
        ]))}
      />
    </Container>
  )
}

export default App
