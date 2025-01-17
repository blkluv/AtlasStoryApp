// Packages

// Components
import { ContentItem } from "../../../../../../components/ContentItem/ContentItem";
import { LabelContainer } from "../../../../../../components/LabelContainer/LabelContainer";
import { EditableContainer } from "../../../../../../components/EditableContainer/EditableContainer";
import { DropdownContainer } from "../../../../../../components/DropdownContainer/DropdownContainer";
import { ErrorMessage } from "../../../../../../components/ErrorMessage/ErrorMessage";

// Logic
import { SettingsGroupLogic } from "./SettingsGroupLogic";

// Context

// Services

// Styles

// Assets

export const SettingsGroup = () => {
	const { unit_type, isAuthorizedToEdit, storyGroups, group, changeGroup, revertGroup, saveGroup, errors } = SettingsGroupLogic();

	if (!["character"].includes(unit_type)) return null;
	return (
		<ContentItem hasBg={true} size='s'>
			<LabelContainer label='Group' isInline={true}>
				<EditableContainer isAuthorizedToEdit={isAuthorizedToEdit} onRevert={revertGroup} onSave={saveGroup} higherEditBtns={true}>
					<div>
						<div>{group?.data?.name}</div>
					</div>
					<div>
						<DropdownContainer value={group?.data?.name} onChange={changeGroup}>
							{storyGroups.map((groupsGroup, index) => (
								<div key={index}>{groupsGroup?.data?.name}</div>
							))}
						</DropdownContainer>
						<ErrorMessage errors={errors} />
					</div>
				</EditableContainer>
			</LabelContainer>
		</ContentItem>
	);
};
