import { createContext, useCallback, useEffect, useState } from 'react';
import { baseUrl, getRequest, postRequest } from '../utils/services';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	const [registerError, setRegisterError] = useState(null);
	const [loginError, setLoginError] = useState(null);

	const [loginLoading, setLoginLoading] = useState(false);
	const [registerLoading, setRegisterLoading] = useState(false);

	const [registerInfo, setRegisterInfo] = useState({
		name: '',
		email: '',
		password: '',
	});
	const [loginInfo, setLoginInfo] = useState({
		email: '',
		password: '',
	});

	console.log('user', user);
	console.log('login info: ', loginInfo);

	useEffect(() => {
		const user = localStorage.getItem('User');
		setUser(JSON.parse(user));
	}, []);

	const updateRegister = useCallback((info) => {
		setRegisterInfo(info);
		// aw hk
		// const newRegisterInfo = {
		// 	...registerInfo,
		// 	...info,
		// };

		// setRegisterInfo(newRegisterInfo);
	}, []);

	const updateLogin = useCallback((info) => {
		setLoginInfo(info);
		// aw hk
		// const newRegisterInfo = {
		// 	...registerInfo,
		// 	...info,
		// };

		// setRegisterInfo(newRegisterInfo);
	}, []);

	const registerUser = useCallback(
		async (e) => {
			e.preventDefault();
			setRegisterLoading(true);
			setRegisterError(null);

			const response = await postRequest(
				`${baseUrl}/users/register`,
				JSON.stringify(registerInfo)
			);

			setRegisterLoading(false);

			if (response.error) {
				return setRegisterError(response);
			}

			localStorage.setItem('User', JSON.stringify(response));
			setUser(response);
		},
		[registerInfo]
	);

	const logoutUser = useCallback(async () => {
		localStorage.removeItem('User');
		setUser(null);
	}, []);

	const loginUser = useCallback(
		async (e) => {
			e.preventDefault();
			setLoginLoading(true);
			setLoginError(null);

			const response = await postRequest(
				`${baseUrl}/users/login`,
				JSON.stringify(loginInfo)
			);

			setLoginLoading(false);

			if (response.error) {
				return setLoginError(response);
			}

			localStorage.setItem('User', JSON.stringify(response));
			setUser(response);
		},
		[loginInfo]
	);

	return (
		<AuthContext.Provider
			value={{
				user,
				registerLoading,
				registerError,
				registerInfo,
				loginInfo,
				loginError,
				loginLoading,
				updateRegister,
				updateLogin,
				registerUser,
				loginUser,
				logoutUser,
			}}>
			{children}
		</AuthContext.Provider>
	);
};
