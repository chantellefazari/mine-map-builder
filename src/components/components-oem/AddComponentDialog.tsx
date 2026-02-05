 import { useState } from "react";
 import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
 } from "@/components/ui/dialog";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Textarea } from "@/components/ui/textarea";
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select";
 import { useToast } from "@/hooks/use-toast";
 import type { ComponentItem } from "./ComponentsTable";
 
 interface AddComponentDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onAdd: (component: Omit<ComponentItem, "id">) => void;
 }
 
 const componentTypes = [
   "Motor",
   "Gearbox",
   "Pump",
   "Valve",
   "Roller",
   "Bearing",
   "Seal",
   "Coupling",
   "Belt",
   "Chain",
   "Sprocket",
   "Impeller",
   "Liner",
   "Screen",
   "Sensor",
   "Actuator",
   "Equipment",
 ];
 
 const areas = ["COM", "UTL", "REC", "TAIL", "SUP", "SITE"];
 
 const componentFunctions = ["Drive", "Support", "Control", "Safety", ""] as const;
const NONE_VALUE = "__none__";
 
 const abbreviations: Record<string, string> = {
   Motor: "MTR",
   Gearbox: "GBX",
   Pump: "PUMP",
   Valve: "VLV",
   Roller: "RLR",
   Bearing: "BRG",
   Seal: "SL",
   Coupling: "CPL",
   Belt: "BLT",
   Chain: "CHN",
   Sprocket: "SPR",
   Impeller: "IMP",
   Liner: "LNR",
   Screen: "SCN",
   Sensor: "SEN",
   Actuator: "ACT",
   Equipment: "EQP",
 };
 
 export const AddComponentDialog = ({
   open,
   onOpenChange,
   onAdd,
 }: AddComponentDialogProps) => {
   const { toast } = useToast();
   const [saving, setSaving] = useState(false);
 
   const [assetName, setAssetName] = useState("");
   const [assetNumber, setAssetNumber] = useState("");
   const [parentAsset, setParentAsset] = useState("");
   const [area, setArea] = useState("");
   const [subArea, setSubArea] = useState("");
   const [system, setSystem] = useState("");
   const [componentType, setComponentType] = useState("");
   const [componentName, setComponentName] = useState("");
   const [componentFunction, setComponentFunction] = useState<"Drive" | "Support" | "Control" | "Safety" | "">("");
   const [oemManufacturer, setOemManufacturer] = useState("");
   const [oemModel, setOemModel] = useState("");
   const [oemSerialNumber, setOemSerialNumber] = useState("");
   const [pidTag, setPidTag] = useState("");
   const [notes, setNotes] = useState("");
 
   const resetForm = () => {
     setAssetName("");
     setAssetNumber("");
     setParentAsset("");
     setArea("");
     setSubArea("");
     setSystem("");
     setComponentType("");
     setComponentName("");
     setComponentFunction("");
     setOemManufacturer("");
     setOemModel("");
     setOemSerialNumber("");
     setPidTag("");
     setNotes("");
   };
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
 
     if (!assetName.trim() || !componentType) {
       toast({
         title: "Missing required fields",
         description: "Please enter an Asset Name and select a Component Type.",
         variant: "destructive",
       });
       return;
     }
 
     setSaving(true);
 
     const newComponent: Omit<ComponentItem, "id"> = {
       assetName: assetName.trim(),
       assetNumber: assetNumber.trim(),
       parentAsset: parentAsset.trim(),
       area: area || "",
       subArea: subArea.trim(),
       system: system.trim(),
       componentType,
       componentName: componentName.trim() || assetName.trim(),
       componentAbbreviation: abbreviations[componentType] || "",
       componentFunction,
       oemManufacturer: oemManufacturer.trim(),
       oemModel: oemModel.trim(),
       oemSerialNumber: oemSerialNumber.trim(),
       pidTag: pidTag.trim(),
       notes: notes.trim(),
       status: "Unknown",
     };
 
     onAdd(newComponent);
     setSaving(false);
     resetForm();
     onOpenChange(false);
 
     toast({
       title: "Component added",
       description: `${assetName} has been added to the register.`,
     });
   };
 
   return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
         <DialogHeader>
           <DialogTitle>Add Component</DialogTitle>
           <DialogDescription>
             Add a new component to the OEM register. OEM details can be filled in later after verification.
           </DialogDescription>
         </DialogHeader>
 
         <form onSubmit={handleSubmit} className="space-y-4">
           {/* Required fields */}
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <Label htmlFor="assetName">Asset Name *</Label>
               <Input
                 id="assetName"
                 value={assetName}
                 onChange={(e) => setAssetName(e.target.value)}
                 placeholder="e.g. Lime Silo Vibrator"
                 required
               />
             </div>
             <div className="space-y-2">
               <Label htmlFor="componentType">Component Type *</Label>
               <Select value={componentType} onValueChange={setComponentType}>
                 <SelectTrigger>
                   <SelectValue placeholder="Select type" />
                 </SelectTrigger>
                 <SelectContent>
                   {componentTypes.map((type) => (
                     <SelectItem key={type} value={type}>
                       {type}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
           </div>
 
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <Label htmlFor="assetNumber">Asset Number</Label>
               <Input
                 id="assetNumber"
                 value={assetNumber}
                 onChange={(e) => setAssetNumber(e.target.value)}
                 placeholder="e.g. LSIL01-VIB01"
               />
             </div>
             <div className="space-y-2">
               <Label htmlFor="parentAsset">Parent Asset</Label>
               <Input
                 id="parentAsset"
                 value={parentAsset}
                 onChange={(e) => setParentAsset(e.target.value)}
                 placeholder="e.g. RGT01 Reagents"
               />
             </div>
           </div>
 
           <div className="grid grid-cols-3 gap-4">
             <div className="space-y-2">
               <Label htmlFor="area">Area</Label>
               <Select value={area} onValueChange={setArea}>
                 <SelectTrigger>
                   <SelectValue placeholder="Select" />
                 </SelectTrigger>
                 <SelectContent>
                   {areas.map((a) => (
                     <SelectItem key={a} value={a}>
                       {a}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
             <div className="space-y-2">
               <Label htmlFor="subArea">Sub-Area</Label>
               <Input
                 id="subArea"
                 value={subArea}
                 onChange={(e) => setSubArea(e.target.value)}
                 placeholder="e.g. Reagents"
               />
             </div>
             <div className="space-y-2">
               <Label htmlFor="system">System</Label>
               <Input
                 id="system"
                 value={system}
                 onChange={(e) => setSystem(e.target.value)}
                 placeholder="e.g. Reagents"
               />
             </div>
           </div>
 
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <Label htmlFor="componentName">Component Name</Label>
               <Input
                 id="componentName"
                 value={componentName}
                 onChange={(e) => setComponentName(e.target.value)}
                 placeholder="Defaults to Asset Name"
               />
             </div>
             <div className="space-y-2">
               <Label htmlFor="componentFunction">Function</Label>
              <Select 
                value={componentFunction || NONE_VALUE} 
                onValueChange={(v) => setComponentFunction(v === NONE_VALUE ? "" : v as any)}
              >
                 <SelectTrigger>
                   <SelectValue placeholder="Select" />
                 </SelectTrigger>
                 <SelectContent>
                    <SelectItem value={NONE_VALUE}>None</SelectItem>
                   <SelectItem value="Drive">Drive</SelectItem>
                   <SelectItem value="Support">Support</SelectItem>
                   <SelectItem value="Control">Control</SelectItem>
                   <SelectItem value="Safety">Safety</SelectItem>
                 </SelectContent>
               </Select>
             </div>
           </div>
 
           <div className="space-y-2">
             <Label htmlFor="pidTag">P&ID Tag</Label>
             <Input
               id="pidTag"
               value={pidTag}
               onChange={(e) => setPidTag(e.target.value)}
               placeholder="e.g. P-101"
             />
           </div>
 
           {/* OEM Fields (optional) */}
           <div className="border-t pt-4">
             <p className="text-sm text-muted-foreground mb-3">
               OEM Details (optional - can be filled after verification)
             </p>
             <div className="grid grid-cols-3 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="oemManufacturer">Manufacturer</Label>
                 <Input
                   id="oemManufacturer"
                   value={oemManufacturer}
                   onChange={(e) => setOemManufacturer(e.target.value)}
                   placeholder="e.g. SEW"
                 />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="oemModel">Model</Label>
                 <Input
                   id="oemModel"
                   value={oemModel}
                   onChange={(e) => setOemModel(e.target.value)}
                   placeholder="e.g. K87"
                 />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="oemSerialNumber">Serial Number</Label>
                 <Input
                   id="oemSerialNumber"
                   value={oemSerialNumber}
                   onChange={(e) => setOemSerialNumber(e.target.value)}
                 />
               </div>
             </div>
           </div>
 
           <div className="space-y-2">
             <Label htmlFor="notes">Notes</Label>
             <Textarea
               id="notes"
               value={notes}
               onChange={(e) => setNotes(e.target.value)}
               placeholder="Any additional information..."
               className="min-h-[60px]"
             />
           </div>
 
           <DialogFooter>
             <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
               Cancel
             </Button>
             <Button type="submit" disabled={saving}>
               {saving ? "Adding..." : "Add Component"}
             </Button>
           </DialogFooter>
         </form>
       </DialogContent>
     </Dialog>
   );
 };