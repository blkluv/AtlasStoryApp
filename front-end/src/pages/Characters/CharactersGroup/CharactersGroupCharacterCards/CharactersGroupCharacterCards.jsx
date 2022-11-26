// Packages

// Components
import { CharactersGroupCharacterCard } from "./CharactersGroupCharacterCard/CharactersGroupCharacterCard";
import { DragDropContainer } from "../../../../components/DragDropContainer/DragDropContainer";
import { DragDropItem } from "../../../../components/DragDropItem/DragDropItem";

// Logic
import { CharactersGroupCharacterCardsLogic } from "./CharactersGroupCharacterCardsLogic";

// Context

// Services

// Styles
import "./CharactersGroupCharacterCards.css";
import { CarouselContainer } from "../../../../components/CarouselContainer/CarouselContainer";

// Assets

export const CharactersGroupCharacterCards = () => {
	const { group, charactersCardBackgrounds, isReorderingCharacters, changeCharactersOrder } = CharactersGroupCharacterCardsLogic();

	if (!group) return null;
	return (
		<div className='characters-group-characters-cards-container'>
			{!group?.data?.characters ? null : !charactersCardBackgrounds ? (
				<div className='characters-group-characters-cards'>
					{group?.data?.characters.map((character, index) => (
						<DragDropItem key={index} index={index} className='characters-group-character-card-container'>
							<CharactersGroupCharacterCard />
						</DragDropItem>
					))}
				</div>
			) : (
				<CarouselContainer speed={1.25} fallback={true} scrollStartOnDataChange={group?._id}>
					<DragDropContainer
						className='characters-group-characters-cards'
						inlineItems={true}
						enableDragDrop={isReorderingCharacters}
						onDropItem={changeCharactersOrder}
					>
						{group?.data?.characters.map((character, index) => (
							<DragDropItem key={index} index={index} className='characters-group-character-card-container'>
								<CharactersGroupCharacterCard characterID={character.character_id} />
							</DragDropItem>
						))}
					</DragDropContainer>
				</CarouselContainer>
			)}
		</div>
	);
};