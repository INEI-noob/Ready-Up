import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Plus, Trash2, Plug, ChevronDown, ChevronUp, Lock } from "lucide-react";
import type { CommunityServer } from "@/vite-env";

export function CommunityServers({
  servers,
  onSave,
  onDelete,
  onConnect,
}: {
  servers: CommunityServer[];
  onSave: (s: CommunityServer) => void;
  onDelete: (id: string) => void;
  onConnect: (ip: string, port: number, password?: string) => void;
}) {
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [ip, setIp] = useState("");
  const [port, setPort] = useState("27015");
  const [password, setPassword] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  function handleSave() {
    if (!name.trim() || !ip.trim() || !port.trim()) return;
    const server: CommunityServer = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: name.trim(),
      ip: ip.trim(),
      port: parseInt(port, 10) || 27015,
      password: password.trim() || undefined,
    };
    onSave(server);
    setName("");
    setIp("");
    setPort("27015");
    setPassword("");
    setShowCreate(false);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Globe className="h-3 w-3 text-pastelBlue" />
          <span className="font-mono text-[10px] tracking-wider text-inkDim">COMMUNITY SERVERS</span>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-1 rounded-xl border border-pastelPink/20 px-3 py-1.5 text-[12px] font-bold text-pastelPink transition-colors hover:bg-pastelPink/10"
        >
          <Plus className="h-3 w-3" /> New
        </button>
      </div>

      {/* Create form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-pastelBlue/20 bg-pastelBlue/5 p-3 space-y-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Server name..."
                className="w-full rounded-xl border border-white/10 bg-[rgba(25,22,40,0.5)] px-3 py-2 text-[13px] text-ink outline-none placeholder:text-pastelPink/40 focus:border-pastelBlue/40 focus:ring-2 focus:ring-pastelPink/20"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  placeholder="IP address"
                  className="flex-1 rounded-xl border border-white/10 bg-[rgba(25,22,40,0.5)] px-3 py-1.5 text-[13px] text-ink font-mono outline-none placeholder:text-pastelPink/40 focus:border-pastelPink/40 focus:ring-2 focus:ring-pastelPink/20"
                />
                <input
                  type="text"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  placeholder="Port"
                  className="w-20 rounded-xl border border-white/10 bg-[rgba(25,22,40,0.5)] px-3 py-1.5 text-[13px] text-ink font-mono outline-none placeholder:text-pastelPink/40 focus:border-pastelPink/40 focus:ring-2 focus:ring-pastelPink/20"
                />
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-3 w-3 text-inkDim/40" />
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (optional)"
                  className="flex-1 rounded-xl border border-white/10 bg-[rgba(25,22,40,0.5)] px-3 py-1.5 text-[13px] text-ink font-mono outline-none placeholder:text-pastelPink/40 focus:border-pastelPink/40 focus:ring-2 focus:ring-pastelPink/20"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={!name.trim() || !ip.trim() || !port.trim()}
                  className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-pastelBlue to-pastelLavender px-3 py-1.5 text-[12px] font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-40"
                >
                  <Plus className="h-3 w-3" /> Save Server
                </button>
                <button
                  onClick={() => setShowCreate(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] font-bold text-inkDim transition-colors hover:text-ink"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Server list */}
      {servers.length > 0 ? (
        <div className="space-y-1">
          {servers.map((s) => {
            const isExpanded = expanded === s.id;
            return (
              <div key={s.id} className="rounded-xl border border-white/10 bg-white/5 transition-all">
                <div className="flex items-center gap-2 px-3 py-2">
                  <Globe className="h-3 w-3 text-pastelBlue" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-bold text-ink">{s.name}</div>
                    <div className="font-mono text-[10px] text-inkDim">{s.ip}:{s.port}{s.password ? " (pw)" : ""}</div>
                  </div>
                  <button
                    onClick={() => onConnect(s.ip, s.port, s.password)}
                    className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-pastelBlue to-pastelLavender px-3 py-1.5 text-[12px] font-bold text-white transition-all hover:-translate-y-0.5"
                  >
                    <Plug className="h-3 w-3" /> Join
                  </button>
                  <button onClick={() => setExpanded(isExpanded ? null : s.id)} className="text-inkDim/40 hover:text-inkDim">
                    {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="border-t border-white/30 px-3 py-2">
                        <div className="mb-1 font-mono text-[10px] text-inkDim">
                          {s.ip}:{s.port}{s.password ? " / Password: " + s.password : ""}
                        </div>
                        <button onClick={() => onDelete(s.id)} className="flex items-center gap-1 text-[10px] text-inkDim/40 hover:text-pink transition-colors">
                          <Trash2 className="h-2.5 w-2.5" /> Delete
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center text-[11px] text-inkDim/50">
          No servers saved — add one to quick-connect
        </div>
      )}
    </div>
  );
}
