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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Trash2, Edit2, Save, X, Loader2, Plus, CheckCircle2 } from "lucide-react";
import { Supplier, SupplierType, supplierTypes, useSuppliers } from "@/hooks/useSuppliers";
import { AddSupplierDialog } from "./AddSupplierDialogNew";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const SupplierRegisterSection = () => {
  const { suppliers, isLoading, addSupplier, updateSupplier, deleteSupplier } = useSuppliers();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Supplier | null>(null);

  const handleStartEdit = (supplier: Supplier) => {
    setEditingId(supplier.id);
    setEditData({ ...supplier });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData(null);
  };

  const handleSaveEdit = async () => {
    if (!editData) return;
    await updateSupplier(editData);
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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading suppliers...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Supplier Register</span>
          <Badge variant="outline" className="ml-2">{suppliers.length} suppliers</Badge>
        </CardTitle>
        <CardDescription>
          Master contact register for all suppliers. This is the single source of truth for who we buy from.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
          <AddSupplierDialog onAddSupplier={addSupplier} />
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Supplier Name</TableHead>
                <TableHead className="min-w-[150px]">Primary Contact</TableHead>
                <TableHead className="min-w-[130px]">Phone</TableHead>
                <TableHead className="min-w-[200px]">Email</TableHead>
                <TableHead className="min-w-[130px]">Location</TableHead>
                <TableHead className="min-w-[250px]">What They Supply</TableHead>
                <TableHead className="w-[80px] text-center">Preferred</TableHead>
                <TableHead className="w-[80px] text-right">Actions</TableHead>
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
                            value={editData.email}
                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                            className="h-8"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={(editData as any).location || ""}
                            onChange={(e) => setEditData({ ...editData, location: e.target.value } as any)}
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
                        <TableCell className="text-center">
                          <input
                            type="checkbox"
                            checked={(editData as any).isPreferred || false}
                            onChange={(e) => setEditData({ ...editData, isPreferred: e.target.checked } as any)}
                            className="h-4 w-4"
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
                        <TableCell className="font-medium">{supplier.name}</TableCell>
                        <TableCell>{supplier.contact}</TableCell>
                        <TableCell className="whitespace-nowrap">{supplier.workPhone || supplier.mobile}</TableCell>
                        <TableCell className="break-all">{supplier.email}</TableCell>
                        <TableCell>{supplier.location || "-"}</TableCell>
                        <TableCell>{supplier.whatUsedFor}</TableCell>
                        <TableCell className="text-center">
                          {supplier.isPreferred ? (
                            <CheckCircle2 className="h-5 w-5 text-primary mx-auto" />
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
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
                              onClick={() => deleteSupplier(supplier.id)}
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
      </CardContent>
    </Card>
  );
};
