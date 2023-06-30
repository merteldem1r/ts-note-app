import { NoteForm } from "../components/NoteForm.tsx";
import { Note, NoteData, Tag } from "../App.tsx";
import { useOutletContext } from "react-router-dom";

type NoteEditProps = {
  onSubmit: (id: string, data: NoteData) => void
  onAddTag: (tag: Tag) => void
  availableTags: Tag[]
}

export function NoteEdit({ onSubmit, onAddTag, availableTags }: NoteEditProps) {
  const note = useOutletContext<Note>();

  return (
    <div>
      <h1 className="mb-4">Edit Note</h1>
      <NoteForm
        title={note.title}
        markdown={note.markdown}
        tags={note.tags}
        onSubmit={data => onSubmit(note.id, data)}
        onAddTag={onAddTag}
        availableTags={availableTags}
      />
    </div>
  );
}
