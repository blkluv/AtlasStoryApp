// Packages
import { FaPlus, FaSort } from "react-icons/fa";

// Components
import { CharactersCreateCharacterType } from "./CharactersCreateCharacterType/CharactersCreateCharacterType";
import { ContentItem } from "../../../components/ContentItem/ContentItem";
import { IconBtn } from "../../../components/IconBtn/IconBtn";
import { BtnListContainer } from "../../../components/BtnListContainer/BtnListContainer";
import { DragDropContainer } from "../../../components/DragDropContainer/DragDropContainer";
import { DragDropItem } from "../../../components/DragDropItem/DragDropItem";
import { BtnListItem } from "../../../components/BtnListItem/BtnListItem";
import { FirstAddButton } from "../../../components/FirstAddButton/FirstAddButton";

// Logic
import { CharactersCharacterTypesLogic } from "./CharactersCharacterTypesLogic";

// Context

// Services

// Styles
import "./CharactersCharacterTypes.css";

// Assets

export const CharactersCharacterTypes = () => {
	const {
		isAuthorizedToEdit,
		authorized_user_id,
		story,
		storyCharacterTypes,
		characterType,
		changeCharacterType,
		openCreateCharacterTypeForm,
		isReorderingCharacterTypes,
		toggleIsReorderingCharacterTypes,
		changeCharacterTypesOrder,
		activeTypeColours,
	} = CharactersCharacterTypesLogic();

	if (!isAuthorizedToEdit && (!story?.data?.characterTypes || story?.data?.characterTypes.length === 0)) return null;
	return (
		<div
			className={
				story?.data?.characterTypes?.length === 0 && story?.data?.members.findIndex((e) => e?.user_id === authorized_user_id) !== -1
					? "characters-character-types-container characters-character-types-container-no-types"
					: "characters-character-types-container"
			}
			style={{
				"--charactersCharacterTypeActiveColourGradient1": activeTypeColours[0],
				"--charactersCharacterTypeActiveColourGradient2": activeTypeColours[1],
			}}
		>
			<ContentItem className='characters-character-types'>
				<div className='characters-character-types-primary'>
					<div className='characters-character-types-primary-title'>Character Types</div>
					{!isAuthorizedToEdit ? null : (
						<div className='characters-character-types-primary-modify-buttons-container'>
							<IconBtn
								className='characters-character-types-primary-modify-btn'
								seamless={true}
								icon={<FaPlus />}
								iconName='plus'
								onClick={openCreateCharacterTypeForm}
								label='Create Character Type'
							/>
							<IconBtn
								className='characters-character-types-primary-modify-btn'
								seamless={true}
								icon={<FaSort />}
								iconName='sort'
								onClick={toggleIsReorderingCharacterTypes}
								label='Reorder Character Types'
							/>
						</div>
					)}
				</div>
				{story?.data?.characterTypes?.length === 0 && story?.data?.members.findIndex((e) => e?.user_id === authorized_user_id) !== -1 ? (
					<div className='characters-character-types-add-first-group-container'>
						<FirstAddButton label='Create Character Type' onClick={openCreateCharacterTypeForm} />
					</div>
				) : !story?.data?.characterTypes || !storyCharacterTypes ? (
					<div className='characters-character-types-character-type-items-container'>
						<BtnListItem />
						<BtnListItem />
						<BtnListItem />
					</div>
				) : (
					<BtnListContainer>
						<DragDropContainer
							className='characters-character-types-character-type-items-container'
							inlineItems={false}
							enableDragDrop={isReorderingCharacterTypes}
							onDropItem={changeCharacterTypesOrder}
						>
							{story.data.characterTypes.map((characterTypeID, index) => (
								<DragDropItem key={index} index={index} className='characters-character-types-character-type-item-container'>
									<BtnListItem
										value={storyCharacterTypes.find((e) => e._id === characterTypeID)?.data?.name}
										index={index}
										isActive={characterType._id === characterTypeID}
										hasFoundActive={characterType?._id !== undefined}
										onClick={(e) => (e?.button === 2 ? null : changeCharacterType(characterTypeID))}
									/>
								</DragDropItem>
							))}
						</DragDropContainer>
					</BtnListContainer>
				)}
				<CharactersCreateCharacterType />
			</ContentItem>
		</div>
	);
};
