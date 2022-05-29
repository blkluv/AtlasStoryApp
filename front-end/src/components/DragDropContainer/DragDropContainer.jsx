// Packages

// Components

// Logic
import { DragDropContainerLogic } from "./DragDropContainerLogic";

// Context

// Styles

// Assets

export const DragDropContainer = ({ children, innerRef, className, inlineItems, enableDragDrop, onDropItem }) => {
	const { updatedChildren } = DragDropContainerLogic({ children, inlineItems, enableDragDrop, onDropItem });

	return (
		<div ref={innerRef} draggable='false' className={className === undefined ? "drag-drop-list" : "drag-drop-list " + className}>
			{updatedChildren}
		</div>
	);
};