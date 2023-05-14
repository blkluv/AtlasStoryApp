// Packages

// Components
import { ContentItem } from "../../../../../../components/ContentItem/ContentItem";
import { EditableContainer } from "../../../../../../components/EditableContainer/EditableContainer";
import { LabelContainer } from "../../../../../../components/LabelContainer/LabelContainer";
import { ImageInput } from "../../../../../../components/ImageInput/ImageInput";
import { ErrorMessage } from "../../../../../../components/ErrorMessage/ErrorMessage";

// Logic
import { SettingsOverviewBackgroundImageLogic } from "./SettingsOverviewBackgroundImageLogic";

// Context

// Services

// Styles
import "./SettingsOverviewBackgroundImage.css";

// Assets

export const SettingsOverviewBackgroundImage = () => {
	const { isAuthorizedToEdit, groupOverviewBackground, changeOverviewBackground, revertOverviewBackground, saveOverviewBackground, errors } =
		SettingsOverviewBackgroundImageLogic();

	return (
		<ContentItem hasBg={true} size='s'>
			<LabelContainer className='group-subpage-settings-overview-background-container' label='Overview Background Image'>
				<EditableContainer isAuthorizedToEdit={isAuthorizedToEdit} onRevert={revertOverviewBackground} onSave={saveOverviewBackground}>
					<div className='group-subpage-settings-overview-background-image'>
						{!groupOverviewBackground ? null : <img src={groupOverviewBackground} alt='' />}
					</div>
					<div>
						<div className='group-subpage-settings-overview-background-image'>
							<ImageInput value={groupOverviewBackground} onChange={changeOverviewBackground} />
						</div>
						<ErrorMessage errors={errors} />
					</div>
				</EditableContainer>
			</LabelContainer>
		</ContentItem>
	);
};