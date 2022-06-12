// Packages

// Components
import { TextInput } from "../../../components/TextInput/TextInput";
import { ErrorMessage } from "../../../components/ErrorMessage/ErrorMessage";
import { SubmitBtn } from "../../../components/SubmitBtn/SubmitBtn";

// Logic
import { CharactersCreateGroupLogic } from "./CharactersCreateGroupLogic";

// Context

// Services

// Styles
import "./CharactersCreateGroup.css";

// Assets

export const CharactersCreateGroup = () => {
	const { isDisplayingCreateGroupForm, closeCreateGroupForm, groupName, changeGroupName, groupUID, changeGroupUID, errors, submitCreateGroup } =
		CharactersCreateGroupLogic();

	if (!isDisplayingCreateGroupForm) return null;
	return (
		<div className='characters-create-group-container'>
			<div className='characters-create-group-form'>
				<div className='characters-create-group-form-title'>Create Group</div>
				<div className='characters-create-group-form-input-container'>
					<TextInput label='Name' value={groupName} onChange={changeGroupName} isDark={true} />
					<ErrorMessage errors={errors} attribute='name' />
				</div>
				<div className='characters-create-group-form-input-container'>
					<TextInput label='Unique Identifier' value={groupUID} onChange={changeGroupUID} isDark={true} />
					<ErrorMessage errors={errors} attribute='uid' />
				</div>
				<ErrorMessage errors={errors} />
				<div className='characters-create-group-form-submit-container'>
					<SubmitBtn label='Create Group' onSubmit={submitCreateGroup} />
				</div>
			</div>
			<div className='characters-create-group-background' onClick={closeCreateGroupForm} />
		</div>
	);
};
