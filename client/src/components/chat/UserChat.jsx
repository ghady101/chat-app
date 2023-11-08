import React, { useContext } from 'react';
import { useFetchRecipientUser } from '../../hooks/useFetchRecipientUser';
import { Stack } from 'react-bootstrap';
import avatar from '../../assets/avatar.svg';
import { ChatContext } from '../../context/chatContext';
import { unreadNotificationsFunction } from '../../utils/unreadNotifications';
import { useFecthLatestMessage } from '../../hooks/useFetchLatestMessage';
import moment from 'moment';

const chatUser = ({ chat, user }) => {
	const { recipientUser } = useFetchRecipientUser(chat, user);
	const { onlineUsers, notification, markUserNotification } =
		useContext(ChatContext);
	const { latestMessage } = useFecthLatestMessage(chat);

	const unreadNotifications = unreadNotificationsFunction(notification);
	const thisUserNotifications = unreadNotifications?.filter((n) => {
		n.senderId === recipientUser?._id;
	});
	const isOnline = onlineUsers?.some(
		(user) => user?.userId === recipientUser?._id
	);

	const truncateMessage = (text) => {
		let shortened = text.substring(0, 20);
		if (text.length > 20) {
			shortened = shortened + '...';
		}
		return shortened;
	};

	return (
		<Stack
			direction='horizontal'
			gap={3}
			className='user-card align-items-center p-2 justify-content-between'
			role='button'
			onClick={() => {
				if (thisUserNotifications?.length !== 0) {
					markUserNotification(thisUserNotifications, notification);
				}
			}}>
			<div className='d-flex'>
				<div className='me-2'>
					<img src={avatar} alt='avatar' height={'35px'} />
				</div>
				<div className='text-content'>
					<div className='name'>{recipientUser?.name}</div>
					<div className='text'>
						{latestMessage?.text && (
							<span>{truncateMessage(latestMessage)}</span>
						)}
					</div>
				</div>
			</div>
			<div className='d-flex flex-column align-items-end'>
				<div className='date'>
					{moment(latestMessage?.createdAt).calendar()}
				</div>
				<div
					className={
						thisUserNotifications?.length > 0 ? 'this-user-notifications' : ''
					}>
					{thisUserNotifications?.length > 0
						? thisUserNotifications?.length
						: ''}
				</div>
				<span className={isOnline ? 'user-online' : ''}></span>
			</div>
		</Stack>
	);
};

export default chatUser;
