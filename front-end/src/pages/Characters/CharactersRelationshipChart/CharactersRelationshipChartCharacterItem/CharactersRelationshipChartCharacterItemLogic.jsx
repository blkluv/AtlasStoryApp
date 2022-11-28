// Packages
import { useContext, useEffect, useState } from "react";

// Components

// Logic

// Context
import { CharactersContext } from "../../CharactersContext";

// Services

// Styles

// Assets

export const CharactersRelationshipChartCharacterItemLogic = ({ character, index }) => {
	const { characters, selectedCharacterRelationshipsCharacterId, setSelectedCharacterRelationshipsCharacterId } = useContext(CharactersContext);

	const [charactersRelationshipChartCharacterItemStyles, setCharactersRelationshipChartCharacterItemStyles] = useState({});
	useEffect(() => {
		function getCharactersRelationshipChartCharacterItemStyles() {
			let newCharactersRelationshipChartCharacterItemStyles = {};
			const angle = (index / characters.length) * Math.PI * 2;
			const adjacent = (850 / 2 - (72 + 6) / 2) * Math.sin(angle);
			const opposite = -1 * (850 / 2 - (72 + 6 + 18) / 2) * Math.cos(angle);
			newCharactersRelationshipChartCharacterItemStyles.transform = "translate(" + adjacent + "px, " + opposite + "px)";

			if (character?.data?.colour) newCharactersRelationshipChartCharacterItemStyles["--characterColour"] = character?.data?.colour;
			setCharactersRelationshipChartCharacterItemStyles(newCharactersRelationshipChartCharacterItemStyles);
		}
		getCharactersRelationshipChartCharacterItemStyles();
	}, [setCharactersRelationshipChartCharacterItemStyles, characters]);

	function onClick(e) {
		e.stopPropagation();
		if (!character?._id) return false;
		if (selectedCharacterRelationshipsCharacterId === character?._id) return setSelectedCharacterRelationshipsCharacterId(false);
		setSelectedCharacterRelationshipsCharacterId(character._id);
	}

	return { charactersRelationshipChartCharacterItemStyles, selectedCharacterRelationshipsCharacterId, onClick };
};
