// Packages
import { useContext, useRef, useEffect, useState, useCallback } from "react";

// Components

// Logic

// Context
import { LocationsContext } from "../LocationsContext";
import { APIContext } from "../../../context/APIContext";
import { RecentDataContext } from "../../../context/RecentDataContext";
import getColourTint from "../../../services/GetColourTint";

// Services

// Styles

// Assets

export const SurfaceMapLogic = () => {
	const {
		locations,
		currentMapLocationId,
		isSelectingSurfaceMapComponents,
		regionSelectingSurfaceMapComponentsFor,
		selectedSurfaceMapComponents,
		selectedLocationId,
		setSelectedLocationId,
		setIsDisplayingHierarchy,
		surfaceMapComponentsList,
		addComponentToSelectedSurfaceMapComponents,
		removeComponentToSelectedSurfaceMapComponents,
	} = useContext(LocationsContext);
	const { APIRequest } = useContext(APIContext);
	const { recentImages, addImagesToRecentImages } = useContext(RecentDataContext);
	const [locationMapImage, setLocationMapImage] = useState(false);
	const [isImagePixelated, setIsImagePixelated] = useState(false);
	const [isPanning, setIsPanning] = useState(false);
	const [isScrolling, setIsScrolling] = useState(false);
	const [regionNamesHTML, setRegionNamesHTML] = useState("");
	const [regionNamesTexts, setRegionNamesTexts] = useState("");

	const surfaceMapImageContainerRef = useRef();
	const surfaceMapImageRef = useRef();
	const surfaceMapImageComponentsContainerRef = useRef();
	const surfaceMapImageRegionsNamesRef = useRef();
	const surfaceMapImageRegionsNamesTextsRef = useRef();

	var zoom = useRef(1);
	var panning = useRef(false);
	var pointX = useRef(0);
	var pointY = useRef(0);
	var startPos = useRef({ x: 0, y: 0 });
	var lastWindowWidth = useRef(0);
	var regionClusters = useRef();

	useEffect(() => {
		lastWindowWidth.current = window.innerWidth;
	}, [lastWindowWidth]);

	const onClickMapComponent = useCallback(
		(index) => {
			if (!isSelectingSurfaceMapComponents) return false;

			if (
				Array.from(surfaceMapImageComponentsContainerRef?.current?.children[0]?.children[index].classList).includes(
					"locations-surface-map-image-component-in-region"
				)
			) {
				surfaceMapImageComponentsContainerRef?.current?.children[0]?.children[index].classList.remove(
					"locations-surface-map-image-component-in-region"
				);
				surfaceMapImageComponentsContainerRef?.current?.children[0]?.children[index].classList.remove(
					"locations-surface-map-image-component-selected"
				);
				removeComponentToSelectedSurfaceMapComponents(index);
				return true;
			}

			if (
				!Array.from(surfaceMapImageComponentsContainerRef?.current?.children[0]?.children[index].classList).includes(
					"locations-surface-map-image-component-selected"
				)
			) {
				surfaceMapImageComponentsContainerRef?.current?.children[0]?.children[index].classList.add(
					"locations-surface-map-image-component-selected"
				);
				addComponentToSelectedSurfaceMapComponents(index);
			} else {
				surfaceMapImageComponentsContainerRef?.current?.children[0]?.children[index].classList.remove(
					"locations-surface-map-image-component-selected"
				);
				removeComponentToSelectedSurfaceMapComponents(index);
			}
		},
		[
			isSelectingSurfaceMapComponents,
			surfaceMapImageComponentsContainerRef,
			addComponentToSelectedSurfaceMapComponents,
			removeComponentToSelectedSurfaceMapComponents,
		]
	);

	const onMouseOverMapComponent = useCallback(
		(index) => {
			locations
				?.find((e) => e?._id === currentMapLocationId)
				?.data?.regions?.find((e) => e?._id === surfaceMapComponentsList[index])
				?.components?.map((component_index) => {
					if (
						!Array.from(surfaceMapImageComponentsContainerRef?.current?.children[0]?.children[component_index].classList).includes(
							"locations-surface-map-image-component-hovering-over"
						)
					) {
						surfaceMapImageComponentsContainerRef?.current?.children[0]?.children[component_index].classList.add(
							"locations-surface-map-image-component-hovering-over"
						);
					}
					return true;
				});
		},
		[surfaceMapImageComponentsContainerRef, surfaceMapComponentsList, locations, currentMapLocationId]
	);

	const onMouseOutMapComponent = useCallback(
		(index) => {
			locations
				?.find((e) => e?._id === currentMapLocationId)
				?.data?.regions?.find((e) => e?._id === surfaceMapComponentsList[index])
				?.components?.map((component_index) => {
					if (
						Array.from(surfaceMapImageComponentsContainerRef?.current?.children[0]?.children[component_index].classList).includes(
							"locations-surface-map-image-component-hovering-over"
						)
					) {
						surfaceMapImageComponentsContainerRef?.current?.children[0]?.children[component_index].classList.remove(
							"locations-surface-map-image-component-hovering-over"
						);
					}
					return true;
				});
		},
		[surfaceMapImageComponentsContainerRef, surfaceMapComponentsList, locations, currentMapLocationId]
	);

	const getDimensionsZoom = useCallback(() => {
		const width_zoom = window?.innerWidth / surfaceMapImageRef?.current?.clientWidth;
		const height_zoom = window?.innerHeight / surfaceMapImageRef?.current?.clientHeight;
		return { width_zoom, height_zoom };
	}, [surfaceMapImageRef]);

	const updatePointsForBounds = useCallback(() => {
		const max_mobile_width = 750;

		const { width_zoom, height_zoom } = getDimensionsZoom();
		zoom.current = Math.max(zoom.current, width_zoom, height_zoom);

		const imageContainerWidthDelta =
			((surfaceMapImageContainerRef?.current?.clientWidth - surfaceMapImageRef?.current?.clientWidth) * zoom.current) / 2;
		const max_pointX =
			window.innerWidth > max_mobile_width
				? surfaceMapImageRef?.current?.clientWidth * zoom.current - window.innerWidth - 1 * zoom.current
				: surfaceMapImageRef?.current?.clientWidth * zoom.current - window.innerWidth + imageContainerWidthDelta - 1 * zoom.current;

		const imageContainerHeightDelta =
			((surfaceMapImageContainerRef?.current?.clientHeight - surfaceMapImageRef?.current?.clientHeight) * zoom.current) / 2;
		const max_pointY =
			surfaceMapImageRef?.current?.clientHeight * zoom.current + imageContainerHeightDelta - window.innerHeight - 1 * zoom.current;

		// X Bounds
		if (pointX.current > 68 - 1 * zoom.current) pointX.current = 68 - 1 * zoom.current;
		if (window.innerWidth <= max_mobile_width && pointX.current > -imageContainerWidthDelta) pointX.current = -imageContainerWidthDelta;
		if (pointX.current < -max_pointX) pointX.current = -max_pointX;

		// Y Bounds
		if (pointY.current > -imageContainerHeightDelta - 1 * zoom.current) pointY.current = -imageContainerHeightDelta - 1 * zoom.current;
		if (pointY.current < -max_pointY && window.innerWidth > max_mobile_width) pointY.current = -max_pointY;
		if (window.innerWidth <= max_mobile_width && pointY.current < -max_pointY - 58) pointY.current = -max_pointY - 58;
	}, [getDimensionsZoom]);

	const currentLocationId = useRef(false);
	useEffect(() => {
		async function getLocationMapImage() {
			if (JSON.stringify(currentLocationId.current) === JSON.stringify(currentMapLocationId)) return false;
			if (locations?.length === 0) return false;
			currentLocationId.current = JSON.parse(JSON.stringify(currentMapLocationId));

			const mapImageID = locations?.find((e) => e?._id === currentMapLocationId)?.data?.mapImage;
			let mapImage = false;

			const recentImage = recentImages.current.find((e) => e?._id === mapImageID);
			if (recentImage?.image) {
				mapImage = recentImage;
			} else {
				const map_image_response = await APIRequest("/image/" + mapImageID, "GET");
				if (map_image_response?.errors || !map_image_response?.data?.image?.image) return false;
				mapImage = map_image_response?.data?.image;

				addImagesToRecentImages([mapImage]);
			}
			setTimeout(() => {
				try {
					// Minimum Zoom
					const { width_zoom, height_zoom } = getDimensionsZoom();
					zoom.current = Math.max(width_zoom, height_zoom);

					// Center X
					pointX.current = -(surfaceMapImageContainerRef?.current?.clientWidth - surfaceMapImageRef?.current?.clientWidth) * zoom.current;
					pointX.current =
						zoom.current === width_zoom
							? window.innerWidth > 750
								? 68 / 2
								: 0
							: -((surfaceMapImageContainerRef?.current?.clientWidth * zoom.current - window.innerWidth) / 2);

					// Center Y
					const imageContainerHeightDelta =
						((surfaceMapImageContainerRef?.current?.clientHeight - surfaceMapImageRef?.current?.clientHeight) * zoom.current) / 2;
					const max_pointY =
						surfaceMapImageRef?.current?.clientHeight * zoom.current +
						imageContainerHeightDelta -
						window.innerHeight -
						1 * zoom.current;
					pointY.current =
						window.innerWidth <= 750
							? -(max_pointY + 58 / 2)
							: -((surfaceMapImageContainerRef?.current?.clientHeight - surfaceMapImageRef?.current?.clientHeight) * zoom.current) /
							  2;

					// Set Initial Position and Zoom
					updatePointsForBounds();
					surfaceMapImageContainerRef.current.style.transform =
						"translate(" + pointX.current + "px, " + pointY.current + "px) scale(" + zoom.current + ")";
				} catch {}
			}, 100);

			setLocationMapImage(mapImage?.image);

			lastWindowWidth.current = window.innerWidth;

			setTimeout(() => {
				if (!surfaceMapImageComponentsContainerRef.current?.children) return false;

				const svg_width = surfaceMapImageComponentsContainerRef.current?.children[0].getAttribute("width");
				const image_width = surfaceMapImageRef?.current?.clientWidth;
				const image_height = surfaceMapImageRef?.current?.clientHeight;

				const max_component_width = Math.floor(image_width * (zoom.current / 1)) - 2;
				const max_component_height = Math.floor(image_height * (zoom.current / 1)) - 2;

				Array.from(surfaceMapImageComponentsContainerRef?.current?.children[0]?.children)?.map((path) => {
					let { width, height } = path.getClientRects()[0];
					width *= image_width / svg_width;
					height *= image_width / svg_width;

					path.classList.add("locations-surface-map-image-component");

					if (width > max_component_width && height > max_component_height) {
						path.classList.add("locations-surface-map-image-component-delete");
					} else if (JSON.stringify(path.getAttribute("fill")) !== JSON.stringify("rgb(255,255,255)")) {
						path.classList.add("locations-surface-map-image-component-delete");
					}

					return true;
				});
				Array.from(document.getElementsByClassName("locations-surface-map-image-component-delete")).map((path) => path.remove());

				Array.from(surfaceMapImageComponentsContainerRef?.current?.children[0]?.children)?.map((path, index) => {
					path.addEventListener("click", () => onClickMapComponent(index));
					path.addEventListener("mouseover", () => onMouseOverMapComponent(index));
					path.addEventListener("mouseout", () => onMouseOutMapComponent(index));
					return true;
				});

				const imageContainerWidthDelta =
					((surfaceMapImageContainerRef?.current?.clientWidth - surfaceMapImageRef?.current?.clientWidth) * zoom.current) / 2;
				let surfaceMapImageComponentsContainerStyles = [`scale: ${image_width / svg_width}`, `margin-top: -2px`];
				if (window?.innerWidth > 750)
					surfaceMapImageComponentsContainerStyles.push(`margin-left: ${-1 * (imageContainerWidthDelta * (1 / zoom.current) + 1.5)}px`);
				surfaceMapImageComponentsContainerRef.current.style = surfaceMapImageComponentsContainerStyles.join("; ");

				try {
					if (window?.innerWidth <= 750) {
						surfaceMapImageComponentsContainerRef.current.children[0].style = `margin-top: ${Math.exp((1 / window.innerWidth + 0.0007) * 480 )}px; margin-left: -0.5px`;
					} else {
						surfaceMapImageComponentsContainerRef.current.children[0].style = ``;
					}
				} catch {}
			}, 100);
		}
		getLocationMapImage();
	}, [
		locations,
		currentMapLocationId,
		setLocationMapImage,
		currentLocationId,
		APIRequest,
		recentImages,
		addImagesToRecentImages,
		surfaceMapImageRef,
		updatePointsForBounds,
		getDimensionsZoom,
		onClickMapComponent,
		onMouseOverMapComponent,
		onMouseOutMapComponent,
	]);

	window.addEventListener("resize", () => {
		const { width_zoom, height_zoom } = getDimensionsZoom();
		zoom.current = Math.max(zoom.current, width_zoom, height_zoom);
		updatePointsForBounds();
		if (surfaceMapImageContainerRef.current?.style) {
			surfaceMapImageContainerRef.current.style.transform =
				"translate(" + pointX.current + "px, " + pointY.current + "px) scale(" + zoom.current + ")";
		} else {
			setTimeout(() => {
				if (surfaceMapImageContainerRef.current?.style) {
					surfaceMapImageContainerRef.current.style.transform =
						"translate(" + pointX.current + "px, " + pointY.current + "px) scale(" + zoom.current + ")";
				}
			}, 2);
		}

		const imageContainerWidthDelta =
			((surfaceMapImageContainerRef?.current?.clientWidth - surfaceMapImageRef?.current?.clientWidth) * zoom.current) / 2;
		const svg_width = surfaceMapImageComponentsContainerRef?.current?.children?.[0]?.getAttribute("width");
		const image_width = surfaceMapImageRef?.current?.clientWidth;
		let surfaceMapImageComponentsContainerStyles = [`scale: ${image_width / svg_width}`, `margin-top: -2px`];
		if (window?.innerWidth > 750)
			surfaceMapImageComponentsContainerStyles.push(`margin-left: ${-1 * (imageContainerWidthDelta * (1 / zoom.current) + 1.5)}px`);
		surfaceMapImageComponentsContainerRef.current.style = surfaceMapImageComponentsContainerStyles.join("; ");

		try {
			if (window?.innerWidth <= 750) {
				surfaceMapImageComponentsContainerRef.current.children[0].style = `margin-top: ${Math.exp(
					(1 / window.innerWidth + 0.0007) * 480
				)}px; margin-left: -0.5px`;
			} else {
				surfaceMapImageComponentsContainerRef.current.children[0].style = ``;
			}
		} catch {}

		updatePointsForBounds();

		surfaceMapImageContainerRef.current.style.transform =
			"translate(" + pointX.current + "px, " + pointY.current + "px) scale(" + zoom.current + ")";
	});

	useEffect(() => {
		try {
			Array.from(surfaceMapImageComponentsContainerRef?.current?.children[0]?.children)?.map((path, index) => {
				if (selectedSurfaceMapComponents.includes(index)) path.classList.add("locations-surface-map-image-component-selected");
				return true;
			});
		} catch {}
	}, [selectedSurfaceMapComponents, surfaceMapImageComponentsContainerRef]);

	useEffect(() => {
		try {
			Array.from(surfaceMapImageComponentsContainerRef?.current?.children[0]?.children)?.map((path, index) => {
				let new_path = path.cloneNode(true);
				path.parentNode.replaceChild(new_path, path);
				if (isSelectingSurfaceMapComponents) new_path.addEventListener("click", () => onClickMapComponent(index));
				new_path.addEventListener("mouseover", () => onMouseOverMapComponent(index));
				new_path.addEventListener("mouseout", () => onMouseOutMapComponent(index));
				return true;
			});
		} catch {}
	}, [
		isSelectingSurfaceMapComponents,
		surfaceMapImageComponentsContainerRef,
		onClickMapComponent,
		onMouseOverMapComponent,
		onMouseOutMapComponent,
	]);

	useEffect(() => {
		const location = locations.find((e) => e?._id === currentMapLocationId);
		if (location) {
			try {
				setTimeout(() => {
					Array.from(surfaceMapImageComponentsContainerRef?.current?.children[0]?.children)?.map((path, index) => {
						if (surfaceMapComponentsList[index] === false || surfaceMapComponentsList[index] === undefined) {
							path.style = ``;
							path.classList.remove("locations-surface-map-image-component-in-region");
							return true;
						}
						const region = location?.data?.regions?.find((e) => e?._id === surfaceMapComponentsList[index]);
						path.style = `--regionColour: ${region?.colour}; --regionColourTint: ${getColourTint(region?.colour, 10)}`;
						path.classList.add("locations-surface-map-image-component-in-region");
						return true;
					});
				}, 200);
			} catch {}
		}
	}, [isSelectingSurfaceMapComponents, surfaceMapComponentsList, surfaceMapImageComponentsContainerRef, locations, currentMapLocationId]);

	useEffect(() => {
		zoom.current = 1;
		panning.current = false;
		pointX.current = 0;
		pointY.current = 0;

		const surfaceMapImageContainerRefCurrent = surfaceMapImageContainerRef.current;
		if (surfaceMapImageContainerRef?.current) {
			surfaceMapImageContainerRefCurrent.style.transform =
				"translate(" + pointX.current + "px, " + pointY.current + "px) scale(" + zoom.current + ")";
			surfaceMapImageContainerRefCurrent.addEventListener("mousedown", imageSurfaceMapOnMouseDown);
			surfaceMapImageContainerRefCurrent.addEventListener("mouseup", imageSurfaceMapOnMouseUp);
			surfaceMapImageContainerRefCurrent.addEventListener("mouseout", imageSurfaceMapOnMouseUp);
			surfaceMapImageContainerRefCurrent.addEventListener("mousemove", imageSurfaceMapOnMouseMove);
			surfaceMapImageContainerRefCurrent.addEventListener("wheel", imageSurfaceMapOnWheel);
		}
		return () => {
			if (surfaceMapImageContainerRefCurrent) {
				surfaceMapImageContainerRefCurrent.removeEventListener("mousedown", imageSurfaceMapOnMouseDown);
				surfaceMapImageContainerRefCurrent.removeEventListener("mouseup", imageSurfaceMapOnMouseUp);
				surfaceMapImageContainerRefCurrent.removeEventListener("mouseout", imageSurfaceMapOnMouseUp);
				surfaceMapImageContainerRefCurrent.removeEventListener("mousemove", imageSurfaceMapOnMouseMove);
				surfaceMapImageContainerRefCurrent.removeEventListener("wheel", imageSurfaceMapOnWheel);
			}
		};
		// eslint-disable-next-line
	}, [surfaceMapImageContainerRef, locationMapImage, zoom, panning, pointX, pointY]);

	function imageSurfaceMapOnMouseDown(e) {
		e.preventDefault();
		startPos = { x: e.clientX - pointX.current, y: e.clientY - pointY.current };
		panning.current = true;
		setIsPanning(true);
	}

	function imageSurfaceMapOnMouseUp() {
		panning.current = false;
		setIsPanning(false);
	}

	function imageSurfaceMapOnMouseMove(e) {
		e.preventDefault();
		if (!panning.current) return;
		pointX.current = e.clientX - startPos.x;
		pointY.current = e.clientY - startPos.y;

		updatePointsForBounds();

		surfaceMapImageContainerRef.current.style.transform =
			"translate(" + pointX.current + "px, " + pointY.current + "px) scale(" + zoom.current + ")";
	}

	var stopScrollTimeout = false;
	function imageSurfaceMapOnWheel(e) {
		e.stopPropagation();
		e.preventDefault();

		setIsScrolling(true);
		clearTimeout(stopScrollTimeout);
		stopScrollTimeout = setTimeout(() => setIsScrolling(false), 500);

		const prev_pointX = JSON.parse(JSON.stringify(pointX.current));
		const prev_pointY = JSON.parse(JSON.stringify(pointY.current));
		const prev_zoom = JSON.parse(JSON.stringify(zoom.current));

		let xs = (e.clientX - pointX.current) / zoom.current;
		let ys = (e.clientY - pointY.current) / zoom.current;
		let delta = e.wheelDelta ? e.wheelDelta : -e.deltaY;

		if (Math.sign(delta) === 1) {
			zoom.current *= 1.2;
		} else {
			zoom.current /= 1.2;
		}

		setIsImagePixelated(zoom.current > 3);

		const max_zoom = (1 / window.innerWidth) * 40000;
		if (zoom.current <= 1) {
			zoom.current = 1;
			pointX.current = -(surfaceMapImageContainerRef?.current?.clientWidth - surfaceMapImageRef?.current?.clientWidth) * zoom.current;
			pointY.current = 0;
		} else if (zoom.current >= max_zoom) {
			zoom.current = max_zoom;
			pointX.current = e.clientX - xs * zoom.current;
			pointY.current = e.clientY - ys * zoom.current;
		} else {
			pointX.current = e.clientX - xs * zoom.current;
			pointY.current = e.clientY - ys * zoom.current;
		}

		const { width_zoom, height_zoom } = getDimensionsZoom();

		zoom.current = Math.max(zoom.current, width_zoom, height_zoom);

		updatePointsForBounds();

		if (zoom.current === Math.max(width_zoom, height_zoom) && prev_zoom <= zoom.current) {
			pointX.current = prev_pointX;
			pointY.current = prev_pointY;
		}

		updatePointsForBounds();

		surfaceMapImageContainerRef.current.style.transform =
			"translate(" + pointX.current + "px, " + pointY.current + "px) scale(" + zoom.current + ")";

		updateRegionsNames();
	}

	function onMovementBoxWheel() {
		leaveMovementBox();
		setTimeout(() => leaveMovementBox(), 1);

		setIsScrolling(true);
		clearTimeout(stopScrollTimeout);
		stopScrollTimeout = setTimeout(() => setIsScrolling(false), 500);
	}

	const surfaceMapContainerRef = useRef();

	useEffect(() => {
		function onGesture(e) {
			e.preventDefault();
			e.stopPropagation();
			document.body.style.zoom = 0.99;
		}

		const surfaceMapContainerRefCurrent = surfaceMapContainerRef?.current;
		if (surfaceMapContainerRefCurrent) {
			surfaceMapContainerRefCurrent.addEventListener("gesturestart", onGesture);
			surfaceMapContainerRefCurrent.addEventListener("gesturechange", onGesture);
			surfaceMapContainerRefCurrent.addEventListener("gestureend", onGesture);
		}

		return () => {
			if (surfaceMapContainerRefCurrent) {
				surfaceMapContainerRefCurrent.removeEventListener("gesturestart", onGesture);
				surfaceMapContainerRefCurrent.removeEventListener("gesturechange", onGesture);
				surfaceMapContainerRefCurrent.removeEventListener("gestureend", onGesture);
			}
		};
	}, [surfaceMapContainerRef, surfaceMapImageContainerRef]);

	let prevDist = useRef(false);
	// eslint-disable-next-line
	const [points, setPoints] = useState(false);
	let startCoords = useRef({ centerX: false, centerY: false });

	function onTouchStart(e) {
		e.stopPropagation();

		if (e.touches.length === 1) {
			startPos = { x: e.touches[0].pageX - pointX.current, y: e.touches[0].pageY - pointY.current };
		} else if (e.touches.length === 2) {
			startPos = { x: e.touches[0].pageX - pointX.current, y: e.touches[0].pageY - pointY.current };
			prevDist.current = false;
			startCoords.centerX = Math.min(e.touches[0].pageX, e.touches[1].pageX) + Math.abs(e.touches[0].pageX - e.touches[1].pageX) / 2;
			startCoords.centerY = Math.min(e.touches[0].pageY, e.touches[1].pageY) + Math.abs(e.touches[0].pageY - e.touches[1].pageY) / 2;
		} else {
			startPos = { x: e.touches[0].pageX - pointX.current, y: e.touches[0].pageY - pointY.current };
		}
	}

	function onTouchMove(e) {
		if (e.touches.length === 1) {
			const newPointX = e.touches[0].pageX - startPos.x;
			const newPointY = e.touches[0].pageY - startPos.y;
			if (Number.isNaN(newPointX) || Number.isNaN(newPointY)) return;
			pointX.current = newPointX;
			pointY.current = newPointY;
		} else if (e.touches.length === 2) {
			const prev_pointX = JSON.parse(JSON.stringify(pointX.current));
			const prev_pointY = JSON.parse(JSON.stringify(pointY.current));
			const prev_zoom = JSON.parse(JSON.stringify(zoom.current));

			let xs = (startCoords.centerX - pointX.current) / zoom.current;
			let ys = (startCoords.centerY - pointY.current) / zoom.current;

			let dist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);

			if (prevDist.current === false) prevDist.current = dist;

			let diffDist = prevDist.current - dist;

			zoom.current -= diffDist * zoom.current * 0.006;
			setIsImagePixelated(zoom.current > 3);

			const width_zoom = window?.innerWidth / surfaceMapImageRef?.current?.clientWidth;
			const height_zoom = window?.innerHeight / surfaceMapImageRef?.current?.clientHeight;

			if (zoom.current <= 1) {
				zoom.current = Math.max(1, width_zoom, height_zoom);
				pointX.current = 0;
				pointY.current = 0;
			} else if (zoom.current >= 50) {
				zoom.current = 50;
				pointX.current = startCoords.centerX - xs * zoom.current;
				pointY.current = startCoords.centerY - ys * zoom.current;
			} else {
				pointX.current = startCoords.centerX - xs * zoom.current;
				pointY.current = startCoords.centerY - ys * zoom.current;
			}

			if (zoom.current === Math.max(width_zoom, height_zoom) && prev_zoom <= zoom.current) {
				pointX.current = prev_pointX;
				pointY.current = prev_pointY;
			}

			setPoints({ pointX: pointX.current, pointY: pointY.current });

			prevDist.current = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);

			updateRegionsNames();
		}

		updatePointsForBounds();

		surfaceMapImageContainerRef.current.style.transform =
			"translate(" + pointX.current + "px, " + pointY.current + "px) scale(" + zoom.current + ")";
	}

	var movementInterval = useRef(false);
	function enterMovementBox(delta_x, delta_y) {
		movementInterval.current = setInterval(() => {
			const max_zoom_multiplier = 15;
			pointX.current += -delta_x * Math.min(max_zoom_multiplier, zoom.current * 1.5);
			pointY.current += -delta_y * Math.min(max_zoom_multiplier, zoom.current * 1.5);

			updatePointsForBounds();

			surfaceMapImageContainerRef.current.style.transform =
				"translate(" + pointX.current + "px, " + pointY.current + "px) scale(" + zoom.current + ")";
		}, 1);
	}

	function leaveMovementBox() {
		if (movementInterval.current !== false) {
			clearInterval(movementInterval.current);
			movementInterval.current = false;
		}
	}

	const [surfaceMapImageComponentsStyles, setSurfaceMapImageComponentsStyles] = useState({});
	useEffect(() => {
		let newSurfaceMapImageComponentsStyles = {};
		const region = locations
			?.find((e) => e?._id === currentMapLocationId)
			?.data?.regions?.find((e) => e?._id === regionSelectingSurfaceMapComponentsFor);
		if (region?.colour) newSurfaceMapImageComponentsStyles["--regionSelectingForColour"] = region?.colour;
		setSurfaceMapImageComponentsStyles(newSurfaceMapImageComponentsStyles);
	}, [setSurfaceMapImageComponentsStyles, regionSelectingSurfaceMapComponentsFor, locations, currentMapLocationId]);

	const getCoordsOfPath = useCallback((component) => {
		const offset = 8;
		let min_x = -1;
		let max_x = -1;
		let min_y = -1;
		let max_y = -1;

		let path = component?.getAttribute("d");
		["M", "L", "H", "V", "C", "S", "Q", "T", "A", "Z"]?.map((char) => {
			path = path.replaceAll(char, "<>");
			return true;
		});
		path.split("<>")
			.filter((e) => e.length !== 0)
			.map((data) => {
				data = data.trim();

				if (data?.split(" ").length >= 2) {
					if (min_x === -1) min_x = parseFloat(data?.split(" ")[0]);
					if (max_x === -1) max_x = parseFloat(data?.split(" ")[0]);
					if (min_y === -1) min_y = parseFloat(data?.split(" ")[1]);
					if (max_y === -1) max_y = parseFloat(data?.split(" ")[1]);
				}

				if (data?.split(" ").length === 2) {
					if (min_x > parseFloat(data?.split(" ")[0])) min_x = parseFloat(data?.split(" ")[0]);
					if (min_y > parseFloat(data?.split(" ")[1])) min_y = parseFloat(data?.split(" ")[1]);

					if (max_x < parseFloat(data?.split(" ")[0])) max_x = parseFloat(data?.split(" ")[0]);
					if (max_y < parseFloat(data?.split(" ")[1])) max_y = parseFloat(data?.split(" ")[1]);
				} else if (data?.split(" ").length === 4) {
					if (min_x > parseFloat(data?.split(" ")[0])) min_x = parseFloat(data?.split(" ")[0]);
					if (min_y > parseFloat(data?.split(" ")[1])) min_y = parseFloat(data?.split(" ")[1]);
					if (min_x > parseFloat(data?.split(" ")[2])) min_x = parseFloat(data?.split(" ")[2]);
					if (min_y > parseFloat(data?.split(" ")[3])) min_y = parseFloat(data?.split(" ")[3]);

					if (max_x < parseFloat(data?.split(" ")[0])) max_x = parseFloat(data?.split(" ")[0]);
					if (max_y < parseFloat(data?.split(" ")[1])) max_y = parseFloat(data?.split(" ")[1]);
					if (max_x < parseFloat(data?.split(" ")[2])) max_x = parseFloat(data?.split(" ")[2]);
					if (max_y < parseFloat(data?.split(" ")[3])) max_y = parseFloat(data?.split(" ")[3]);
				}

				return true;
			});

		min_x -= offset;
		max_x += offset;
		min_y -= offset;
		max_y += offset;

		return [
			[min_x, min_y],
			[max_x, min_y],
			[min_x, max_y],
			[max_x, max_y],
		];
	}, []);

	const getDistanceBetweenTwoComponents = useCallback(
		(component1, component2) => {
			let distance = -1;

			const box_1_coords = getCoordsOfPath(component1);
			const box_2_coords = getCoordsOfPath(component2);

			const isOverlapping =
				box_1_coords
					?.map((coord) => {
						const isInA = coord[0] >= box_2_coords[0][0] && coord[1] >= box_2_coords[0][1];
						const isInB = coord[0] <= box_2_coords[1][0] && coord[1] >= box_2_coords[1][1];
						const isInC = coord[0] >= box_2_coords[2][0] && coord[1] <= box_2_coords[2][1];
						const isInD = coord[0] <= box_2_coords[3][0] && coord[1] <= box_2_coords[3][1];
						return isInA && isInB && isInC && isInD;
					})
					.concat(
						box_2_coords?.map((coord) => {
							const isInA = coord[0] >= box_1_coords[0][0] && coord[1] >= box_1_coords[0][1];
							const isInB = coord[0] <= box_1_coords[1][0] && coord[1] >= box_1_coords[1][1];
							const isInC = coord[0] >= box_1_coords[2][0] && coord[1] <= box_1_coords[2][1];
							const isInD = coord[0] <= box_1_coords[3][0] && coord[1] <= box_1_coords[3][1];
							return isInA && isInB && isInC && isInD;
						})
					)
					.filter((e) => e === true).length !== 0;

			if (isOverlapping) return 1;

			const horizontal_line_possible =
				box_1_coords
					?.map((coord) => {
						return coord[1] >= box_2_coords[0][1] && coord[1] <= box_2_coords[2][1];
					})
					.concat(
						box_2_coords?.map((coord) => {
							return coord[1] >= box_1_coords[0][1] && coord[1] <= box_1_coords[2][1];
						})
					)
					.filter((e) => e === true).length !== 0;

			const vertical_line_possible =
				box_1_coords
					?.map((coord) => {
						return coord[0] >= box_2_coords[0][0] && coord[0] <= box_2_coords[1][0];
					})
					.concat(
						box_2_coords?.map((coord) => {
							return coord[0] >= box_1_coords[0][0] && coord[0] <= box_1_coords[1][0];
						})
					)
					.filter((e) => e === true).length !== 0;

			let dist_x = -1;
			let dist_y = -1;

			if (horizontal_line_possible)
				dist_x = Math.min(Math.abs(box_1_coords[0][0] - box_2_coords[1][0]), Math.abs(box_2_coords[0][0] - box_1_coords[1][0]));
			if (vertical_line_possible)
				dist_y = Math.min(Math.abs(box_1_coords[0][1] - box_2_coords[2][1]), Math.abs(box_2_coords[0][1] - box_1_coords[2][1]));

			distance = dist_x === -1 && dist_y === -1 ? -1 : Math.min(...[dist_x, dist_y].filter((e) => e !== -1));

			if (!horizontal_line_possible && !vertical_line_possible) {
				// Get closest corners
				const corner_distances = box_1_coords?.map((coords1) => {
					return box_2_coords?.map((coords2) => {
						return Math.hypot(Math.abs(coords1[0] - coords2[0]), Math.abs(coords1[1] - coords2[1]));
					});
				});
				distance = Math.min(...corner_distances?.map((arr) => Math.min(...arr)));
			}

			return distance / zoom.current;
		},
		[zoom, getCoordsOfPath]
	);

	const getDistancesBetweenComponents = useCallback(() => {
		try {
			let distances = [];

			Array.from(surfaceMapImageComponentsContainerRef?.current?.children[0]?.children)?.map((_, index) => {
				distances.push([]);
				Array.from(surfaceMapImageComponentsContainerRef?.current?.children[0]?.children)?.map((_, index) => {
					distances[distances.length - 1].push(0);
					return true;
				});
				return true;
			});

			distances = distances.map((array, i) => {
				return array.map((_, j) => {
					if (i === j) return 0;
					return getDistanceBetweenTwoComponents(
						surfaceMapImageComponentsContainerRef?.current?.children[0]?.children[i],
						surfaceMapImageComponentsContainerRef?.current?.children[0]?.children[j]
					);
				});
			});

			return distances;
		} catch {
			return false;
		}
	}, [surfaceMapImageComponentsContainerRef, getDistanceBetweenTwoComponents]);

	const createRegionsNames = useCallback(async () => {
		const location = locations.find((e) => e?._id === currentLocationId?.current);

		const newRegionsNamesTexts = regionClusters.current
			?.map((region_clusters) => {
				const region = location?.data?.regions?.find((e) => e?._id === region_clusters?.region);
				return `<div>${region?.name}</div>`;
			})
			.join("");

		setRegionNamesTexts(newRegionsNamesTexts);

		await new Promise((resolve) => setTimeout(resolve, 2));

		const regionsNamesTexts = Array.from(surfaceMapImageRegionsNamesTextsRef.current.children);

		const image_width = parseFloat(surfaceMapImageRef?.current?.clientWidth);
		const svg_width = parseFloat(surfaceMapImageComponentsContainerRef.current?.children[0].getAttribute("width"));
		const frame_multiplier = image_width / svg_width;

		let new_region_names_html = ``;

		regionClusters.current?.map((region_clusters, region_index) => {
			const region = location?.data?.regions?.find((e) => e?._id === region_clusters?.region);
			region_clusters?.clusters?.map((cluster) => {
				let [a, b, c] = cluster.box;
				a = a.map((e) => e * frame_multiplier);
				b = b.map((e) => e * frame_multiplier);
				c = c.map((e) => e * frame_multiplier);

				const regionNamesTextBox = regionsNamesTexts[region_index]?.getBoundingClientRect();

				const full_width = Math.ceil(b[0] - a[0]);
				const full_height = Math.ceil(c[1] - a[1]);

				let text_svg_width = 0;
				let text_svg_height = 0;
				if (full_width >= full_height) {
					text_svg_width = full_width;
					text_svg_height = full_width * (regionNamesTextBox?.height / regionNamesTextBox?.width);
				} else {
					text_svg_width = full_height * (regionNamesTextBox?.width / regionNamesTextBox?.height);
					text_svg_height = full_height;
				}

				new_region_names_html += `
					<div 
						class='locations-surface-map-image-region-name'
						style="top: ${a[1]}px; left: ${Math.ceil(a[0])}px;width: ${full_width}px; height: ${full_height}px;"
						data-box-a="${cluster.box[0]}"
						data-box-b="${cluster.box[1]}"
						data-box-c="${cluster.box[2]}"
						data-region-index="${region_index}"
					>
						<svg
							viewBox='0 0 ${text_svg_width} ${text_svg_height}'
							style='overflow: visible; width: 100%; font-size: ${Math.max(
								4 / zoom.current,
								Math.min(26 / zoom.current, 5.5 * zoom.current * (text_svg_height / regionNamesTextBox?.height))
							)}px'
							dominant-baseline="middle" text-anchor="middle"
						>
							<text x='50%' y='50%' style='fill: #fff; letter-spacing: ${Math.min(60, 5 * (text_svg_height / regionNamesTextBox?.height))}px'>
								${region?.name}
							</text>
						</svg>
					</div>`;

				return true;
			});
			return true;
		});

		setRegionNamesHTML(new_region_names_html);
	}, [locations]);

	const updateRegionsNames = useCallback(async () => {
		const image_width = parseFloat(surfaceMapImageRef?.current?.clientWidth);
		const svg_width = parseFloat(surfaceMapImageComponentsContainerRef.current?.children[0].getAttribute("width"));
		const frame_multiplier = image_width / svg_width;

		const regionsNamesTexts = Array.from(surfaceMapImageRegionsNamesTextsRef.current.children);

		Array.from(surfaceMapImageRegionsNamesRef?.current?.children)?.map((name_div) => {
			const a = name_div?.getAttribute("data-box-a").split(",")?.map((e) => parseFloat(e) * frame_multiplier);
			const b = name_div?.getAttribute("data-box-b").split(",")?.map((e) => parseFloat(e) * frame_multiplier);
			const c = name_div?.getAttribute("data-box-c").split(",")?.map((e) => parseFloat(e) * frame_multiplier);
			const region_index = parseFloat(name_div?.getAttribute("data-region-index"))
			
			const regionNamesTextBox = regionsNamesTexts[region_index]?.getBoundingClientRect();

			const full_width = Math.ceil(b[0] - a[0]);
			const full_height = Math.ceil(c[1] - a[1]);

			let text_svg_width = 0;
			let text_svg_height = 0;
			if (full_width >= full_height) {
				text_svg_width = full_width;
				text_svg_height = full_width * (regionNamesTextBox?.height / regionNamesTextBox?.width);
			} else {
				text_svg_width = full_height * (regionNamesTextBox?.width / regionNamesTextBox?.height);
				text_svg_height = full_height;
			}

			name_div.style = `top: ${a[1]}px; left: ${Math.ceil(a[0])}px;width: ${full_width}px; height: ${full_height}px;`;
			name_div.children[0].style = `overflow: visible; width: 100%; font-size: ${Math.max(
				4,
				Math.min(26, 5.5 * zoom.current * (text_svg_height / regionNamesTextBox?.height))
			)}px`;
			name_div.children[0].setAttribute("viewBox", `0 0 ${text_svg_width} ${text_svg_height}`);
			name_div.children[0].children[0].style = `fill: #fff; letter-spacing: ${Math.min(60, 5 * (text_svg_height / regionNamesTextBox?.height))}px`;
		
			return true;
		})
	}, [surfaceMapImageRegionsNamesRef]);

	window.addEventListener("resize", () => {
		updateRegionsNames();
		setTimeout(() => updateRegionsNames(), 10);
	});

	useEffect(() => {
		function getClosestCluster(cluster, clusters, distances) {
			return clusters
				?.map((e, cluster_index) => {
					if (e === false) return false;
					if (JSON.stringify(cluster) === JSON.stringify(e)) return false;
					return {
						cluster_index,
						min_dist: Math.min(...e?.map((node) => Math.min(...cluster?.map((cluster_node) => distances[cluster_node][node])))),
					};
				})
				.filter((e) => e !== false && e.min_dist !== -1)
				.sort((a, b) => a.min_dist - b.min_dist)?.[0];
		}

		function updateRegionNamesOnMap() {
			const location = locations.find((e) => e?._id === currentLocationId?.current);

			// Get Distances Between Components
			const distances = getDistancesBetweenComponents();
			if (!distances) return false;

			// Create Clusters of Components for Each Region
			let regions_clusters = [];
			location?.data?.regions?.map((region, region_index) => {
				regions_clusters.push({ region: region?._id, clusters: [[region?.components[0]]] });
				regions_clusters[region_index].clusters = region?.components.map((e) => [e]);

				const max_distance = 25;
				let noChangesCount = 0;
				while (noChangesCount < 2) {
					noChangesCount += 1;

					for (let i = 0; i < regions_clusters[region_index].clusters.length; i++) {
						const closest_cluster = getClosestCluster(
							regions_clusters[region_index].clusters[i],
							regions_clusters[region_index].clusters,
							distances
						);

						if (closest_cluster && closest_cluster.min_dist <= max_distance) {
							noChangesCount = 0;

							// Fuse clusters
							regions_clusters[region_index].clusters[closest_cluster?.cluster_index] = regions_clusters[region_index].clusters[
								closest_cluster?.cluster_index
							].concat(regions_clusters[region_index].clusters[i]);

							regions_clusters[region_index].clusters[i] = false;
							regions_clusters[region_index].clusters = regions_clusters[region_index].clusters.filter((e) => e !== false);
							break;
						}
					}
				}
				return true;
			});

			regions_clusters = regions_clusters?.map((region_clusters) => {
				region_clusters.clusters = region_clusters?.clusters?.map((cluster) => {
					let min_x = -1;
					let max_x = -1;
					let min_y = -1;
					let max_y = -1;

					cluster?.map((cluster_index, index) => {
						const coords = getCoordsOfPath(surfaceMapImageComponentsContainerRef.current.children[0].children[cluster_index]);
						if (index === 0) {
							min_x = coords[0][0];
							max_x = coords[3][0];
							min_y = coords[0][1];
							max_y = coords[3][1];
						} else {
							if (min_x > coords[0][0]) min_x = coords[0][0];
							if (max_x < coords[3][0]) max_x = coords[3][0];
							if (min_y > coords[0][1]) min_y = coords[0][1];
							if (max_y < coords[3][1]) max_y = coords[3][1];
						}
						return true;
					});

					return {
						nodes: cluster,
						box: [
							[min_x, min_y],
							[max_x, min_y],
							[min_x, max_y],
							[max_x, max_y],
						],
					};
				});
				return region_clusters;
			});

			regionClusters.current = regions_clusters;

			createRegionsNames();
		}

		setTimeout(() => updateRegionNamesOnMap(), 100);
	}, [getDistancesBetweenComponents, locations, currentLocationId, getCoordsOfPath, createRegionsNames]);

	return {
		locations,
		currentMapLocationId,
		surfaceMapContainerRef,
		surfaceMapImageContainerRef,
		surfaceMapImageRef,
		surfaceMapImageComponentsContainerRef,
		surfaceMapImageRegionsNamesRef,
		surfaceMapImageRegionsNamesTextsRef,
		locationMapImage,
		onTouchStart,
		onTouchMove,
		isImagePixelated,
		enterMovementBox,
		leaveMovementBox,
		isPanning,
		isScrolling,
		isSelectingSurfaceMapComponents,
		surfaceMapImageComponentsStyles,
		onMovementBoxWheel,
		selectedLocationId,
		setSelectedLocationId,
		setIsDisplayingHierarchy,
		regionNamesHTML,
		regionNamesTexts,
	};
};
