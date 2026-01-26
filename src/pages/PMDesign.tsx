import { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, List, FileText, BookOpen } from "lucide-react";
import { PMMasterList } from "@/components/pm-design/PMMasterList";
import { PMTemplates } from "@/components/pm-design/PMTemplates";
import { PMPrinciples } from "@/components/pm-design/PMPrinciples";

const PMDesign = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-6">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </Link>
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center shadow-gold">
              <span className="text-primary-foreground font-bold text-lg">TC</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Preventive Maintenance (PM) Design
              </h1>
              <p className="text-muted-foreground text-sm">
                Design PMs by equipment type — NOT linked to specific assets
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 space-y-8">
        {/* Info Banner */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-primary text-sm font-bold">!</span>
          </div>
          <div className="text-sm">
            <p className="text-foreground font-medium">
              PMs are designed by EQUIPMENT TYPE first, not by specific asset.
            </p>
            <p className="text-muted-foreground mt-1">
              Asset linking happens externally in the CMMS. This workspace is for PM logic and template design only.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="master-list" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="master-list" className="gap-2">
              <List className="h-4 w-4" />
              PM Master List
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-2">
              <FileText className="h-4 w-4" />
              PM Templates
            </TabsTrigger>
            <TabsTrigger value="principles" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Design Principles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="master-list" className="mt-6">
            <PMMasterList />
          </TabsContent>

          <TabsContent value="templates" className="mt-6">
            <PMTemplates />
          </TabsContent>

          <TabsContent value="principles" className="mt-6">
            <PMPrinciples />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default PMDesign;
