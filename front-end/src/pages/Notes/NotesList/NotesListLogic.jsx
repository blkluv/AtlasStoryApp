// Packages
import { useContext, useState } from "react";

// Components

// Logic

// Context
import { NotesContext } from "../NotesContext";
import { APIContext } from "../../../context/APIContext";

// Services

// Styles

// Assets

export const NotesListLogic = () => {
	const { notes_uid, isAuthorizedToEdit, story, setStory, noteImages } = useContext(NotesContext);
	const { APIRequest } = useContext(APIContext);

	function addNotesItem() {
		let newStory = JSON.parse(JSON.stringify(story));
		const notesIndex = newStory.data.notes.findIndex((e) => e.uid === notes_uid);
		if (notesIndex === -1) return false;
		newStory.data.notes[notesIndex].items.push({ title: "", text: [""], images: [] });
		setStory(newStory);
	}

	const [isReorderingNotes, setIsReorderingNotes] = useState(false);
	function toggleIsReorderingNotes() {
		setIsReorderingNotes((oldIsReorderingNotes) => !oldIsReorderingNotes);
	}

	function reorderNotes(res) {
		if (res.from === undefined || res.to === undefined) return false;
		let newStory = JSON.parse(JSON.stringify(story));
		const notesIndex = newStory.data.notes.findIndex((e) => e.uid === notes_uid);
		if (notesIndex === -1) return false;
		const tempNotesItem = newStory.data.notes[notesIndex].items.splice(res.from, 1)[0];
		newStory.data.notes[notesIndex].items.splice(res.to, 0, tempNotesItem);
		setStory(newStory);
	}

	const [errors, setErrors] = useState([]);

	async function revertNotes() {
		setErrors([]);
		const response = await APIRequest("/story/get-value/" + story._id, "POST", {
			story_id: story._id,
			path: ["data", "notes", notes_uid],
		});
		if (!response || response?.errors || !response?.data?.value) return false;

		let newStory = JSON.parse(JSON.stringify(story));
		const notesIndex = newStory.data.notes.findIndex((e) => e.uid === notes_uid);
		if (notesIndex === -1) return false;
		newStory.data.notes[notesIndex].items = response.data.value;
		setStory(newStory);

		return true;
	}

	async function saveNotes() {
		setErrors([]);
		if (!story?._id) return false;
		const notesIndex = story.data.notes.findIndex((e) => e.uid === notes_uid);
		if (notesIndex === -1) return false;

		const response = await APIRequest("/story/" + story._id, "PATCH", {
			story_id: story._id,
			path: ["data", "notes", notes_uid],
			newValue: story.data.notes[notesIndex],
			newImages: noteImages,
		});
		if (!response || response?.errors) {
			if (response?.errors) setErrors(response.errors);
			return false;
		}
		return true;
	}

	return {
		notes_uid,
		isAuthorizedToEdit,
		story,
		addNotesItem,
		isReorderingNotes,
		toggleIsReorderingNotes,
		reorderNotes,
		errors,
		revertNotes,
		saveNotes,
	};
};