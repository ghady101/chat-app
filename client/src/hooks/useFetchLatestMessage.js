import { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../context/chatContext';
import { getRequest } from '../utils/services';

export const useFecthLatestMessage = (chat) => {
	const { newMessage, notification } = useContext(ChatContext);
	const [latestMessage, setLatestMessage] = useState(null);

	useEffect(() => {
		const getMessages = async () => {
			const response = await getRequest(`$(baseUrl}/messages/${chat?._id}`);
			if (response.error) {
				return console.log('Error getting messages...', response.error);
			}
			const lastMessage = response[response?.length - 1];
			setLatestMessage(lastMessage);
		};
		getMessages();
	}, [newMessage, notification]);

	return { latestMessage };
};
