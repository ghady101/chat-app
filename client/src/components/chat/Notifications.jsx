import React, { useContext, useState } from 'react';
import { ChatContext } from '../../context/chatContext';
import { AuthContext } from '../../context/AuthContext';
import { unreadNotificationsFunction } from '../../utils/unreadNotifications';
import moment from 'moment';

const Notifications = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { user } = useContext(AuthContext);
	const {
		notification,
		userChats,
		allUsers,
		markAllRead,
		markNotificationAsRead,
	} = useContext(ChatContext);

	const unreadNotifications = unreadNotificationsFunction(notification);
	const modifiedNotification = notification.map((n) => {
		const sender = allUsers.find((user) => user._id === n.senderId);
		return {
			...n,
			senderName: sender?.name,
		};
	});

	return (
		<div className='notifications'>
			<div className='notifications-icons' onClick={() => setIsOpen(!isOpen)}>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width='20'
					height='20'
					fill='currentColor'
					className='bi bi-chat-right-fill'
					viewBox='0 0 16 16'>
					<path d='M14 0a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z' />
				</svg>
				{unreadNotifications?.length === 0 ? null : (
					<span className='notification-count'>
						<span>{unreadNotifications?.length}</span>
					</span>
				)}
			</div>
			{isOpen ? (
				<div className='notifications-box'>
					<div className='notifications-header'>
						<h3>Notifications</h3>
						<div
							className='mark-as-read'
							onClick={() => markAllRead(notification)}>
							Mark All Read
						</div>
					</div>
					{modifiedNotification?.length === 0 ? (
						<span className='notifications'>No Notification...</span>
					) : null}
					{modifiedNotification &&
						modifiedNotification.map((n, index) => {
							return (
								<div
									key={index}
									className={
										n.isRead ? 'notification' : 'notification not-read'
									}
									onClick={() => {
										markNotificationAsRead(n, userChats, user, notification);
										setIsOpen(false);
									}}>
									<span>{`${n.senderName} sent a new message`}</span>
									<span className='notification-time'>
										{moment(n.date).calendar()}
									</span>
								</div>
							);
						})}
				</div>
			) : null}
		</div>
	);
};

export default Notifications;
