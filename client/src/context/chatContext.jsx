import { createContext, useCallback, useEffect, useState } from 'react';
import { baseUrl, getRequest, postRequest } from '../utils/services';
import { io } from 'socket.io-client';

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
	const [userChats, setUserChats] = useState(null);
	const [userChatLoading, setUserChatLoading] = useState(false);
	const [userChatError, setUserChatError] = useState(null);
	const [potentialChats, setPotentialChats] = useState([]);
	const [currentChat, setCurrentChat] = useState(null);
	const [messages, setMessages] = useState(null);
	const [messagesLoading, setMessagesLoading] = useState(false);
	const [messagesError, setMessagesError] = useState(null);
	const [sendTextMessageError, setSendTextMessageError] = useState(null);
	const [newMessage, setNewMessage] = useState(null);
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const [notification, setNotification] = useState([]);
	const [allUsers, setAllUsers] = useState([]);

	// console.log('messages', messages);
	// console.log('online useers', onlineUsers);
	console.log('notification:', notification);

	// initial socket
	useEffect(() => {
		const newSocket = io('http://localhost:3000');
		setSocket(newSocket);
		return () => {
			newSocket.disconnect();
		};
	}, [user]);

	// add online users
	useEffect(() => {
		if (socket === null) return;
		socket.emit('addNewUser', user?._id);
		socket.on('getOnlineUsers', (res) => {
			setOnlineUsers(res);
		});
		return () => {
			socket.off('getOnlineUsers');
		};
	}, [socket]);

	// send message
	useEffect(() => {
		if (socket === null) return;

		const recipientId = currentChat?.members?.find((id) => id !== user?._id);

		socket.emit('sendMessage', { ...newMessage, recipientId });
	}, [newMessage]);

	// receive message & notification
	useEffect(() => {
		if (socket === null) return;

		socket.on('getMessage', (res) => {
			if (currentChat?._id !== res.chatId) return;

			setMessages((prev) => [...prev, res]);
		});

		socket.on('getNotification', (res) => {
			const isChatOpen = currentChat?.members.some((id) => id === res.senderId);

			if (isChatOpen) {
				setNotification((prev) => [{ ...res, isRead: true }, ...prev]);
			} else {
				setNotification((prev) => [res, ...prev]);
			}
		});

		return () => {
			socket.off('getMessage');
			socket.off('getNotification');
		};
	}, [socket, currentChat]);

	useEffect(() => {
		const getUsers = async () => {
			const response = await getRequest(`${baseUrl}/users`);

			if (response.error) {
				return console.log('error fetching users', response);
			}

			const pChats = response.filter((u) => {
				let isChatCreated = false;

				if (user?._id === u._id) return false;

				if (userChats) {
					isChatCreated = userChats?.some((chat) => {
						return chat.members[0] === u._id || chat.members[1] === u._id;
					});
				}
				return !isChatCreated;
			});
			setPotentialChats(pChats);
			setAllUsers(response);
		};
		getUsers();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userChats]);

	useEffect(() => {
		const getUserChats = async () => {
			if (user?._id) {
				setUserChatLoading(true);
				setUserChatError(null);

				const response = await getRequest(`${baseUrl}/chats/${user?._id}`);

				setUserChatLoading(false);

				if (response.error) {
					return setUserChatError(response);
				}
				setUserChats(response);
			}
		};
		getUserChats();
	}, [user, notification]);

	useEffect(() => {
		const getMessages = async () => {
			setMessagesLoading(true);
			setMessagesError(null);

			const response = await getRequest(
				`${baseUrl}/messages/${currentChat?._id}`
			);

			setMessagesLoading(false);

			if (response.error) {
				return setMessagesError(response);
			}
			setMessages(response);
		};
		getMessages();
	}, [currentChat]);

	const sendTextMessage = useCallback(
		async (textMessage, sender, currentChatId, setTextMessage) => {
			if (!textMessage) return console.log('you must type something...');

			const response = await postRequest(
				`${baseUrl}/messages`,
				JSON.stringify({
					chatId: currentChatId,
					senderId: sender._id,
					text: textMessage,
				})
			);

			if (response.error) return setSendTextMessageError(response);

			setNewMessage(response);
			setMessages((prev) => [...prev, response]);
			setTextMessage(' ');
		},
		[]
	);

	const createChat = useCallback(async (firstId, secondId) => {
		const response = await postRequest(
			`${baseUrl}/chats`,
			JSON.stringify({
				firstId,
				secondId,
			})
		);

		if (response.error) {
			return console.log('error creating chat', response);
		}
		console.log('created chat: ', response);
		setUserChats((prev) => {
			return [...prev, response];
		});
	}, []);

	const updateCurrentChat = useCallback((chat) => {
		setCurrentChat(chat);
	}, []);

	const markAllRead = useCallback((n) => {
		const mNotifications = notification.map((n) => {
			return { ...n, isRead: true };
		});

		setNotification(mNotifications);
	}, []);

	const markNotificationAsRead = useCallback(
		(n, userChats, user, notifications) => {
			// find chat to open
			const desiredChat = userChats.find((chat) => {
				const chatMembers = [user._id, n.senderId];
				const isDesiredChat = chat?.members.every((member) => {
					return chatMembers.includes(member);
				});
				return isDesiredChat;
			});
			// mark notification
			const mNotifications = notifications.map((el) => {
				if (n.senderId === el.senderId) {
					return { ...n, isRead: true };
				} else {
					return el;
				}
			});

			updateCurrentChat(desiredChat);
			setNotification(mNotifications);
		},
		[]
	);

	const markUserNotification = useCallback(
		(thisUserNotifications, notifications) => {
			const mNotifications = notifications.map((el) => {
				let notification;
				thisUserNotifications.forEach((n) => {
					if (n.senderId === el.senderId) {
						notification = { ...n, isRead: true };
					} else {
						notification = el;
					}
				});
				return notification;
			});
			setNotification(mNotifications);
		},
		[]
	);

	return (
		<ChatContext.Provider
			value={{
				userChats,
				userChatLoading,
				userChatError,
				potentialChats,
				createChat,
				currentChat,
				updateCurrentChat,
				messages,
				messagesLoading,
				messagesError,
				sendTextMessage,
				onlineUsers,
				notification,
				allUsers,
				markAllRead,
				markNotificationAsRead,
				markUserNotification,
			}}>
			{children}
		</ChatContext.Provider>
	);
};
