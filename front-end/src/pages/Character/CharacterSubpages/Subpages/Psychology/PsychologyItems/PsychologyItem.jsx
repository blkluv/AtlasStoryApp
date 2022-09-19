// Packages
import { FaTimes } from "react-icons/fa";

// Components
import { Text } from "../../../../../../components/Text/Text";
import { TextInput } from "../../../../../../components/TextInput/TextInput";
import { MultiLineTextInput } from "../../../../../../components/MultiLineTextInput/MultiLineTextInput";
import { IconBtn } from "../../../../../../components/IconBtn/IconBtn";

// Logic

// Context

// Services

// Styles
import "./PsychologyItem.css";

// Assets

export const PsychologyItem = ({ psychologyItem, index, isEditing, changePsychologyItemTitle, changePsychologyItemText, removePsychologyItem }) => {
	if (!isEditing)
		return (
			<div className='character-subpage-psychology-item'>
				<div className='character-subpage-psychology-item-title'>{psychologyItem?.title}</div>
				<Text className='character-subpage-psychology-item-text' value={psychologyItem?.text} />
			</div>
		);

	return (
		<div className='character-subpage-psychology-item'>
			<div className='character-subpage-psychology-item-content'>
				<TextInput
					className='character-subpage-psychology-item-title'
					seamless={true}
					label='Psychology Item Title'
					value={psychologyItem?.title}
					onChange={(e) => changePsychologyItemTitle(e, index)}
				/>
				<MultiLineTextInput
					className='character-subpage-psychology-item-text'
					seamless={true}
					label='Psychology Item Value'
					value={psychologyItem?.text.join("\n")}
					onChange={(e) => changePsychologyItemText(e, index)}
				/>
			</div>
			<IconBtn icon={<FaTimes />} iconName='times' seamless={true} size='s' onClick={() => removePsychologyItem(index)} />
		</div>
	);
};
