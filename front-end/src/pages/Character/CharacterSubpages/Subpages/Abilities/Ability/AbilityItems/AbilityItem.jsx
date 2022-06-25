// Packages
import { FaTimes } from "react-icons/fa";

// Components
import { TextInput } from "../../../../../../../components/TextInput/TextInput";
import { Text } from "../../../../../../../components/Text/Text";
import { MultiLineTextInput } from "../../../../../../../components/MultiLineTextInput/MultiLineTextInput";
import { IconBtn } from "../../../../../../../components/IconBtn/IconBtn";

// Logic
import { AbilityItemLogic } from "./AbilityItemLogic";

// Context

// Services

// Styles
import "./AbilityItem.css";

// Assets

export const AbilityItem = ({ ability, changeAbility, abilityItem, index, isEditing }) => {
	const { changeAbilityItemTitle, changeAbilityItemText, removeAbilityItem } = AbilityItemLogic({ ability, changeAbility, index });

	return (
		<div className='character-subpage-abilities-ability-item'>
			<div className='character-subpage-abilities-ability-item-content'>
				{!isEditing ? (
					<div className='character-subpage-abilities-ability-item-title'>{abilityItem?.title}</div>
				) : (
					<TextInput
						className='character-subpage-abilities-ability-item-title'
						seamless={true}
						label='Ability Item Title'
						value={abilityItem?.title}
						onChange={changeAbilityItemTitle}
					/>
				)}
				{!isEditing ? (
					<Text className='character-subpage-abilities-ability-item-text' value={abilityItem?.text} />
				) : (
					<MultiLineTextInput
						className='character-subpage-abilities-ability-item-text'
						seamless={true}
						label='Ability Item Text'
						value={abilityItem?.text.join("\n")}
						onChange={changeAbilityItemText}
					/>
				)}
			</div>
			{!isEditing ? null : <IconBtn className='' seamless={true} icon={<FaTimes />} iconName='times' size='s' onClick={removeAbilityItem} />}
		</div>
	);
};
