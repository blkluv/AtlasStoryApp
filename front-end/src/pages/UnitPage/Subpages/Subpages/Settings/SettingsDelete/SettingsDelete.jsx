// Packages

// Components
import { ContentItem } from "../../../../../../components/ContentItem/ContentItem";
import { LabelContainer } from "../../../../../../components/LabelContainer/LabelContainer";
import { ConfirmDelete } from "../../../../../../components/ConfirmDelete/ConfirmDelete";
import { ErrorMessage } from "../../../../../../components/ErrorMessage/ErrorMessage";

// Logic
import { SettingsDeleteLogic } from "./SettingsDeleteLogic";

// Context

// Services

// Styles

// Assets

export const SettingsDelete = () => {
	const { unit_type_title, isAuthorizedToEdit, deleteUnit, errors } = SettingsDeleteLogic();

	return (
		<ContentItem hasBg={true} size='s' className='unit-page-settings-delete-container'>
			<LabelContainer label={"Delete " + unit_type_title} isInline={true}>
				<ConfirmDelete
					onDelete={deleteUnit}
					seamless={true}
					isAuthorizedToEdit={isAuthorizedToEdit}
					labelContext={"this " + unit_type_title.toLowerCase()}
				/>
				<ErrorMessage errors={errors} />
			</LabelContainer>
		</ContentItem>
	);
};
