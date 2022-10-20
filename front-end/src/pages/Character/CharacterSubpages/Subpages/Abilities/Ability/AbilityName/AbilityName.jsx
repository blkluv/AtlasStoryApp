// Packages

// Components
import { EditableContainer } from "../../../../../../../components/EditableContainer/EditableContainer";
import { TextInput } from "../../../../../../../components/TextInput/TextInput";

// Logic
import { AbilityNameLogic } from "./AbilityNameLogic";

// Context

// Services

// Styles
import "./AbilityName.css";

// Assets

export const AbilityName = ({ ability, changeAbility }) => {
	const { isAuthorizedToEdit, changeAbilityName, revertAbilityName, saveAbilityName } = AbilityNameLogic({ ability, changeAbility });

	return (
		<EditableContainer
			className='character-subpage-abilities-ability-name-container'
			absolutePositionEditBtns={true}
			isAuthorizedToEdit={isAuthorizedToEdit}
			onRevert={revertAbilityName}
			onSave={saveAbilityName}
		>
			<div className='character-subpage-abilities-ability-name'>{ability?.name}</div>
			<TextInput
				className='character-subpage-abilities-ability-name'
				label='Ability Name'
				seamless={true}
				autoResize={true}
				value={ability?.name}
				onChange={changeAbilityName}
			/>
		</EditableContainer>
	);
};
