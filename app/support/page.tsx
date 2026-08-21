"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { DataTable, Column } from "@/components/DataTable";
import { initialSupportTickets, SupportTicketItem, SupportMessage, SupportCallLog } from "@/lib/mockData";
import {
  HelpCircle,
  MessageSquare,
  Phone,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Eye,
  Plus,
  User,
  ExternalLink,
  Send,
  PhoneCall,
  ShieldCheck,
  AlertCircle,
  FileText,
  X,
  MessageCircle,
  Headphones,
} from "lucide-react";
import { Portal } from "@/components/Portal";

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicketItem[]>(initialSupportTickets);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [issueFilter, setIssueFilter] = useState<string>("All");

  const [selectedTicket, setSelectedTicket] = useState<SupportTicketItem | null>(null);
  const [activeTab, setActiveTab] = useState<"chat" | "call" | "notes">("chat");

  // Chat message state
  const [newMessageText, setNewMessageText] = useState("");

  // Call log modal state
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [callDurationMins, setCallDurationMins] = useState("3");
  const [callOutcome, setCallOutcome] = useState<"Resolved" | "Follow-up Scheduled" | "Unreachable">("Resolved");
  const [callNotes, setCallNotes] = useState("");

  // Internal notes state
  const [newInternalNote, setNewInternalNote] = useState("");

  // KPI Calculations
  const openCount = tickets.filter((t) => t.status === "Open").length;
  const inProgressCount = tickets.filter((t) => t.status === "In Progress").length;
  const resolvedCount = tickets.filter((t) => t.status === "Resolved" || t.status === "Closed").length;

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      // Status Filter
      if (statusFilter !== "All" && t.status !== statusFilter) return false;

      // Priority Filter
      if (priorityFilter !== "All" && t.priority !== priorityFilter) return false;

      // Issue Category Filter
      if (issueFilter !== "All" && t.issueCategory !== issueFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = t.id.toLowerCase().includes(q);
        const matchesCust = t.customerName.toLowerCase().includes(q);
        const matchesPhone = t.customerPhone.includes(q);
        const matchesBooking = t.bookingId?.toLowerCase().includes(q);
        const matchesSubject = t.subject.toLowerCase().includes(q);
        if (!matchesId && !matchesCust && !matchesPhone && !matchesBooking && !matchesSubject) return false;
      }

      return true;
    });
  }, [tickets, statusFilter, priorityFilter, issueFilter, searchQuery]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !newMessageText.trim()) return;

    const newMsg: SupportMessage = {
      id: `msg-${Date.now()}`,
      sender: "Support Agent",
      senderName: "HelpMate Support Representative",
      text: newMessageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id
          ? {
              ...t,
              status: t.status === "Open" ? "In Progress" : t.status,
              messages: [...t.messages, newMsg],
              lastUpdated: new Date().toISOString(),
            }
          : t
      )
    );

    setSelectedTicket((prev) =>
      prev
        ? {
            ...prev,
            status: prev.status === "Open" ? "In Progress" : prev.status,
            messages: [...prev.messages, newMsg],
          }
        : null
    );

    setNewMessageText("");
  };

  const handleLogCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !callNotes.trim()) return;

    const newCall: SupportCallLog = {
      id: `call-${Date.now()}`,
      agentName: "HelpMate Support Representative",
      durationSeconds: (parseInt(callDurationMins, 10) || 3) * 60,
      outcome: callOutcome,
      notes: callNotes.trim(),
      timestamp: new Date().toLocaleString([], { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" }),
    };

    const nextStatus = callOutcome === "Resolved" ? "Resolved" : "In Progress";

    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id
          ? {
              ...t,
              status: nextStatus,
              callLogs: [newCall, ...t.callLogs],
              lastUpdated: new Date().toISOString(),
            }
          : t
      )
    );

    setSelectedTicket((prev) =>
      prev
        ? {
            ...prev,
            status: nextStatus,
            callLogs: [newCall, ...prev.callLogs],
          }
        : null
    );

    setIsCallModalOpen(false);
    setCallNotes("");
  };

  const handleAddInternalNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !newInternalNote.trim()) return;

    const updatedNotes = [...(selectedTicket.internalNotes || []), newInternalNote.trim()];

    setTickets((prev) =>
      prev.map((t) => (t.id === selectedTicket.id ? { ...t, internalNotes: updatedNotes } : t))
    );

    setSelectedTicket((prev) => (prev ? { ...prev, internalNotes: updatedNotes } : null));
    setNewInternalNote("");
  };

  const handleUpdateTicketStatus = (ticketId: string, status: "Open" | "In Progress" | "Resolved" | "Closed") => {
    setTickets((prev) => prev.map((t) => (t.id === ticketId ? { ...t, status } : t)));
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const columns: Column<SupportTicketItem>[] = [
    {
      key: "id",
      header: "Ticket ID",
      accessor: (row) => (
        <button
          type="button"
          onClick={() => setSelectedTicket(row)}
          className="font-mono font-black text-brand-600 dark:text-brand-400 hover:underline text-xs cursor-pointer"
        >
          {row.id}
        </button>
      ),
      sortable: true,
    },
    {
      key: "customerName",
      header: "Customer & Phone",
      accessor: (row) => (
        <div>
          <div className="font-extrabold text-slate-900 dark:text-white text-xs">{row.customerName}</div>
          <div className="font-mono text-[11px] text-slate-500">{row.customerPhone}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: "bookingId",
      header: "Related Booking",
      accessor: (row) =>
        row.bookingId ? (
          <Link
            href={`/bookings/${row.bookingId}`}
            className="font-mono text-xs font-extrabold text-purple-700 dark:text-purple-300 hover:underline"
          >
            {row.bookingId}
          </Link>
        ) : (
          <span className="text-[11px] text-slate-400">General Inquiry</span>
        ),
      sortable: true,
    },
    {
      key: "issueCategory",
      header: "Issue Category",
      accessor: (row) => (
        <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
          {row.issueCategory}
        </span>
      ),
      sortable: true,
    },
    {
      key: "subject",
      header: "Subject & Complaint Summary",
      accessor: (row) => (
        <div className="max-w-xs space-y-0.5">
          <div className="font-bold text-slate-900 dark:text-white text-xs truncate" title={row.subject}>
            {row.subject}
          </div>
          <p className="text-[11px] text-slate-500 line-clamp-1">{row.description}</p>
        </div>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      accessor: (row) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
            row.priority === "High"
              ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300"
              : row.priority === "Medium"
              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300"
              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300"
          }`}
        >
          {row.priority}
        </span>
      ),
      sortable: true,
    },
    {
      key: "status",
      header: "Ticket Status",
      accessor: (row) => (
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 ${
            row.status === "Open"
              ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300"
              : row.status === "In Progress"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300"
              : row.status === "Resolved"
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300"
              : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-300"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          <span>{row.status}</span>
        </span>
      ),
      sortable: true,
    },
    {
      key: "actions",
      header: "Resolve Channels",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          {/* Resolve via Message Button */}
          <button
            type="button"
            onClick={() => {
              setSelectedTicket(row);
              setActiveTab("chat");
            }}
            className="px-2.5 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300 dark:hover:bg-brand-900 rounded-xl text-xs font-extrabold flex items-center gap-1 border border-brand-200 dark:border-brand-800 transition-colors cursor-pointer"
            title="Resolve via Live Message Chat"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Message</span>
          </button>

          {/* Resolve via Call Button */}
          <button
            type="button"
            onClick={() => {
              setSelectedTicket(row);
              setActiveTab("call");
              setIsCallModalOpen(true);
            }}
            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 dark:hover:bg-emerald-900 rounded-xl text-xs font-extrabold flex items-center gap-1 border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer"
            title="Resolve via Phone Call"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Headphones className="w-6 h-6 text-brand-600" />
            <span>Customer Support & Complaint Desk</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Manage customer queries, complaints, and service issues with dual resolution channels (Message & Call).
          </p>
        </div>
      </div>

      {/* 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Open Complaints</span>
            <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950 dark:border-rose-900">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-rose-600">{openCount} New Tickets</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">In Progress Support</span>
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-950 dark:border-blue-900">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-blue-600">{inProgressCount} Tickets</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Resolved & Closed</span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950 dark:border-emerald-900">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-emerald-600">{resolvedCount} Tickets</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Average First Response</span>
            <div className="p-2.5 rounded-2xl bg-brand-50 text-brand-600 border border-brand-200 dark:bg-brand-950 dark:border-brand-900">
              <MessageCircle className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">12 Mins</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ticket ID, customer name, phone, booking ID..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="All">All Ticket Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>

            {/* Issue Category Filter */}
            <select
              value={issueFilter}
              onChange={(e) => setIssueFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="All">All Issue Categories</option>
              <option value="Booking & Scheduling">Booking & Scheduling</option>
              <option value="Payments & Billing">Payments & Billing</option>
              <option value="Service Quality">Service Quality</option>
              <option value="Partner Conduct">Partner Conduct</option>
              <option value="General Inquiry">General Inquiry</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Support DataTable */}
      <DataTable columns={columns} data={filteredTickets} />

      {/* Complete Support Resolution Drawer / Modal */}
      {selectedTicket && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 outline-none overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-3xl w-full space-y-5 shadow-2xl animate-in zoom-in-95 duration-150 my-8 max-h-[92vh] overflow-y-auto custom-scrollbar">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 shrink-0">
                    <Headphones className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                        Ticket {selectedTicket.id}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          selectedTicket.status === "Open"
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                            : selectedTicket.status === "In Progress"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        }`}
                      >
                        {selectedTicket.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {selectedTicket.customerName} • {selectedTicket.customerPhone}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Complete Ticket Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Complaint Subject</span>
                    <div className="font-extrabold text-slate-900 dark:text-white text-sm">{selectedTicket.subject}</div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Related Booking</span>
                    {selectedTicket.bookingId ? (
                      <Link
                        href={`/bookings/${selectedTicket.bookingId}`}
                        className="font-mono font-extrabold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <span>{selectedTicket.bookingId} ({selectedTicket.category})</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    ) : (
                      <span className="font-semibold text-slate-600 dark:text-slate-400">None (General Inquiry)</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Detailed Description</span>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                    {selectedTicket.description}
                  </div>
                </div>

                {/* Status Changer Toolbar */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-extrabold text-slate-600 dark:text-slate-400">
                    Change Ticket Status:
                  </span>
                  <div className="flex gap-1.5">
                    {(["Open", "In Progress", "Resolved", "Closed"] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleUpdateTicketStatus(selectedTicket.id, st)}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold transition-colors cursor-pointer ${
                          selectedTicket.status === st
                            ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Resolution Channels Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("chat")}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === "chat"
                      ? "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-800"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-brand-600" />
                  <span>Option 1: Resolve via Message ({selectedTicket.messages.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("call")}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === "call"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <PhoneCall className="w-4 h-4 text-emerald-600" />
                  <span>Option 2: Resolve via Call ({selectedTicket.callLogs.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("notes")}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === "notes"
                      ? "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span>Internal Notes ({selectedTicket.internalNotes?.length || 0})</span>
                </button>
              </div>

              {/* TAB 1: RESOLVE VIA MESSAGE (LIVE CHAT TIMELINE) */}
              {activeTab === "chat" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 max-h-64 overflow-y-auto space-y-3 custom-scrollbar">
                    {selectedTicket.messages.length === 0 ? (
                      <p className="text-center text-xs text-slate-400 py-6">No messages yet. Send first resolution message below.</p>
                    ) : (
                      selectedTicket.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-3 rounded-2xl max-w-md space-y-1 text-xs ${
                            msg.sender === "Support Agent"
                              ? "bg-brand-600 text-white ml-auto"
                              : "bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 mr-auto"
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] opacity-80 font-bold border-b border-white/20 pb-1 mb-1">
                            <span>{msg.senderName} ({msg.sender})</span>
                            <span>{msg.timestamp}</span>
                          </div>
                          <p className="leading-relaxed font-medium">{msg.text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      placeholder="Type response message to customer..."
                      className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                    />
                    <button
                      type="submit"
                      className="px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-extrabold shadow-lux flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 2: RESOLVE VIA CALL (DIRECT PHONE CONTACT & CALL LOG) */}
              {activeTab === "call" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-extrabold text-emerald-900 dark:text-emerald-200 text-sm flex items-center gap-2">
                        <PhoneCall className="w-4 h-4 text-emerald-600" />
                        <span>Direct Customer Phone Call Gateway</span>
                      </h4>
                      <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                        Customer Contact: <strong>{selectedTicket.customerPhone}</strong> ({selectedTicket.customerName})
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={`tel:${selectedTicket.customerPhone}`}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lux flex items-center gap-2 cursor-pointer"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Dial Customer Now</span>
                      </a>
                    </div>
                  </div>

                  {/* Call Logs History Timeline */}
                  <div className="space-y-2 text-xs">
                    <span className="font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] block">
                      Support Call History ({selectedTicket.callLogs.length} Calls)
                    </span>

                    {selectedTicket.callLogs.length === 0 ? (
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center text-slate-400">
                        No phone call logs recorded yet. Use button below to log support call outcome.
                      </div>
                    ) : (
                      selectedTicket.callLogs.map((call) => (
                        <div
                          key={call.id}
                          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-emerald-600" /> {call.agentName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{call.timestamp}</span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 font-medium">"{call.notes}"</p>
                          <div className="flex items-center gap-3 pt-1 text-[10px] text-slate-500 font-semibold">
                            <span>Duration: {Math.floor(call.durationSeconds / 60)} mins</span>
                            <span>Outcome: <strong className="text-emerald-600">{call.outcome}</strong></span>
                          </div>
                        </div>
                      ))
                    )}

                    <button
                      type="button"
                      onClick={() => setIsCallModalOpen(true)}
                      className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      + Log Completed Support Call Details
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: INTERNAL AGENT NOTES */}
              {activeTab === "notes" && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-2">
                    <span className="font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] block">
                      Internal Support Notes Feed
                    </span>

                    {selectedTicket.internalNotes?.map((note, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200 font-medium"
                      >
                        📌 {note}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddInternalNote} className="flex gap-2">
                    <input
                      type="text"
                      value={newInternalNote}
                      onChange={(e) => setNewInternalNote(e.target.value)}
                      placeholder="Add internal note visible only to admins & dispatch..."
                      className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Add Note
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </Portal>
      )}

      {/* LOG SUPPORT CALL MODAL */}
      {isCallModalOpen && selectedTicket && (
        <Portal>
          <div className="fixed inset-0 z-[999999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 outline-none">
            <form
              onSubmit={handleLogCall}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150"
            >
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 shrink-0">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Record Customer Support Call</h3>
                  <p className="text-xs text-slate-500 font-medium">{selectedTicket.customerName} ({selectedTicket.customerPhone})</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Call Duration (Minutes)</label>
                <input
                  type="number"
                  value={callDurationMins}
                  onChange={(e) => setCallDurationMins(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Call Outcome</label>
                <select
                  value={callOutcome}
                  onChange={(e) => setCallOutcome(e.target.value as any)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
                >
                  <option value="Resolved">Resolved Complaint (Close Ticket)</option>
                  <option value="Follow-up Scheduled">Follow-up Scheduled</option>
                  <option value="Unreachable">Customer Unreachable</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Call Resolution Summary Notes *</label>
                <textarea
                  rows={3}
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  placeholder="Record summary of conversation with customer and resolution agreed upon..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCallModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-lux cursor-pointer"
                >
                  Save Call Log
                </button>
              </div>
            </form>
          </div>
        </Portal>
      )}
    </div>
  );
}
