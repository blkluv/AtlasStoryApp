// Packages
import { FaTimes } from "react-icons/fa";

// Components
import { IconBtn } from "../IconBtn/IconBtn";

// Logic

// Context

// Services

// Styles
import "./PopUpContainer.css";

// Assets

export const PopUpContainer = ({ children, className, title, isDisplaying, onClosePopUp, nullOnHidden, hidePrimary }) => {
	if (!isDisplaying && nullOnHidden) return null;
	return (
		<div className={isDisplaying ? "pop-up-container " + className : "pop-up-container-hidden"}>
			<div className='pop-up-content-container' onClick={onClosePopUp}>
				<div className='pop-up-content' onClick={(e) => e.stopPropagation()}>
					{hidePrimary ? null : (
						<div className='pop-up-content-primary-container'>
							{!title ? null : <div className='pop-up-content-primary-title'>{title}</div>}
							<div className='pop-up-content-primary-btn-container'>
								{!onClosePopUp ? null : <IconBtn icon={<FaTimes />} iconName='times' onClick={onClosePopUp} seamless={true} />}
							</div>
						</div>
					)}
					{children}
				</div>
			</div>
			<div className='pop-up-background' onClick={onClosePopUp} />
		</div>
	);
};
