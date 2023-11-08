import { useContext } from 'react';
import { Alert, Button, Form, Row, Col, Stack } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
	const { loginInfo, updateLogin, loginUser, loginLoading, loginError } =
		useContext(AuthContext);

	return (
		<>
			<Form onSubmit={loginUser}>
				<Row
					style={{
						height: '100vh',
						justifyContent: 'center',
						paddingTop: '10%',
					}}>
					<Col sm={6}>
						<Stack gap={3}>
							<h2>Login</h2>
							<Form.Control
								type='text'
								placeholder='Email'
								onChange={(e) =>
									updateLogin({ ...loginInfo, email: e.target.value })
								}
							/>
							<Form.Control
								type='password'
								placeholder='Password'
								onChange={(e) =>
									updateLogin({ ...loginInfo, password: e.target.value })
								}
							/>
							<Button variant='primary' type='submit'>
								{loginLoading ? 'Getting you in...' : 'Login'}
							</Button>

							{loginError?.error && (
								<Alert variant='danger'>
									<p>{loginError?.message}</p>
								</Alert>
							)}
						</Stack>
					</Col>
				</Row>
			</Form>
		</>
	);
};

export default Login;
