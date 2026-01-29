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
      supplier.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.whatTheySupply.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.primaryContactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || supplier.supplierType === filterType;

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
        <AddSupplierDialog onAddSupplier={handleAddSupplier} />
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Supplier Name</TableHead>
              <TableHead className="w-[180px]">Type</TableHead>
              <TableHead className="w-[200px]">What They Supply</TableHead>
              <TableHead className="w-[150px]">Primary Contact</TableHead>
              <TableHead className="w-[140px]">Phone</TableHead>
              <TableHead className="w-[180px]">Email</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSuppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  {suppliers.length === 0
                    ? "No suppliers added yet. Click 'Add Supplier' to get started."
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
                          value={editData.supplierName}
                          onChange={(e) =>
                            setEditData({ ...editData, supplierName: e.target.value })
                          }
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={editData.supplierType}
                          onValueChange={(value) =>
                            setEditData({ ...editData, supplierType: value as SupplierType })
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
                          value={editData.whatTheySupply}
                          onChange={(e) =>
                            setEditData({ ...editData, whatTheySupply: e.target.value })
                          }
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editData.primaryContactName}
                          onChange={(e) =>
                            setEditData({ ...editData, primaryContactName: e.target.value })
                          }
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editData.phoneNumber}
                          onChange={(e) =>
                            setEditData({ ...editData, phoneNumber: e.target.value })
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
                          value={editData.notes}
                          onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
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
                      <TableCell className="font-medium">{supplier.supplierName}</TableCell>
                      <TableCell>
                        <Badge variant={getTypeBadgeVariant(supplier.supplierType)}>
                          {supplier.supplierType}
                        </Badge>
                      </TableCell>
                      <TableCell>{supplier.whatTheySupply}</TableCell>
                      <TableCell>{supplier.primaryContactName}</TableCell>
                      <TableCell>{supplier.phoneNumber}</TableCell>
                      <TableCell>{supplier.email}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={supplier.notes}>
                        {supplier.notes}
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
