import { useEffect, useMemo, useState } from "react";
import api from "../../api/client";
import DashboardLayout from "./DashboardLayout";

const Messages = () => {
	const [connections, setConnections] = useState([]);
	const [messagesByConversation, setMessagesByConversation] = useState({});
	const [selectedId, setSelectedId] = useState(null);
	const [draft, setDraft] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const loadConnections = async () => {
			try {
				const response = await api.get("/conversations");
				const conversations = response.data || [];
				setConnections(conversations);
				setSelectedId(conversations[0]?.id || null);
			} catch (requestError) {
				setError(requestError.response?.data?.message || "Unable to load your conversations.");
			} finally {
				setLoading(false);
			}
		};

		loadConnections();
	}, []);

	const selectedConnection = useMemo(() => connections.find((connection) => connection.id === selectedId), [connections, selectedId]);
	const selectedName = selectedConnection?.participantName || "Select a conversation";
	const selectedMessages = selectedConnection ? messagesByConversation[selectedConnection.id] || [] : [];

	useEffect(() => {
		if (!selectedId || messagesByConversation[selectedId]) return;
		api.get(`/messages?conversationId=${selectedId}`)
			.then((response) => setMessagesByConversation((current) => ({ ...current, [selectedId]: response.data || [] })))
			.catch((requestError) => setError(requestError.response?.data?.message || "Unable to load messages."));
	}, [messagesByConversation, selectedId]);

	const sendMessage = async () => {
		if (!selectedId || !draft.trim()) return;
		try {
			const response = await api.post("/messages", { conversationId: selectedConnection.id, content: draft.trim() });
			setMessagesByConversation((current) => ({ ...current, [selectedId]: [...(current[selectedId] || []), response.data] }));
			setDraft("");
		} catch (requestError) {
			setError(requestError.response?.data?.message || "Unable to send your message.");
		}
	};

	return (
		<DashboardLayout title="Messages" eyebrow="Stay connected">
			<section className="page-intro directory-intro"><p className="section-kicker">Stay connected</p><h2>Messages</h2><p>Continue conversations with people in your accepted network.</p></section>
			{error && <div className="directory-alert error">{error}</div>}
			{loading ? <div className="directory-state">Loading conversations...</div> : connections.length === 0 ? <div className="directory-state">Accept a connection to start a conversation.</div> : (
				<section className="messages-panel">
					<aside className="conversation-list" aria-label="Conversations">
						{connections.map((connection) => <button className={connection.id === selectedId ? "conversation active" : "conversation"} key={connection.id} type="button" onClick={() => setSelectedId(connection.id)}>
							<strong>{connection.senderName} / {connection.receiverName}</strong><span>{connection.status}</span>
						</button>)}
					</aside>
					<div className="chat-panel">
						<h3>{selectedName}</h3>
						<div className="chat-history">{selectedMessages.map((message) => <p className="chat-message" key={message.id}><strong>{message.senderName}: </strong>{message.content}</p>)}</div>
						<div className="chat-composer"><input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => event.key === "Enter" && sendMessage()} placeholder="Write a message..." /><button type="button" onClick={sendMessage}>Send</button></div>
					</div>
				</section>
			)}
		</DashboardLayout>
	);
};

export default Messages;
