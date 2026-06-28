import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FolderOpen, Plus, FileText, Trash2, CheckCircle, Loader2, User, Shield, FileCheck } from "lucide-react";

const CATEGORIES = [
  { value: "vertrag", label: "Arbeitsvertrag", icon: "📄", color: "text-blue-400" },
  { value: "zeugnis", label: "Arbeitszeugnis", icon: "🏆", color: "text-yellow-400" },
  { value: "ausweis", label: "Personalausweis / Reisepass", icon: "🪪", color: "text-purple-400" },
  { value: "krankmeldung", label: "Krankmeldung / AU", icon: "🏥", color: "text-red-400" },
  { value: "lohnabrechnung", label: "Lohnabrechnung", icon: "💶", color: "text-green-400" },
  { value: "sonstiges", label: "Sonstiges", icon: "📁", color: "text-white/60" },
];

const getCategoryInfo = (value: string) => CATEGORIES.find(c => c.value === value) ?? CATEGORIES[5];

export default function Personalakte() {
  const [selectedEmployee, setSelectedEmployee] = useState<number | undefined>(undefined);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<string>("sonstiges");
  const [newFileUrl, setNewFileUrl] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [showEmployeeDetail, setShowEmployeeDetail] = useState<number | undefined>(undefined);

  const utils = trpc.useUtils();

  const { data: employees = [] } = trpc.documents.listEmployees.useQuery();
  const { data: allDocs = [], isLoading } = trpc.documents.listAll.useQuery();
  const { data: empDocs = [] } = trpc.documents.listByEmployee.useQuery(
    { employeeId: showEmployeeDetail! },
    { enabled: !!showEmployeeDetail }
  );

  const createMutation = trpc.documents.create.useMutation({
    onSuccess: () => {
      toast.success("Dokument gespeichert");
      utils.documents.listAll.invalidate();
      utils.documents.listByEmployee.invalidate();
      setShowAddDialog(false);
      setNewTitle(""); setNewCategory("sonstiges"); setNewFileUrl(""); setNewNotes("");
    },
    onError: (e) => toast.error(e.message),
  });

  const updateMutation = trpc.documents.update.useMutation({
    onSuccess: () => {
      toast.success("Dokument aktualisiert");
      utils.documents.listAll.invalidate();
      utils.documents.listByEmployee.invalidate();
      setShowDetailDialog(false);
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = trpc.documents.delete.useMutation({
    onSuccess: () => {
      toast.success("Dokument gelöscht");
      utils.documents.listAll.invalidate();
      utils.documents.listByEmployee.invalidate();
      setShowDetailDialog(false);
    },
    onError: (e) => toast.error(e.message),
  });

  const getEmployeeName = (id: number) => employees.find((e: any) => e.id === id)?.name ?? `MA #${id}`;

  const filteredDocs = selectedEmployee
    ? allDocs.filter((d: any) => d.employeeId === selectedEmployee)
    : allDocs;

  // Dokumente pro Mitarbeiter gruppieren
  const docsByEmployee = employees.reduce((acc: Record<number, any[]>, emp: any) => {
    acc[emp.id] = allDocs.filter((d: any) => d.employeeId === emp.id);
    return acc;
  }, {});

  const handleAdd = () => {
    if (!newTitle.trim()) { toast.error("Bitte Titel eingeben"); return; }
    if (!selectedEmployee) { toast.error("Bitte Mitarbeiter wählen"); return; }
    createMutation.mutate({
      employeeId: selectedEmployee,
      title: newTitle,
      category: newCategory as any,
      fileUrl: newFileUrl || undefined,
      notes: newNotes || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-[#1a0f05] text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/20 flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-[#C9A84C]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Digitale Personalakte</h1>
            <p className="text-sm text-white/50">Dokumente, Verträge & Nachweise</p>
          </div>
        </div>
        <Button onClick={() => setShowAddDialog(true)}
          className="bg-[#C9A84C] hover:bg-[#b8973b] text-black font-semibold">
          <Plus className="w-4 h-4 mr-2" /> Dokument hinzufügen
        </Button>
      </div>

      {/* Filter */}
      <div className="flex gap-3 mb-6">
        <Select value={selectedEmployee ? String(selectedEmployee) : "all"}
          onValueChange={(v) => setSelectedEmployee(v === "all" ? undefined : Number(v))}>
          <SelectTrigger className="w-56 bg-[#2a1a08] border-[#C9A84C]/20 text-white">
            <SelectValue placeholder="Alle Mitarbeiter" />
          </SelectTrigger>
          <SelectContent className="bg-[#2a1a08] border-[#C9A84C]/20">
            <SelectItem value="all" className="text-white">Alle Mitarbeiter</SelectItem>
            {employees.map((e: any) => (
              <SelectItem key={e.id} value={String(e.id)} className="text-white">{e.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Mitarbeiter-Karten */}
      {!selectedEmployee ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.length === 0 ? (
            <div className="col-span-3 text-center py-16 text-white/40">
              <User className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Noch keine Mitarbeiter angelegt</p>
              <p className="text-sm mt-1">Zuerst Mitarbeiter im Dienstplan anlegen</p>
            </div>
          ) : employees.map((emp: any) => {
            const docs = docsByEmployee[emp.id] ?? [];
            const hasVertrag = docs.some((d: any) => d.category === "vertrag");
            const hasAusweis = docs.some((d: any) => d.category === "ausweis");
            return (
              <Card key={emp.id} className="bg-[#2a1a08] border-[#C9A84C]/20 hover:border-[#C9A84C]/40 transition-colors cursor-pointer"
                onClick={() => { setSelectedEmployee(emp.id); setShowEmployeeDetail(emp.id); }}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                        style={{ backgroundColor: emp.color + "30", color: emp.color }}>
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{emp.name}</p>
                        <p className="text-xs text-white/50">{emp.position}</p>
                      </div>
                    </div>
                    <span className="text-xs bg-[#C9A84C]/20 text-[#C9A84C] px-2 py-1 rounded-full">
                      {docs.length} Dok.
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className={`text-xs flex items-center gap-1 ${hasVertrag ? "text-green-400" : "text-white/30"}`}>
                      <FileCheck className="w-3 h-3" /> Vertrag
                    </span>
                    <span className={`text-xs flex items-center gap-1 ${hasAusweis ? "text-green-400" : "text-white/30"}`}>
                      <Shield className="w-3 h-3" /> Ausweis
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Dokumentenliste für gewählten Mitarbeiter */
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" onClick={() => setSelectedEmployee(undefined)}
              className="text-white/60 hover:text-white text-sm">← Alle Mitarbeiter</Button>
            <h2 className="text-lg font-semibold text-[#C9A84C]">{getEmployeeName(selectedEmployee)}</h2>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#C9A84C]" /></div>
          ) : filteredDocs.length === 0 ? (
            <div className="text-center py-16 text-white/40">
              <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Noch keine Dokumente vorhanden</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredDocs.map((doc: any) => {
                const cat = getCategoryInfo(doc.category);
                return (
                  <div key={doc.id}
                    className="bg-[#2a1a08] border border-[#C9A84C]/20 rounded-xl p-4 flex items-start gap-3 hover:border-[#C9A84C]/40 transition-colors cursor-pointer"
                    onClick={() => { setSelectedDoc(doc); setShowDetailDialog(true); }}>
                    <span className="text-2xl">{cat.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{doc.title}</p>
                      <p className={`text-xs ${cat.color}`}>{cat.label}</p>
                      {doc.notes && <p className="text-xs text-white/40 mt-1 truncate">{doc.notes}</p>}
                      <div className="flex gap-2 mt-2">
                        {doc.signedByAdmin && (
                          <span className="text-xs text-green-400 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Admin signiert
                          </span>
                        )}
                        {doc.signedByEmployee && (
                          <span className="text-xs text-blue-400 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> MA signiert
                          </span>
                        )}
                      </div>
                    </div>
                    {doc.fileUrl && (
                      <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#C9A84C] hover:text-[#b8973b] text-xs underline shrink-0">
                        Öffnen
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Dokument hinzufügen Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-[#1a0f05] border-[#C9A84C]/30 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#C9A84C] flex items-center gap-2">
              <Plus className="w-5 h-5" /> Dokument hinzufügen
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-white/70 text-xs">Mitarbeiter *</Label>
              <Select value={selectedEmployee ? String(selectedEmployee) : ""}
                onValueChange={(v) => setSelectedEmployee(Number(v))}>
                <SelectTrigger className="bg-[#2a1a08] border-[#C9A84C]/20 text-white mt-1">
                  <SelectValue placeholder="Mitarbeiter wählen..." />
                </SelectTrigger>
                <SelectContent className="bg-[#2a1a08] border-[#C9A84C]/20">
                  {employees.map((e: any) => (
                    <SelectItem key={e.id} value={String(e.id)} className="text-white">{e.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-white/70 text-xs">Titel *</Label>
              <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                className="bg-[#2a1a08] border-[#C9A84C]/20 text-white mt-1"
                placeholder="z.B. Arbeitsvertrag 2026" />
            </div>
            <div>
              <Label className="text-white/70 text-xs">Kategorie</Label>
              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger className="bg-[#2a1a08] border-[#C9A84C]/20 text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#2a1a08] border-[#C9A84C]/20">
                  {CATEGORIES.map(c => (
                    <SelectItem key={c.value} value={c.value} className="text-white">{c.icon} {c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-white/70 text-xs">Datei-URL (optional)</Label>
              <Input value={newFileUrl} onChange={(e) => setNewFileUrl(e.target.value)}
                className="bg-[#2a1a08] border-[#C9A84C]/20 text-white mt-1"
                placeholder="https://..." />
            </div>
            <div>
              <Label className="text-white/70 text-xs">Notizen</Label>
              <Textarea value={newNotes} onChange={(e) => setNewNotes(e.target.value)}
                className="bg-[#2a1a08] border-[#C9A84C]/20 text-white mt-1" rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowAddDialog(false)} className="text-white/60">Abbrechen</Button>
            <Button onClick={handleAdd} disabled={createMutation.isPending}
              className="bg-[#C9A84C] hover:bg-[#b8973b] text-black font-semibold">
              {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dokument Detail Dialog */}
      {selectedDoc && (
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="bg-[#1a0f05] border-[#C9A84C]/30 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-[#C9A84C] flex items-center gap-2">
                <span className="text-xl">{getCategoryInfo(selectedDoc.category).icon}</span>
                {selectedDoc.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div className="bg-[#2a1a08] rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/60">Mitarbeiter:</span>
                  <span>{getEmployeeName(selectedDoc.employeeId)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Kategorie:</span>
                  <span className={getCategoryInfo(selectedDoc.category).color}>
                    {getCategoryInfo(selectedDoc.category).label}
                  </span>
                </div>
                {selectedDoc.notes && (
                  <div>
                    <span className="text-white/60">Notizen:</span>
                    <p className="mt-1 text-white/80">{selectedDoc.notes}</p>
                  </div>
                )}
                {selectedDoc.fileUrl && (
                  <a href={selectedDoc.fileUrl} target="_blank" rel="noopener noreferrer"
                    className="block text-[#C9A84C] hover:underline">
                    📎 Datei öffnen
                  </a>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Signatur-Status</p>
                <div className="flex gap-3">
                  <Button size="sm" variant="outline"
                    className={`flex-1 border ${selectedDoc.signedByAdmin ? "border-green-500 text-green-400 bg-green-500/10" : "border-[#C9A84C]/20 text-white/60"}`}
                    onClick={() => updateMutation.mutate({ id: selectedDoc.id, signedByAdmin: !selectedDoc.signedByAdmin })}>
                    <CheckCircle className="w-3 h-3 mr-1" /> Admin
                  </Button>
                  <Button size="sm" variant="outline"
                    className={`flex-1 border ${selectedDoc.signedByEmployee ? "border-blue-500 text-blue-400 bg-blue-500/10" : "border-[#C9A84C]/20 text-white/60"}`}
                    onClick={() => updateMutation.mutate({ id: selectedDoc.id, signedByEmployee: !selectedDoc.signedByEmployee })}>
                    <CheckCircle className="w-3 h-3 mr-1" /> Mitarbeiter
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => deleteMutation.mutate({ id: selectedDoc.id })}
                className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                <Trash2 className="w-4 h-4 mr-1" /> Löschen
              </Button>
              <Button variant="ghost" onClick={() => setShowDetailDialog(false)} className="text-white/60">Schließen</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
