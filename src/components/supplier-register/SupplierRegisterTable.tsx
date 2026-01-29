import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Trash2, Edit2, Save, X } from "lucide-react";
import { Supplier, SupplierType, supplierTypes } from "./supplierData";
import { AddSupplierDialog } from "./AddSupplierDialog";
import { ImportSupplierDialog } from "./ImportSupplierDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const SupplierRegisterTable = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Supplier | null>(null);

  const handleAddSupplier = (newSupplier: Omit<Supplier, "id">) => {
    const supplier: Supplier = {
      ...newSupplier,
      id: crypto.randomUUID(),
    };
    setSuppliers([...suppliers, supplier]);
  };

  const handleImportSuppliers = (newSuppliers: Omit<Supplier, "id">[]) => {
    const suppliersWithIds = newSuppliers.map((s) => ({
      ...s,
      id: crypto.randomUUID(),
    }));
    setSuppliers([...suppliers, ...suppliersWithIds]);
  };

  const handleDeleteSupplier = (id: string) => {
    setSuppliers(suppliers.filter((s) => s.id !== id));
  };

  const handleStartEdit = (supplier: Supplier) => {
    setEditingId(supplier.id);
    setEditData({ ...supplier });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData(null);
  };

  const handleSaveEdit = () => {
    if (!editData) return;
    setSuppliers(suppliers.map((s) => (s.id === editData.id ? editData : s)));
    setEditingId(null);
    setEditData(null);
  };

  const getTypeBadgeVariant = (type: SupplierType) => {
    switch (type) {
      case "OEM":
        return "default";
      case "Critical Spares Supplier":
        return "destructive";
      case "Trade / General Supplier":
        return "secondary";
      case "Service Provider":
        return "outline";
      default:
        return "secondary";
    }
  };

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.whatUsedFor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || supplier.type === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-56">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {supplierTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <ImportSupplierDialog
            existingSuppliers={suppliers}
            onImportSuppliers={handleImportSuppliers}
          />
          <AddSupplierDialog onAddSupplier={handleAddSupplier} />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Code</TableHead>
              <TableHead className="w-[180px]">Name</TableHead>
              <TableHead className="w-[140px]">Contact</TableHead>
              <TableHead className="w-[160px]">Type</TableHead>
              <TableHead className="w-[120px]">Work Phone</TableHead>
              <TableHead className="w-[120px]">Mobile</TableHead>
              <TableHead className="w-[160px]">Email</TableHead>
              <TableHead className="w-[180px]">What Used For</TableHead>
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSuppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  {suppliers.length === 0
                    ? "No suppliers added yet. Click 'Add Supplier' or 'Import from Excel' to get started."
                    : "No suppliers match your search criteria."}
                </TableCell>
              </TableRow>
            ) : (
              filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  {editingId === supplier.id && editData ? (
                    <>
                      <TableCell>
                        <Input
                          value={editData.code}
                          onChange={(e) =>
                            setEditData({ ...editData, code: e.target.value })
                          }
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editData.name}
                          onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                          }
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editData.contact}
                          onChange={(e) =>
                            setEditData({ ...editData, contact: e.target.value })
                          }
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={editData.type}
                          onValueChange={(value) =>
                            setEditData({ ...editData, type: value as SupplierType })
                          }
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {supplierTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editData.workPhone}
                          onChange={(e) =>
                            setEditData({ ...editData, workPhone: e.target.value })
                          }
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editData.mobile}
                          onChange={(e) =>
                            setEditData({ ...editData, mobile: e.target.value })
                          }
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editData.email}
                          onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editData.whatUsedFor}
                          onChange={(e) => setEditData({ ...editData, whatUsedFor: e.target.value })}
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSaveEdit}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCancelEdit}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="font-mono text-xs">{supplier.code}</TableCell>
                      <TableCell className="font-medium">{supplier.name}</TableCell>
                      <TableCell>{supplier.contact}</TableCell>
                      <TableCell>
                        <Badge variant={getTypeBadgeVariant(supplier.type)}>
                          {supplier.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{supplier.workPhone}</TableCell>
                      <TableCell>{supplier.mobile}</TableCell>
                      <TableCell>{supplier.email}</TableCell>
                      <TableCell className="max-w-[180px] truncate" title={supplier.whatUsedFor}>
                        {supplier.whatUsedFor}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleStartEdit(supplier)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteSupplier(supplier.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="text-sm text-muted-foreground">
        {suppliers.length > 0 && (
          <span>
            Showing {filteredSuppliers.length} of {suppliers.length} suppliers
          </span>
        )}
      </div>
    </div>
  );
};
