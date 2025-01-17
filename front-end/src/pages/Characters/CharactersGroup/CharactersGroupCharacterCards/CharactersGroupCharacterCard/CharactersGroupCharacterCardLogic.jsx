// Packages
import { useContext, useState, useEffect, useRef } from "react";

// Components

// Logic

// Context
import { CharactersContext } from "../../../CharactersContext";
import { RoutesContext } from "../../../../../context/RoutesContext";

// Services
import getColourTint from "../../../../../services/GetColourTint";
import getColourWithTint from "../../../../../services/GetColourWithTint";

// Styles

// Assets

export const CharactersGroupCharacterCardLogic = ({ characterID }) => {
	const { story, storyCharacters, storyCharacterTypes } = useContext(CharactersContext);
	const { changeLocation } = useContext(RoutesContext);

	const [character, setCharacter] = useState(false);
	const [characterType, setCharacterType] = useState(false);

	useEffect(() => {
		if (characterID) {
			const newCharacter = storyCharacters?.find((e) => e._id === characterID);
			setCharacter(newCharacter);

			const newCharacterType = storyCharacterTypes?.find((e) => e._id === newCharacter?.character_type_id);
			setCharacterType(newCharacterType === undefined ? false : newCharacterType);
		}
	}, [characterID, storyCharacters, storyCharacterTypes, setCharacter, setCharacterType]);

	function navigateToCharacter(e) {
		if (e.button === 2) return;
		e.preventDefault();
		if (story?.uid && character?.uid) changeLocation("/s/" + story.uid + "/c/" + character.uid, e.button === 1);
	}

	function onCharacterCardMouseDown(e) {
		if (e.button === 1) e.preventDefault();
	}

	// Character Colour Styles
	const [cardStyles, setCardStyles] = useState({});

	useEffect(() => {
		let newCardStyles = {};
		if (character?.data?.colour) {
			newCardStyles["--characterColour"] = character.data.colour;
			newCardStyles["--characterColourTint"] = getColourTint(character.data.colour);

			const colours = getColourWithTint(character.data.colour);
			newCardStyles["--characterColourGradient1"] = colours[0];
			newCardStyles["--characterColourGradient2"] = colours[1];
		} else {
			newCardStyles["--characterColour"] = "#0044ff";
			newCardStyles["--characterColourTint"] = "#0044ff";
			newCardStyles["--characterColourGradient1"] = "#0044ff";
			newCardStyles["--characterColourGradient2"] = "#0044ff";
		}
		if (characterType?.data?.colour) {
			const type_colours = getColourWithTint(characterType?.data?.colour);
			newCardStyles["--characterTypeColourGradient1"] = type_colours[0];
			newCardStyles["--characterTypeColourGradient2"] = type_colours[1];
		}
		setCardStyles(newCardStyles);
	}, [character, characterType, setCardStyles]);

	const cardBackgroundSizeRef = useRef();

	return {
		character,
		characterType,
		navigateToCharacter,
		onCharacterCardMouseDown,
		cardStyles,
		cardBackgroundSizeRef,
	};
};
