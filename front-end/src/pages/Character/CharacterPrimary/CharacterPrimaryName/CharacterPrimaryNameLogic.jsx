// Packages
import { useContext, useState, useEffect } from "react";

// Components

// Logic

// Context
import { CharacterContext } from "../../CharacterContext";
import { APIContext } from "../../../../context/APIContext";

// Services
import isLightBackground from "../../../../services/IsLightBackground";

// Styles

// Assets

export const CharacterPrimaryNameLogic = () => {
	const { isAuthorizedToEdit, story, character, setCharacter, characterOverviewBackground, isOnOverviewSection } = useContext(CharacterContext);
	const { APIRequest } = useContext(APIContext);
	const [primaryNameStyles, setPrimaryNameStyles] = useState({});

	useEffect(() => {
		async function getPrimaryNameStyles() {
			if (!isOnOverviewSection) return setPrimaryNameStyles({});
			if (!characterOverviewBackground) setPrimaryNameStyles({ color: "#fff" });
			const isDarkName = await isLightBackground(characterOverviewBackground, [0, 40], [-1, 115]);
			setPrimaryNameStyles({ color: isDarkName ? "#000" : "#fff" });
		}
		getPrimaryNameStyles();
	}, [characterOverviewBackground, isOnOverviewSection, setPrimaryNameStyles]);

	function changeName(e) {
		setCharacter((oldCharacter) => {
			let newCharacter = JSON.parse(JSON.stringify(oldCharacter));
			newCharacter.data.name = e.target.value;
			return newCharacter;
		});
	}

	async function revertName() {
		const response = await APIRequest("/character/get-value/" + character._id, "POST", {
			story_id: story._id,
			path: ["data", "name"],
		});
		if (!response || response?.errors || !response?.data?.value) return false;

		setCharacter((oldCharacter) => {
			let newCharacter = JSON.parse(JSON.stringify(oldCharacter));
			newCharacter.data.name = response.data.value;
			return newCharacter;
		});

		return true;
	}

	const [errors, setErrors] = useState([]);

	async function saveName() {
		setErrors([]);
		if (!character?._id) return;
		const response = await APIRequest("/character/" + character._id, "PATCH", {
			story_id: story._id,
			path: ["data", "name"],
			newValue: character.data.name,
		});
		if (!response || response?.errors) {
			if (response?.errors) setErrors(response.errors);
			return false;
		}
		return true;
	}

	return { isAuthorizedToEdit, character, primaryNameStyles, changeName, revertName, saveName, errors };
};
