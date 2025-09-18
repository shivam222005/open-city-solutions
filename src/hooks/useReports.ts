import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type ReportCategory = Database['public']['Enums']['report_category'];
type ReportPriority = Database['public']['Enums']['report_priority'];
type ReportStatus = Database['public']['Enums']['report_status'];

interface ReportData {
  title: string;
  description: string;
  category: ReportCategory;
  priority: ReportPriority;
  location_address: string;
  latitude?: number;
  longitude?: number;
  is_anonymous: boolean;
}

interface Report {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  priority: ReportPriority;
  status: ReportStatus;
  location_address: string;
  latitude?: number | null;
  longitude?: number | null;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
  resolved_at?: string | null;
  user_id: string | null;
  assignee_id?: string | null;
  department?: string | null;
  internal_notes?: string | null;
  media_urls?: string[] | null;
}

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: "Error",
        description: "Failed to load reports",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    
    // Set up real-time subscription for reports changes
    const channel = supabase
      .channel('reports-changes')  
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reports'
        },
        () => {
          // Refresh reports when changes occur
          fetchReports();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const createReport = async (reportData: ReportData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('reports')
        .insert([{
          ...reportData,
          user_id: reportData.is_anonymous ? null : user?.id,
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Report submitted successfully",
      });

      // Refresh reports list
      fetchReports();
      
      return { data, error: null };
    } catch (error) {
      console.error('Error creating report:', error);
      toast({
        title: "Error", 
        description: "Failed to submit report",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateReportStatus = async (reportId: string, status: ReportStatus, assigneeId?: string) => {
    try {
      const updateData: any = { status, updated_at: new Date().toISOString() };
      if (assigneeId) updateData.assignee_id = assigneeId;

      const { error } = await supabase
        .from('reports')
        .update(updateData)
        .eq('id', reportId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Report status updated",
      });

      fetchReports();
    } catch (error) {
      console.error('Error updating report:', error);
      toast({
        title: "Error",
        description: "Failed to update report status", 
        variant: "destructive",
      });
    }
  };

  return {
    reports,
    loading,
    createReport,
    updateReportStatus,
    fetchReports
  };
}