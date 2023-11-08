import { useContext } from 'react';
import { Container, Nav, Navbar, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Notifications from './chat/Notifications';

const NavBar = () => {
	const { user, logoutUser } = useContext(AuthContext);
	return (
		<Navbar bg='dark' className='mb-4' style={{ height: '3.75rem' }}>
			<Container>
				<h2>
					<Link className='link-light text-decoration-none' to='/'>
						Chat App
					</Link>
				</h2>

				{user && (
					<span className='text-warning'>Logged in as {user?.name}</span>
				)}

				<Nav>
					<Stack direction='horizontal' gap={3}>
						{!user ? (
							<>
								<Link className='link-light text-decoration-none' to='/login'>
									Login
								</Link>
								<Link
									className='link-light text-decoration-none'
									to='/register'>
									Register
								</Link>
							</>
						) : (
							<>
								<Notifications />
								<Link
									onClick={() => logoutUser()}
									className='link-light text-decoration-none'
									to='/login'>
									logout
								</Link>
							</>
						)}
					</Stack>
				</Nav>
			</Container>
		</Navbar>
	);
};

export default NavBar;
