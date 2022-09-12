// Packages
import { useContext, useRef, useEffect } from "react";

// Components

// Logic

// Context
import { LightboxContext } from "../../context/LightboxContext";

// Services

// Styles

// Assets

export const LightboxLogic = () => {
	const { lightboxImageIDs, setLightboxImageIDs, lightboxImages, setLightboxImages, lightboxIndex, setLightboxIndex } =
		useContext(LightboxContext);

	function incrementLightboxIndex(e) {
		e.stopPropagation();
		setLightboxIndex((oldLightboxIndex) => (oldLightboxIndex - 1 < 0 ? 0 : oldLightboxIndex - 1));
	}

	function decrementLightboxIndex(e) {
		e.stopPropagation();
		setLightboxIndex((oldLightboxIndex) =>
			oldLightboxIndex + 1 > lightboxImages.length - 1 ? lightboxImages.length - 1 : oldLightboxIndex + 1
		);
	}

	function closeLightbox() {
		setLightboxImageIDs([]);
		setLightboxImages([]);
		setLightboxIndex(0);
	}

	const lightBoxImageContainerRef = useRef();
	var zoom = useRef(1);
	var panning = useRef(false);
	var pointX = useRef(0);
	var pointY = useRef(0);
	var startPos = useRef({ x: 0, y: 0 });

	useEffect(() => {
		zoom.current = 1;
		panning.current = false;
		pointX.current = 0;
		pointY.current = 0;

		const lightBoxImageContainerRefCurrent = lightBoxImageContainerRef.current;
		if (lightBoxImageContainerRef?.current) {
			lightBoxImageContainerRefCurrent.style.transform =
				"translate(" + pointX.current + "px, " + pointY.current + "px) scale(" + zoom.current + ")";
			lightBoxImageContainerRefCurrent.addEventListener("mousedown", imageLightBoxOnMouseDown);
			lightBoxImageContainerRefCurrent.addEventListener("mouseup", imageLightBoxOnMouseUp);
			lightBoxImageContainerRefCurrent.addEventListener("mouseout", imageLightBoxOnMouseUp);
			lightBoxImageContainerRefCurrent.addEventListener("mousemove", imageLightBoxOnMouseMove);
			lightBoxImageContainerRefCurrent.addEventListener("wheel", imageLightBoxOnWheel);
		}
		return () => {
			if (lightBoxImageContainerRefCurrent) {
				lightBoxImageContainerRefCurrent.removeEventListener("mousedown", imageLightBoxOnMouseDown);
				lightBoxImageContainerRefCurrent.removeEventListener("mouseup", imageLightBoxOnMouseUp);
				lightBoxImageContainerRefCurrent.removeEventListener("mouseout", imageLightBoxOnMouseUp);
				lightBoxImageContainerRefCurrent.removeEventListener("mousemove", imageLightBoxOnMouseMove);
				lightBoxImageContainerRefCurrent.removeEventListener("wheel", imageLightBoxOnWheel);
			}
		};
	}, [lightBoxImageContainerRef, lightboxImages, lightboxIndex, zoom, panning, pointX, pointY]);

	function imageLightBoxOnMouseDown(e) {
		e.preventDefault();
		startPos = { x: e.clientX - pointX.current, y: e.clientY - pointY.current };
		panning.current = true;
	}

	function imageLightBoxOnMouseUp() {
		panning.current = false;
	}

	function imageLightBoxOnMouseMove(e) {
		e.preventDefault();
		if (!panning.current) return;
		pointX.current = e.clientX - startPos.x;
		pointY.current = e.clientY - startPos.y;
		lightBoxImageContainerRef.current.style.transform =
			"translate(" + pointX.current + "px, " + pointY.current + "px) scale(" + zoom.current + ")";
	}

	function imageLightBoxOnWheel(e) {
		e.stopPropagation();
		e.preventDefault();

		let xs = (e.clientX - pointX.current) / zoom.current;
		let ys = (e.clientY - pointY.current) / zoom.current;
		let delta = e.wheelDelta ? e.wheelDelta : -e.deltaY;

		if (Math.sign(delta) === 1) {
			zoom.current *= 1.2;
		} else {
			zoom.current /= 1.2;
		}

		if (zoom.current <= 1) {
			zoom.current = 1;
			pointX.current = 0;
			pointY.current = 0;
		} else if (zoom.current >= 40) {
			zoom.current = 40;
			pointX.current = e.clientX - xs * zoom.current;
			pointY.current = e.clientY - ys * zoom.current;
		} else {
			pointX.current = e.clientX - xs * zoom.current;
			pointY.current = e.clientY - ys * zoom.current;
			lightBoxImageContainerRef.current.style.transform =
				"translate(" + pointX.current + "px, " + pointY.current + "px) scale(" + zoom.current + ")";
		}

		lightBoxImageContainerRef.current.style.transform =
			"translate(" + pointX.current + "px, " + pointY.current + "px) scale(" + zoom.current + ")";
	}

	return {
		lightboxImageIDs,
		lightboxImages,
		lightboxIndex,
		incrementLightboxIndex,
		decrementLightboxIndex,
		closeLightbox,
		lightBoxImageContainerRef,
	};
};
