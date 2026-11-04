import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MessageSquare, Send, Calendar, CheckCircle2, Clock, XCircle, ArrowLeft, Building2, User, ShieldCheck } from 'lucide-react';
import { fetchListings } from '../services/api';
import { Listing } from '../types';

export interface ChatMessage {
  id: string;
  listingId: string;
  listingName: string;
  studentName: string;
  studentEmail: string;
  ownerId: string;
  ownerName: string;
  sender: 'student' | 'owner';
  message: string;
  viewingDate?: string; // e.g. "2026-11-10T14:00"
  viewingStatus?: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  createdAt: string;
}

export const Messages: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialListingId = searchParams.get('listing_id');

  const [threads, setThreads] = useState<ChatMessage[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [viewingDate, setViewingDate] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);

  const userRole = localStorage.getItem('ssu_user_role') || (localStorage.getItem('ssu_owner_token') ? 'OWNER' : 'STUDENT');
  const userName = localStorage.getItem('ssu_user_name') || localStorage.getItem('ssu_student_name') || localStorage.getItem('ssu_owner_name') || 'Guest User';
  const userEmail = localStorage.getItem('ssu_user_email') || 'student@sorsu.edu.ph';

  useEffect(() => {
    fetchListings().then(setListings).catch(() => {});
    loadMessages();
  }, []);

  const loadMessages = () => {
    const stored = JSON.parse(localStorage.getItem('ssu_platform_chat_threads') || '[]');
    setThreads(stored);

    // If initialListingId provided in query and no active thread, check if thread exists or seed one
    if (initialListingId && stored.length > 0) {
      const match = stored.find((m: ChatMessage) => m.listingId === initialListingId);
      if (match) {
        setActiveThreadId(match.listingId);
      }
    }
  };

  const saveMessages = (newThreads: ChatMessage[]) => {
    localStorage.setItem('ssu_platform_chat_threads', JSON.stringify(newThreads));
    setThreads(newThreads);
  };

  // Group messages by listingId
  const groupedThreads: { [listingId: string]: ChatMessage[] } = {};
  threads.forEach(msg => {
    if (!groupedThreads[msg.listingId]) {
      groupedThreads[msg.listingId] = [];
    }
    groupedThreads[msg.listingId].push(msg);
  });

  const activeListingId = activeThreadId || Object.keys(groupedThreads)[0] || initialListingId;
  const currentMessages = activeListingId ? groupedThreads[activeListingId] || [] : [];
  const currentListing = listings.find(l => l.id === activeListingId);

  const handleSendMessage = (e: React.FormEvent, customViewingDate?: string, customStatus?: 'PENDING' | 'ACCEPTED' | 'DECLINED') => {
    e.preventDefault();
    if (!replyText.trim() && !customViewingDate) return;
    if (!activeListingId) return;

    const targetListing = listings.find(l => l.id === activeListingId);
    const listingName = targetListing ? targetListing.name : 'Boarding House Listing';
    const ownerId = targetListing ? targetListing.owner_id : 'owner-1';
    const ownerName = targetListing ? targetListing.owner.name : 'Property Owner';

    const newMessage: ChatMessage = {
      id: 'msg-' + Date.now(),
      listingId: activeListingId,
      listingName,
      studentName: userName,
      studentEmail: userEmail,
      ownerId,
      ownerName,
      sender: userRole === 'OWNER' ? 'owner' : 'student',
      message: replyText.trim() || (customViewingDate ? `Requested viewing schedule for ${new Date(customViewingDate).toLocaleString()}` : ''),
      viewingDate: customViewingDate || undefined,
      viewingStatus: customStatus || (customViewingDate ? 'PENDING' : undefined),
      createdAt: new Date().toISOString()
    };

    const updated = [...threads, newMessage];
    saveMessages(updated);
    setReplyText('');
    setViewingDate('');
    setShowScheduleModal(false);
  };

  const handleUpdateViewingStatus = (msgId: string, status: 'ACCEPTED' | 'DECLINED') => {
    const updated = threads.map(m => {
      if (m.id === msgId) {
        return { ...m, viewingStatus: status };
      }
      return m;
    });
    saveMessages(updated);
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full">
              Role: {userRole} ({userName})
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-3 min-h-[600px]">
          
          {/* Left Sidebar: Conversations / Threads */}
          <div className="border-r border-zinc-200 bg-zinc-50/50 flex flex-col">
            <div className="p-4 border-b border-zinc-200 bg-white">
              <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#800000]" />
                Messages & Viewings
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">Discuss details & schedule SSU Bulan viewings</p>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-zinc-100">
              {Object.keys(groupedThreads).length === 0 ? (
                <div className="p-8 text-center space-y-3">
                  <Building2 className="w-10 h-10 text-zinc-300 mx-auto" />
                  <p className="text-xs font-bold text-zinc-700">No active conversations yet.</p>
                  <p className="text-[11px] text-zinc-500">Visit any verified listing to start a chat or request a viewing.</p>
                  <Link to="/listings" className="inline-block px-3 py-2 bg-[#800000] text-amber-300 text-xs font-bold rounded-lg">
                    Browse Listings
                  </Link>
                </div>
              ) : (
                Object.entries(groupedThreads).map(([lId, msgs]) => {
                  const lastMsg = msgs[msgs.length - 1];
                  const targetListing = listings.find(l => l.id === lId);
                  const isSelected = activeListingId === lId;

                  return (
                    <button
                      key={lId}
                      onClick={() => setActiveThreadId(lId)}
                      className={`w-full text-left p-4 transition-colors flex items-start gap-3 ${isSelected ? 'bg-[#800000]/10 border-l-4 border-[#800000]' : 'hover:bg-zinc-100/60 bg-white'}`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#800000] flex items-center justify-center font-bold shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-zinc-900 truncate">{lastMsg.listingName}</h4>
                          <span className="text-[10px] text-zinc-400 shrink-0">
                            {new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-600 truncate mt-0.5">
                          {lastMsg.sender === 'owner' ? 'Owner: ' : 'You: '} {lastMsg.message}
                        </p>
                        {lastMsg.viewingDate && (
                          <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-[10px] font-semibold text-amber-900 border border-amber-200">
                            <Calendar className="w-3 h-3 text-[#800000]" />
                            Viewing: {new Date(lastMsg.viewingDate).toLocaleDateString()} ({lastMsg.viewingStatus || 'PENDING'})
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Main Area: Active Chat Window */}
          <div className="lg:col-span-2 flex flex-col bg-white">
            {activeListingId && currentListing ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <img 
                      src={currentListing.photos[0] || '/src/assets/images/student_room_interior_1793166105502.jpg'} 
                      alt="" 
                      className="w-12 h-12 rounded-xl object-cover border border-zinc-200"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="text-sm font-extrabold text-zinc-900">{currentListing.name}</h3>
                      <p className="text-xs text-zinc-500">Owner: {currentListing.owner.name} ({currentListing.owner.contact_information})</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowScheduleModal(true)}
                      className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-[#800000] border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      <Calendar className="w-4 h-4" />
                      Schedule Viewing
                    </button>
                    <Link
                      to={`/listings/${currentListing.id}`}
                      className="px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-semibold"
                    >
                      View Listing
                    </Link>
                  </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-zinc-50/30">
                  {currentMessages.length === 0 ? (
                    <div className="text-center py-12 space-y-2">
                      <MessageSquare className="w-8 h-8 text-zinc-300 mx-auto" />
                      <p className="text-xs font-bold text-zinc-700">Start the conversation with the property owner.</p>
                      <p className="text-[11px] text-zinc-500">Ask about room availability, advance deposits, house rules, or schedule a campus visit.</p>
                    </div>
                  ) : (
                    currentMessages.map(msg => {
                      const isMe = (userRole === 'OWNER' && msg.sender === 'owner') || (userRole !== 'OWNER' && msg.sender === 'student');

                      return (
                        <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-center gap-1 mb-1 text-[10px] text-zinc-500 font-medium">
                            <User className="w-3 h-3" />
                            <span>{msg.sender === 'owner' ? msg.ownerName : msg.studentName}</span>
                            <span>•</span>
                            <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>

                          <div className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${isMe ? 'bg-[#800000] text-amber-300 rounded-br-none border border-[#660000]' : 'bg-white text-zinc-800 rounded-bl-none border border-zinc-200'}`}>
                            <p>{msg.message}</p>

                            {msg.viewingDate && (
                              <div className={`mt-3 p-3 rounded-xl border ${isMe ? 'bg-[#660000] border-amber-400/30 text-white' : 'bg-amber-50 border-amber-300 text-amber-900'} space-y-2`}>
                                <div className="flex items-center gap-1.5 font-bold text-xs">
                                  <Calendar className="w-4 h-4 text-[#800000]" />
                                  Viewing Appointment: {new Date(msg.viewingDate).toLocaleString()}
                                </div>
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="font-semibold">
                                    Status: <span className="uppercase px-2 py-0.5 rounded bg-white text-zinc-900 border">{msg.viewingStatus || 'PENDING'}</span>
                                  </span>

                                  {userRole === 'OWNER' && msg.viewingStatus === 'PENDING' && (
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleUpdateViewingStatus(msg.id, 'ACCEPTED')}
                                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg"
                                      >
                                        Accept
                                      </button>
                                      <button
                                        onClick={() => handleUpdateViewingStatus(msg.id, 'DECLINED')}
                                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg"
                                      >
                                        Decline
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Reply Input Box */}
                <form onSubmit={e => handleSendMessage(e)} className="p-4 border-t border-zinc-200 bg-white flex gap-3 items-center">
                  <input
                    type="text"
                    placeholder="Type your message to discuss details or ask questions..."
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    className="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#800000]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 bg-[#800000] hover:bg-[#660000] text-amber-300 font-bold text-xs rounded-xl flex items-center gap-2 shadow-md transition-colors shrink-0 border border-amber-400/30"
                  >
                    <Send className="w-4 h-4 text-amber-300" />
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
                <MessageSquare className="w-12 h-12 text-zinc-300" />
                <h3 className="text-sm font-bold text-zinc-800">Select a Conversation</h3>
                <p className="text-xs text-zinc-500">Choose a chat thread from the left sidebar or start a new inquiry from any verified listing.</p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Schedule Viewing Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl border border-zinc-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#800000]" />
                Schedule Boarding House Viewing
              </h3>
              <button onClick={() => setShowScheduleModal(false)} className="text-zinc-400 hover:text-zinc-700">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-600">
              Pick a proposed date and time to visit {currentListing?.name} near SSU Bulan Campus.
            </p>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700">Proposed Date & Time</label>
                <input
                  type="datetime-local"
                  value={viewingDate}
                  onChange={e => setViewingDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#800000]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700">Message / Notes</label>
                <textarea
                  rows={3}
                  placeholder="Hello, I would like to inspect the room facilities and discuss monthly rates during this viewing."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#800000]"
                ></textarea>
              </div>

              <button
                type="button"
                onClick={e => handleSendMessage(e, viewingDate, 'PENDING')}
                disabled={!viewingDate}
                className="w-full py-3 bg-[#800000] hover:bg-[#660000] text-amber-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 border border-amber-400/30"
              >
                <Calendar className="w-4 h-4 text-amber-300" />
                Send Viewing Appointment Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
