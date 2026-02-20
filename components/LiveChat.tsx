"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Send, Trash2, User } from "lucide-react";
import Image from "next/image";
import { sendLiveChatMessage } from "@/app/admin/actions";

type Message = {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    type: 'chat' | 'question';
    profiles?: {
        full_name: string;
        avatar_url: string;
        avatar_url_kids: string;
    }
};

type Props = {
    liveId: string;
    isAdmin?: boolean;
    isKids?: boolean; // To know which avatar to show priority
};

export default function LiveChat({ liveId, isAdmin = false, isKids = false }: Props) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [messageType, setMessageType] = useState<'chat' | 'question'>('chat');
    const [adminFilter, setAdminFilter] = useState<'all' | 'questions'>('all');
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    // Scroll to bottom helper
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        // Get current user
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            setCurrentUserId(data.user?.id || null);
        };
        getUser();

        // Fetch existing messages
        const fetchMessages = async () => {
            const { data } = await supabase
                .from("live_messages")
                .select("*, profiles(full_name, avatar_url, avatar_url_kids)")
                .eq("live_id", liveId)
                .order("created_at", { ascending: true });

            if (data) {
                // @ts-ignore
                setMessages(data);
                scrollToBottom();
            }
        };
        fetchMessages();

        // Subscribe to Realtime
        const channel = supabase
            .channel(`live_chat:${liveId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'live_messages', filter: `live_id=eq.${liveId}` },
                async (payload) => {
                    const { new: newMsg } = payload;
                    // Fetch profile for the new message because realtime payload doesn't include joins
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('full_name, avatar_url, avatar_url_kids')
                        .eq('id', newMsg.user_id)
                        .single();

                    const msgWithProfile = { ...newMsg, profiles: profile } as Message;

                    // Only add if it doesn't already exist (in case of double triggers)
                    setMessages((prev) => {
                        if (prev.some(m => m.id === newMsg.id)) return prev;
                        return [...prev, msgWithProfile];
                    });

                    setTimeout(scrollToBottom, 500);
                }
            )
            .on(
                'postgres_changes',
                { event: 'DELETE', schema: 'public', table: 'live_messages', filter: `live_id=eq.${liveId}` },
                (payload) => {
                    setMessages((prev) => prev.filter(m => m.id !== payload.old.id));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [liveId]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUserId) return;

        const content = newMessage.trim();
        setNewMessage(""); // Optimistic clear

        const { error } = await sendLiveChatMessage(liveId, content, messageType as any);

        if (error) {
            console.error("Error sending message:", error);
            // Ideally show toast
        }
    };

    const handleDelete = async (msgId: string) => {
        if (!isAdmin) return;
        await supabase.from("live_messages").delete().eq("id", msgId);
    };

    const visibleMessages = messages.filter(msg => {
        if (isAdmin && adminFilter === 'questions') return msg.type === 'question';
        return true;
    });

    return (
        <div className="flex flex-col h-full bg-white/5 rounded-xl border border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                <h3 className="font-bold text-white flex items-center gap-2">
                    💬 Chat en Direct
                </h3>
                <span className="text-xs font-normal text-gray-400 bg-black/20 px-2 py-0.5 rounded-full ml-auto whitespace-nowrap">
                    {visibleMessages.length} msg
                </span>
            </div>

            {isAdmin && (
                <div className="flex border-b border-white/10 bg-black/20 shrink-0">
                    <button
                        onClick={() => setAdminFilter('all')}
                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${adminFilter === 'all' ? 'text-white border-b-2 border-purple-500 bg-white/5' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Tout le chat
                    </button>
                    <button
                        onClick={() => setAdminFilter('questions')}
                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${adminFilter === 'questions' ? 'text-orange-400 border-b-2 border-orange-500 bg-white/5' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Questions
                    </button>
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {visibleMessages.length === 0 && (
                    <div className="text-center text-gray-500 text-sm py-10">
                        {adminFilter === 'questions' ? "Aucune question pour le moment !" : "Soyez le premier à dire bonjour ! 👋"}
                    </div>
                )}
                {visibleMessages.map((msg) => {
                    // Determine avatar: if kids mode, prioritize kid avatar. Admin always uses main avatar.
                    const avatar = isKids
                        ? (msg.profiles?.avatar_url_kids || msg.profiles?.avatar_url)
                        : (msg.profiles?.avatar_url || msg.profiles?.avatar_url_kids);

                    const isMe = msg.user_id === currentUserId;

                    return (
                        <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''} group animate-in slide-in-from-bottom-2 duration-300`}>
                            <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-gray-800 ring-2 ring-offset-2 ring-offset-black ring-purple-500">
                                {avatar ? (
                                    <Image src={avatar} alt="Avatar" width={32} height={32} className="object-cover w-full h-full" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400"><User className="w-4 h-4" /></div>
                                )}
                            </div>
                            <div className={`flex flex-col max-w-[85%] ${isMe ? 'items-end' : 'items-start'}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-gray-300 drop-shadow-md">
                                        {msg.profiles?.full_name || 'Utilisateur'}
                                    </span>
                                    {isAdmin && (
                                        <button
                                            onClick={() => handleDelete(msg.id)}
                                            className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 transition-opacity"
                                            title="Supprimer (Modérateur)"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                                <div className={`px-4 py-3 rounded-2xl text-sm break-words shadow-lg relative ${msg.type === 'question'
                                    ? `bg-gradient-to-br from-amber-500 to-orange-600 text-white border border-orange-400/50 ${isMe ? 'rounded-tr-none' : 'rounded-tl-none'}`
                                    : isMe
                                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none'
                                        : 'bg-white/10 backdrop-blur-md border border-white/5 text-gray-100 rounded-tl-none'
                                    }`}>
                                    {msg.type === 'question' && (
                                        <div className="text-[10px] uppercase tracking-widest font-black opacity-90 mb-1 flex items-center gap-1">
                                            ❓ Question
                                        </div>
                                    )}
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-3 md:p-4 border-t border-white/10 bg-black/40 backdrop-blur-md pb-safe flex flex-col gap-3">
                {!isAdmin && (
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setMessageType('chat')}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${messageType === 'chat' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' : 'bg-white/5 text-gray-500 border border-transparent hover:bg-white/10'}`}
                        >
                            💬 Message
                        </button>
                        <button
                            type="button"
                            onClick={() => setMessageType('question')}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${messageType === 'question' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' : 'bg-white/5 text-gray-500 border border-transparent hover:bg-white/10'}`}
                        >
                            ❓ Question
                        </button>
                    </div>
                )}

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={messageType === 'question' ? "❓ Ta question au magicien..." : "✨ Dis quelque chose..."}
                        className={`flex-1 border text-base md:text-sm text-white focus:outline-none transition-all placeholder-gray-400 shadow-inner rounded-full px-5 py-3 ${messageType === 'question' ? 'bg-orange-900/10 border-orange-500/50 focus:border-orange-500 focus:bg-orange-900/30' : 'bg-white/5 border-white/10 focus:border-purple-500 focus:bg-white/10'}`}
                        style={{ fontSize: '16px' }} // Prevent iOS zoom
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className={`p-3 text-white rounded-full transition-all flex-shrink-0 shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:grayscale ${messageType === 'question' ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-orange-500/25' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-purple-500/25'}`}
                    >
                        <Send className="w-5 h-5 md:w-4 md:h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
}
