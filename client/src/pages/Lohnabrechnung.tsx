import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Calculator, Plus, FileText, Euro, Clock, TrendingUp, CheckCircle, Loader2, Trash2 } from "lucide-react";

const MONTHS = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth() + 1;

const statusColors: Record<string, string> = {
  draft: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  finalized: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  paid: "bg-green-500/20 text-green-300 border-green-500/30",
};
const statusLabels: Record<string, string> = {
  draft: "Entwurf",
  finalized: "Abgeschlossen",
  paid: "Ausgezahlt",
};

export default function Lohnabrechnung() {
  const [filterYear, setFilterYear] = useState(CURRENT_YEAR);
  const [filterMonth, setFilterMonth] = useState<number | undefined>(undefined);
  const [selectedEmployee, setSelectedEmployee] = useState<number | undefined>(undefined);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [calcMonth, setCalcMonth] = useState(CURRENT_MONTH);
  const [calcYear, setCalcYear] = useState(CURRENT_YEAR);
  const [calcEmployee, setCalcEmployee] = useState<number | undefined>(undefined);
  const [manualBonus, setManualBonus] = useState("0");
  const [manualNotes, setManualNotes] = useState("");
  const [calcResult, setCalcResult] = useState<any>(null);

  const utils = trpc.useUtils();

  const { data: employees = [] } = trpc.payroll.listEmployees.useQuery();
  const { data: records = [], isLoading } = trpc.payroll.listAll.useQuery({
    year: filterYear,
    month: filterMonth,
  });

  const calculateMutation = trpc.payroll.calculate.useMutation({
    onSuccess: (data) => {
      setCalcResult(data);
      toast.success(`Berechnung für ${MONTHS[data.month - 1]} ${data.year} abgeschlossen`);
    },
    onError: (e) => toast.error(e.message),
  });

  const createMutation = trpc.payroll.create.useMutation({
    onSuccess: () => {
      toast.success("Lohnabrechnung gespeichert");
      utils.payroll.listAll.invalidate();
      setShowCreateDialog(false);
      setCalcResult(null);
    },
    onError: (e) => toast.error(e.message),
  });

  const updateMutation = trpc.payroll.update.useMutation({
    onSuccess: () => {
      toast.success("Status aktualisiert");
      utils.payroll.listAll.invalidate();
      setShowDetailDialog(false);
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = trpc.payroll.delete.useMutation({
    onSuccess: () => {
      toast.success("Abrechnung gelöscht");
      utils.payroll.listAll.invalidate();
      setShowDetailDialog(false);
    },
    onError: (e) => toast.error(e.message),
  });

  const filteredRecords = useMemo(() => {
    if (!selectedEmployee) return records;
    return records.filter((r: any) => r.employeeId === selectedEmployee);
  }, [records, selectedEmployee]);

  const totalGross = filteredRecords.reduce((s: number, r: any) => s + parseFloat(r.grossSalary ?? "0"), 0);
  const totalNet = filteredRecords.reduce((s: number, r: any) => s + parseFloat(r.netSalary ?? "0"), 0);
  const totalHours = filteredRecords.reduce((s: number, r: any) => s + parseFloat(r.hoursWorked ?? "0"), 0);

  const getEmployeeName = (id: number) => employees.find((e: any) => e.id === id)?.name ?? `MA #${id}`;

  const handleCalculate = () => {
    if (!calcEmployee) { toast.error("Bitte Mitarbeiter wählen"); return; }
    calculateMutation.mutate({ employeeId: calcEmployee, month: calcMonth, year: calcYear });
  };

  const handleSave = () => {
    if (!calcResult) return;
    const net = parseFloat(calcResult.netSalary) + parseFloat(manualBonus || "0");
    createMutation.mutate({
      ...calcResult,
      bonus: manualBonus || "0",
      netSalary: String(Math.round(net * 100) / 100),
      notes: manualNotes,
      status: "draft",
    });
  };

  return (
    <div className="min-h-screen bg-[#1a0f05] text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/20 flex items-center justify-center">
            <Euro className="w-5 h-5 text-[#C9A84C]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Lohnabrechnung</h1>
            <p className="text-sm text-white/50">Monatliche Gehaltsabrechnung & Übersicht</p>
          </div>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}
          className="bg-[#C9A84C] hover:bg-[#b8973b] text-black font-semibold">
          <Plus className="w-4 h-4 mr-2" /> Neue Abrechnung
        </Button>
      </div>

      {/* Filter */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <Select value={String(filterYear)} onValueChange={(v) => setFilterYear(Number(v))}>
          <SelectTrigger className="w-32 bg-[#2a1a08] border-[#C9A84C]/20 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#2a1a08] border-[#C9A84C]/20">
            {[CURRENT_YEAR - 1, CURRENT_YEAR, CURRENT_YEAR + 1].map(y => (
              <SelectItem key={y} value={String(y)} className="text-white">{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterMonth ? String(filterMonth) : "all"} onValueChange={(v) => setFilterMonth(v === "all" ? undefined : Number(v))}>
          <SelectTrigger className="w-40 bg-[#2a1a08] border-[#C9A84C]/20 text-white">
            <SelectValue placeholder="Alle Monate" />
          </SelectTrigger>
          <SelectContent className="bg-[#2a1a08] border-[#C9A84C]/20">
            <SelectItem value="all" className="text-white">Alle Monate</SelectItem>
            {MONTHS.map((m, i) => (
              <SelectItem key={i} value={String(i + 1)} className="text-white">{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedEmployee ? String(selectedEmployee) : "all"} onValueChange={(v) => setSelectedEmployee(v === "all" ? undefined : Number(v))}>
          <SelectTrigger className="w-48 bg-[#2a1a08] border-[#C9A84C]/20 text-white">
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-[#2a1a08] border-[#C9A84C]/20">
          <CardContent className="p-4 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-[#C9A84C]" />
            <div>
              <p className="text-white/50 text-xs">Brutto gesamt</p>
              <p className="text-xl font-bold text-[#C9A84C]">{totalGross.toFixed(2)} €</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#2a1a08] border-[#C9A84C]/20">
          <CardContent className="p-4 flex items-center gap-3">
            <Euro className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-white/50 text-xs">Netto gesamt</p>
              <p className="text-xl font-bold text-green-400">{totalNet.toFixed(2)} €</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#2a1a08] border-[#C9A84C]/20">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-white/50 text-xs">Stunden gesamt</p>
              <p className="text-xl font-bold text-blue-400">{totalHours.toFixed(1)} h</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabelle */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#C9A84C]" /></div>
      ) : filteredRecords.length === 0 ? (
        <div className="text-center py-16 text-white/40">
          <Euro className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Noch keine Abrechnungen vorhanden</p>
          <p className="text-sm mt-1">Klicke auf „Neue Abrechnung" um zu starten</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#C9A84C]/20">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#C9A84C]/20 bg-[#2a1a08]">
                <th className="text-left px-4 py-3 text-[#C9A84C] font-semibold">Mitarbeiter</th>
                <th className="text-left px-4 py-3 text-[#C9A84C] font-semibold">Monat</th>
                <th className="text-right px-4 py-3 text-[#C9A84C] font-semibold">Stunden</th>
                <th className="text-right px-4 py-3 text-[#C9A84C] font-semibold">Brutto</th>
                <th className="text-right px-4 py-3 text-[#C9A84C] font-semibold">Abzüge</th>
                <th className="text-right px-4 py-3 text-[#C9A84C] font-semibold">Netto</th>
                <th className="text-center px-4 py-3 text-[#C9A84C] font-semibold">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((r: any) => {
                const abzuege = parseFloat(r.taxDeduction ?? "0") + parseFloat(r.socialSecurity ?? "0") + parseFloat(r.otherDeductions ?? "0");
                return (
                  <tr key={r.id} className="border-b border-[#C9A84C]/10 hover:bg-[#C9A84C]/5 transition-colors">
                    <td className="px-4 py-3 font-medium">{getEmployeeName(r.employeeId)}</td>
                    <td className="px-4 py-3 text-white/70">{MONTHS[r.month - 1]} {r.year}</td>
                    <td className="px-4 py-3 text-right text-white/70">{parseFloat(r.hoursWorked).toFixed(1)} h</td>
                    <td className="px-4 py-3 text-right font-medium">{parseFloat(r.grossSalary).toFixed(2)} €</td>
                    <td className="px-4 py-3 text-right text-red-400">-{abzuege.toFixed(2)} €</td>
                    <td className="px-4 py-3 text-right font-bold text-green-400">{parseFloat(r.netSalary).toFixed(2)} €</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs border ${statusColors[r.status]}`}>
                        {statusLabels[r.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Button size="sm" variant="ghost" onClick={() => { setSelectedRecord(r); setShowDetailDialog(true); }}
                        className="text-[#C9A84C] hover:bg-[#C9A84C]/10">
                        <FileText className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Neue Abrechnung Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-[#1a0f05] border-[#C9A84C]/30 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#C9A84C] flex items-center gap-2">
              <Calculator className="w-5 h-5" /> Neue Lohnabrechnung
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <Label className="text-white/70 text-xs">Mitarbeiter</Label>
                <Select value={calcEmployee ? String(calcEmployee) : ""} onValueChange={(v) => setCalcEmployee(Number(v))}>
                  <SelectTrigger className="bg-[#2a1a08] border-[#C9A84C]/20 text-white mt-1">
                    <SelectValue placeholder="Wählen..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2a1a08] border-[#C9A84C]/20">
                    {employees.map((e: any) => (
                      <SelectItem key={e.id} value={String(e.id)} className="text-white">{e.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white/70 text-xs">Monat</Label>
                <Select value={String(calcMonth)} onValueChange={(v) => setCalcMonth(Number(v))}>
                  <SelectTrigger className="bg-[#2a1a08] border-[#C9A84C]/20 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2a1a08] border-[#C9A84C]/20">
                    {MONTHS.map((m, i) => (
                      <SelectItem key={i} value={String(i + 1)} className="text-white">{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white/70 text-xs">Jahr</Label>
                <Input value={calcYear} onChange={(e) => setCalcYear(Number(e.target.value))}
                  className="bg-[#2a1a08] border-[#C9A84C]/20 text-white mt-1" type="number" />
              </div>
            </div>

            <Button onClick={handleCalculate} disabled={calculateMutation.isPending}
              className="w-full bg-[#C9A84C]/20 hover:bg-[#C9A84C]/30 text-[#C9A84C] border border-[#C9A84C]/30">
              {calculateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Calculator className="w-4 h-4 mr-2" />}
              Aus Schichten berechnen
            </Button>

            {calcResult && (
              <div className="bg-[#2a1a08] rounded-lg p-4 space-y-2 border border-[#C9A84C]/20">
                <p className="text-[#C9A84C] font-semibold text-sm mb-3">Berechnungsergebnis</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-white/60">Schichten:</span><span>{calcResult.shiftsCount}</span>
                  <span className="text-white/60">Stunden:</span><span>{parseFloat(calcResult.hoursWorked).toFixed(2)} h</span>
                  <span className="text-white/60">Stundenlohn:</span><span>{parseFloat(calcResult.hourlyWage).toFixed(2)} €</span>
                  <span className="text-white/60">Brutto:</span><span className="font-bold">{parseFloat(calcResult.grossSalary).toFixed(2)} €</span>
                  <span className="text-white/60">Steuer:</span><span className="text-red-400">-{parseFloat(calcResult.taxDeduction).toFixed(2)} €</span>
                  <span className="text-white/60">Sozialvers.:</span><span className="text-red-400">-{parseFloat(calcResult.socialSecurity).toFixed(2)} €</span>
                  <span className="text-white/60 font-bold">Netto:</span><span className="font-bold text-green-400">{parseFloat(calcResult.netSalary).toFixed(2)} €</span>
                </div>
                <div className="pt-2 space-y-2">
                  <div>
                    <Label className="text-white/70 text-xs">Bonus / Prämie (€)</Label>
                    <Input value={manualBonus} onChange={(e) => setManualBonus(e.target.value)}
                      className="bg-[#1a0f05] border-[#C9A84C]/20 text-white mt-1" placeholder="0.00" />
                  </div>
                  <div>
                    <Label className="text-white/70 text-xs">Notizen</Label>
                    <Textarea value={manualNotes} onChange={(e) => setManualNotes(e.target.value)}
                      className="bg-[#1a0f05] border-[#C9A84C]/20 text-white mt-1" rows={2} />
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => { setShowCreateDialog(false); setCalcResult(null); }}
              className="text-white/60 hover:text-white">Abbrechen</Button>
            {calcResult && (
              <Button onClick={handleSave} disabled={createMutation.isPending}
                className="bg-[#C9A84C] hover:bg-[#b8973b] text-black font-semibold">
                {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                Speichern
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      {selectedRecord && (
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="bg-[#1a0f05] border-[#C9A84C]/30 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-[#C9A84C]">
                {getEmployeeName(selectedRecord.employeeId)} – {MONTHS[selectedRecord.month - 1]} {selectedRecord.year}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2 bg-[#2a1a08] rounded-lg p-4">
                <span className="text-white/60">Stunden:</span><span>{parseFloat(selectedRecord.hoursWorked).toFixed(2)} h</span>
                <span className="text-white/60">Stundenlohn:</span><span>{parseFloat(selectedRecord.hourlyWage).toFixed(2)} €</span>
                <span className="text-white/60">Brutto:</span><span className="font-bold">{parseFloat(selectedRecord.grossSalary).toFixed(2)} €</span>
                <span className="text-white/60">Steuer:</span><span className="text-red-400">-{parseFloat(selectedRecord.taxDeduction ?? "0").toFixed(2)} €</span>
                <span className="text-white/60">Sozialvers.:</span><span className="text-red-400">-{parseFloat(selectedRecord.socialSecurity ?? "0").toFixed(2)} €</span>
                <span className="text-white/60">Bonus:</span><span className="text-green-400">+{parseFloat(selectedRecord.bonus ?? "0").toFixed(2)} €</span>
                <span className="text-white/60 font-bold">Netto:</span><span className="font-bold text-green-400 text-base">{parseFloat(selectedRecord.netSalary).toFixed(2)} €</span>
              </div>
              {selectedRecord.notes && <p className="text-white/60 text-xs">{selectedRecord.notes}</p>}
              <div>
                <Label className="text-white/70 text-xs">Status ändern</Label>
                <Select value={selectedRecord.status} onValueChange={(v) =>
                  updateMutation.mutate({ id: selectedRecord.id, status: v as any })}>
                  <SelectTrigger className="bg-[#2a1a08] border-[#C9A84C]/20 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2a1a08] border-[#C9A84C]/20">
                    <SelectItem value="draft" className="text-white">Entwurf</SelectItem>
                    <SelectItem value="finalized" className="text-white">Abgeschlossen</SelectItem>
                    <SelectItem value="paid" className="text-white">Ausgezahlt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => deleteMutation.mutate({ id: selectedRecord.id })}
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
