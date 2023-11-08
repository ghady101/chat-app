import { useContext } from 'react';
import { Alert, Button, Form, Row, Col, Stack } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
	const {
		registerInfo,
		updateRegister,
		registerUser,
		registerLoading,
		registerError,
	} = useContext(AuthContext);
	return (
		<>
			<Form onSubmit={registerUser}>
				<Row
					style={{
						height: '100vh',
						justifyContent: 'center',
						paddingTop: '10%',
					}}>
					<Col sm={6}>
						<Stack gap={3}>
							<h2>Register</h2>
							<Form.Control
								type='text'
								placeholder='Name'
								onChange={(e) => {
									updateRegister({ ...registerInfo, name: e.target.value });
								}}
							/>
							<Form.Control
								type='text'
								placeholder='Email'
								onChange={(e) => {
									updateRegister({ ...registerInfo, email: e.target.value });
								}}
							/>
							<Form.Control
								type='password'
								placeholder='Password'
								onChange={(e) => {
									updateRegister({ ...registerInfo, password: e.target.value });
								}}
							/>

							<Button variant='primary' type='submit'>
								{registerLoading ? 'Creating your account...' : 'Register'}
							</Button>

							{registerError?.error && (
								<Alert variant='danger'>
									<p>{registerError?.message}</p>
								</Alert>
							)}
						</Stack>
					</Col>
				</Row>
			</Form>
		</>
	);
};

export default Register;
