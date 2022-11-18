// Packages

// Components
import { EditableContainer } from "../../../components/EditableContainer/EditableContainer";
import { ContentItem } from "../../../components/ContentItem/ContentItem";
import { LabelContainer } from "../../../components/LabelContainer/LabelContainer";
import { Text } from "../../../components/Text/Text";
import { MultiLineTextInput } from "../../../components/MultiLineTextInput/MultiLineTextInput";

// Logic
import { StoryDescriptionLogic } from "./StoryDescriptionLogic";

// Context

// Services

// Styles
import "./StoryDescription.css";

// Assets

export const StoryDescription = () => {
	const { isAuthorizedToEdit, story, changeStoryDescription, revertStoryDescription, saveStoryDescription } = StoryDescriptionLogic();

	if (!story?.data?.description)
		return (
			<ContentItem size='s' hasBg={true}>
				<LabelContainer className='story-description-container' label='Description'>
					<div className='story-description'></div>
				</LabelContainer>
			</ContentItem>
		);
	return (
		<ContentItem size='s' hasBg={true}>
			<LabelContainer className='story-description-container' label='Description'>
				<div className='story-description'>
					<EditableContainer
						className='story-description-value-container'
						absolutePositionEditBtns={true}
						isAuthorizedToEdit={isAuthorizedToEdit}
						onRevert={revertStoryDescription}
						onSave={saveStoryDescription}
						higherEditBtns={true}
					>
						<div className='story-description-value'>{!story?.data?.description ? null : <Text value={story.data.description} />}</div>
						<MultiLineTextInput
							className='story-description-value'
							label='Description'
							value={story.data.description.join("\n")}
							onChange={changeStoryDescription}
							seamless={true}
						/>
					</EditableContainer>
				</div>
			</LabelContainer>
		</ContentItem>
	);
};
