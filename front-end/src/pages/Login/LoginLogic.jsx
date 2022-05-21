// Packages
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

// Components

// Logic

// Context
import { APIContext } from "../../context/APIContext";

// Services

// Styles

// Assets

export const LoginLogic = () => {
	// Username
	const [username, setUsername] = useState("");

	function changeUsername(e) {
		setUsername(e.target.value);
	}

	// Password
	const [password, setPassword] = useState("");

	function changePassword(e) {
		setPassword(e.target.value);
	}

	// Submit
	const { APIRequest, setToken } = useContext(APIContext);
	const [errors, setErrors] = useState([]);
	let navigate = useNavigate();

	const submitLoginUser = async () => {
		setErrors([]);
		const response = await APIRequest("/user/login", "POST", { username, password });
		console.log(response);
		if (response.errors) return setErrors(response.errors);
		if (response?.data?.token) {
			setToken(response.data.token);
			navigate("/profile");
		}
	};

	return { username, changeUsername, password, changePassword, errors, submitLoginUser };
};