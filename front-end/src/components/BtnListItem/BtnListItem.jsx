// Packages
import { FaTimes } from "react-icons/fa";

// Components
import { IconBtn } from "../IconBtn/IconBtn";
import { TextInput } from "../TextInput/TextInput";

// Logic
import { BtnListItemLogic } from "./BtnListItemLogic";

// Context

// Services

// Styles
import "./BtnListItem.css";

// Assets

export const BtnListItem = ({ className, size, value, index, isActive, onClick, onChange, onRemove }) => {
	const { btnListItemClassName, onRemoveBtnClick } = BtnListItemLogic({ className, size, index, isActive, onClick, onRemove });

	return (
		<div tabIndex='1' className={btnListItemClassName} onClick={onClick} onAuxClick={onClick}>
			{value === undefined ? (
				<div className='btn-list-item-value-placeholder'></div>
			) : onChange === undefined ? (
				<div className='btn-list-item-value'>{value}</div>
			) : (
				<TextInput className='btn-list-item-value' seamless={true} value={value} onChange={onChange} />
			)}
			<div className='btn-list-item-btns-container'>
				{onRemove === undefined ? null : (
					<IconBtn
						className='btn-list-item-btns-remove-btn'
						icon={<FaTimes />}
						iconName='times'
						size='s'
						seamless={true}
						onClick={onRemoveBtnClick}
					/>
				)}
			</div>
		</div>
	);
};
