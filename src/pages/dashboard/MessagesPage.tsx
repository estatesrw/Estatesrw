import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MessagesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<any[]>([]);
  const [conversations, setConversations] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [profiles, setProfiles] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) return;
    const fetchMessages = async () => {
      const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: true });
      setMessages(data || []);

      // Extract unique conversation partners
      const partners = new Set<string>();
      data?.forEach((m) => {
        if (m.sender_id !== user.id) partners.add(m.sender_id);
        if (m.receiver_id !== user.id) partners.add(m.receiver_id);
      });
      setConversations(Array.from(partners));

      // Fetch profiles for partners
      if (partners.size > 0) {
        const { data: profileData } = await supabase.from("profiles").select("id, full_name").in("id", Array.from(partners));
        const map: Record<string, string> = {};
        profileData?.forEach((p) => { map[p.id] = p.full_name || "User"; });
        setProfiles(map);
      }
    };
    fetchMessages();

    // Realtime subscription
    const channel = supabase.channel("messages-realtime").on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages" },
      (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      }
    ).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !user) return;
    const { error } = await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: selectedUser,
      content: newMessage.trim(),
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else setNewMessage("");
  };

  const filteredMessages = selectedUser
    ? messages.filter((m) => (m.sender_id === selectedUser && m.receiver_id === user?.id) || (m.sender_id === user?.id && m.receiver_id === selectedUser))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Messages</h2>
        <p className="text-muted-foreground">Chat with landlords and tenants</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[500px]">
        {/* Conversations list */}
        <Card className="shadow-card overflow-y-auto">
          <CardContent className="p-3 space-y-1">
            {conversations.length === 0 ? (
              <p className="text-sm text-muted-foreground p-4 text-center">No conversations yet</p>
            ) : (
              conversations.map((partnerId) => (
                <button
                  key={partnerId}
                  onClick={() => setSelectedUser(partnerId)}
                  className={`w-full text-left px-3 py-3 rounded-lg text-sm transition-colors ${
                    selectedUser === partnerId ? "bg-primary text-primary-foreground" : "hover:bg-secondary text-foreground"
                  }`}
                >
                  {profiles[partnerId] || "User"}
                </button>
              ))
            )}
          </CardContent>
        </Card>

        {/* Chat area */}
        <Card className="shadow-card md:col-span-2 flex flex-col">
          <CardContent className="flex-1 p-4 overflow-y-auto space-y-3">
            {!selectedUser ? (
              <p className="text-sm text-muted-foreground text-center mt-8">Select a conversation</p>
            ) : filteredMessages.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center mt-8">No messages yet</p>
            ) : (
              filteredMessages.map((m) => (
                <div key={m.id} className={`flex ${m.sender_id === user?.id ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                    m.sender_id === user?.id ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))
            )}
          </CardContent>
          {selectedUser && (
            <div className="p-3 border-t border-border flex gap-2">
              <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." onKeyDown={(e) => e.key === "Enter" && sendMessage()} />
              <Button onClick={sendMessage} size="icon"><Send className="w-4 h-4" /></Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MessagesPage;
