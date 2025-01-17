// Packages
import { FaTimes, FaImage, FaPlus } from "react-icons/fa";

// Components
import { DragDropContainer } from "../../../../../../components/DragDropContainer/DragDropContainer";
import { DragDropItem } from "../../../../../../components/DragDropItem/DragDropItem";
import { ContentItem } from "../../../../../../components/ContentItem/ContentItem";
import { Text } from "../../../../../../components/Text/Text";
import { TextInput } from "../../../../../../components/TextInput/TextInput";
import { MultiLineTextInput } from "../../../../../../components/MultiLineTextInput/MultiLineTextInput";
import { IconBtn } from "../../../../../../components/IconBtn/IconBtn";

// Logic

// Context

// Services

// Styles
import "./PhysicalAttributeItem.css";

// Assets

export const PhysicalAttributeItem = ({
	physicalAttributeItem,
	index,
	isEditing,
	changePhysicalAttributeItemTitle,
	changePhysicalAttributeItemText,
	removePhysicalAttributeItem,
	openUnitImages,
	unitImages,
	onPhysicalItemImageClick,
	changePhysicalAttributeItemImageCaption,
	removePhysicalAttributeItemImage,
	isReorderingPhysicalAttributeItems,
	reorderPhysicalAttributeItemImages,
}) => {
	if (!isEditing)
		return (
			<div className='unit-page-subpage-physical-attribute-item'>
				<ContentItem hasBg={true}>
					<div className='unit-page-subpage-physical-attribute-item-title'>{physicalAttributeItem?.title}</div>
					<Text className='unit-page-subpage-physical-attribute-item-text' value={physicalAttributeItem?.text} />
					{physicalAttributeItem.images.length === 0 ? null : (
						<div className='unit-page-subpage-physical-attribute-item-images'>
							{physicalAttributeItem.images.map((image, imageIndex) => (
								<div key={imageIndex} className='unit-page-subpage-physical-attribute-item-image-item'>
									{!unitImages.find((e) => e._id === image.image)?.image ? null : (
										<img
											className='lightbox-openable-image'
											src={unitImages.find((e) => e._id === image.image).image}
											alt=''
											onClick={() => onPhysicalItemImageClick("attributes", index, imageIndex)}
										/>
									)}
									{image.caption.split(" ").join("").length === 0 ? null : (
										<div className='unit-page-subpage-development-item-image-item-caption'>{image.caption}</div>
									)}
								</div>
							))}
						</div>
					)}
				</ContentItem>
			</div>
		);

	return (
		<div className='unit-page-subpage-physical-attribute-item'>
			<ContentItem hasBg={true}>
				<div className='unit-page-subpage-physical-attribute-item-content'>
					<TextInput
						className='unit-page-subpage-physical-attribute-item-title'
						seamless={true}
						label='Physical Attribute Item Title'
						value={physicalAttributeItem?.title}
						onChange={(e) => changePhysicalAttributeItemTitle(e, index)}
						aiTools={false}
					/>
					<MultiLineTextInput
						className='unit-page-subpage-physical-attribute-item-text'
						seamless={true}
						label='Physical Attribute Item Text'
						value={physicalAttributeItem?.text.join("\n")}
						onChange={(e) => changePhysicalAttributeItemText(e, index)}
						aiTools={true}
					/>
					<DragDropContainer
						className='unit-page-subpage-physical-attribute-item-images'
						enableDragDrop={isReorderingPhysicalAttributeItems}
						onDropItem={(res) => reorderPhysicalAttributeItemImages(res, index)}
					>
						{!physicalAttributeItem?.images
							? null
							: physicalAttributeItem.images.map((image, imageIndex) => (
									<DragDropItem
										key={imageIndex}
										index={imageIndex}
										className='unit-page-subpage-physical-attribute-item-image-item'
									>
										{!unitImages.find((e) => e._id === image.image)?.image ? null : (
											<img src={unitImages.find((e) => e._id === image.image).image} alt='' />
										)}
										<TextInput
											className='unit-page-subpage-physical-attribute-item-image-item-caption'
											seamless={true}
											autoResize={true}
											label='Caption'
											value={image.caption}
											onChange={(e) => changePhysicalAttributeItemImageCaption(e, index, imageIndex)}
										/>
										<div className='unit-page-subpage-physical-attribute-item-image-item-btns-container'>
											<IconBtn
												icon={<FaTimes />}
												iconName='remove'
												seamless={true}
												size='s'
												onClick={() => removePhysicalAttributeItemImage(index, imageIndex)}
											/>
										</div>
									</DragDropItem>
							  ))}
					</DragDropContainer>
				</div>
				<div className='unit-page-subpage-physical-attribute-item-btns-container'>
					<IconBtn icon={<FaTimes />} iconName='times' seamless={true} size='s' onClick={() => removePhysicalAttributeItem(index)} />
					<IconBtn
						icon={<FaImage />}
						iconName='image'
						iconSmall={<FaPlus />}
						seamless={true}
						onClick={() => openUnitImages("attributes", index)}
					/>
				</div>
			</ContentItem>
		</div>
	);
};
